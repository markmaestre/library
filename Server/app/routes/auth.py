# routes/auth.py
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import cloudinary
import cloudinary.uploader
import os
from app.models.user import UserRegister, UserLogin, ProfileUpdate
from app.config.database import db
from app.utils.auth_handler import create_access_token, verify_token

auth_router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Pydantic models for new endpoints
class BanUserRequest(BaseModel):
    reason: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    is_banned: bool
    ban_reason: Optional[str] = None
    banned_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    profile_image: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None

# Dependency to get current user
async def get_current_user(token: str = Depends(verify_token)):
    return token

# Dependency to check if user is admin
async def get_current_admin(token: str = Depends(verify_token)):
    if token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return token

# REGISTER (with profile image)
@auth_router.post("/register")
async def register(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    dob: str = Form(...),
    gender: str = Form(...),
    address: str = Form(...),
    phone: str = Form(...),
    role: str = Form(default="user"),
    profile_image: Optional[UploadFile] = File(None)
):
    existing_user = await db["users"].find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(password)
    
    # Ensure role is valid
    if role not in ["admin", "user"]:
        role = "user"

    # Handle profile image upload
    profile_image_url = None
    if profile_image:
        try:
            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                profile_image.file,
                folder="user_profiles",
                public_id=f"profile_{email}"
            )
            profile_image_url = upload_result["secure_url"]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

    # Create user document
    user_dict = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "dob": dob,
        "gender": gender,
        "address": address,
        "phone": phone,
        "role": role,
        "is_banned": False,
        "ban_reason": None,
        "banned_at": None,
        "created_at": datetime.utcnow(),
        "profile_image": profile_image_url
    }

    await db["users"].insert_one(user_dict)
    return {"message": "User registered successfully", "role": role}

# LOGIN
@auth_router.post("/login")
async def login(user: UserLogin):
    existing_user = await db["users"].find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Check if user is banned
    if existing_user.get("is_banned", False):
        ban_reason = existing_user.get("ban_reason", "No reason provided")
        raise HTTPException(
            status_code=403, 
            detail=f"Account is banned. Reason: {ban_reason}"
        )

    if not pwd_context.verify(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({
        "email": user.email,
        "role": existing_user.get("role", "user"),
        "name": existing_user.get("name", ""),
        "user_id": str(existing_user["_id"])
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": existing_user.get("role", "user"),
        "name": existing_user.get("name", ""),
        "profile_image": existing_user.get("profile_image")
    }

# GET MY PROFILE
@auth_router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    user = await db["users"].find_one({"email": current_user["email"]}, {"password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "user"),
        "is_banned": user.get("is_banned", False),
        "ban_reason": user.get("ban_reason"),
        "banned_at": user.get("banned_at"),
        "created_at": user.get("created_at"),
        "profile_image": user.get("profile_image"),
        "dob": user.get("dob"),
        "gender": user.get("gender"),
        "address": user.get("address"),
        "phone": user.get("phone")
    }
# routes/auth.py - Update the update_profile endpoint
@auth_router.put("/profile")
async def update_profile(
    name: Optional[str] = Form(None),
    dob: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    profile_image: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user)
):
    user = await db["users"].find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = {}
    
    # Update basic profile fields
    if name is not None:
        update_data["name"] = name
    if dob is not None:
        update_data["dob"] = dob
    if gender is not None:
        update_data["gender"] = gender
    if address is not None:
        update_data["address"] = address
    if phone is not None:
        update_data["phone"] = phone

    # Handle profile image upload
    if profile_image:
        try:
            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                profile_image.file,
                folder="user_profiles",
                public_id=f"profile_{current_user['email']}"
            )
            update_data["profile_image"] = upload_result["secure_url"]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

    if update_data:
        await db["users"].update_one(
            {"email": current_user["email"]},
            {"$set": update_data}
        )

    return {"message": "Profile updated successfully"}

# UPDATE PROFILE IMAGE ONLY
@auth_router.put("/profile/image")
async def update_profile_image(
    profile_image: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    user = await db["users"].find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(
            profile_image.file,
            folder="user_profiles",
            public_id=f"profile_{current_user['email']}"
        )
        profile_image_url = upload_result["secure_url"]
        
        # Update user profile image
        await db["users"].update_one(
            {"email": current_user["email"]},
            {"$set": {"profile_image": profile_image_url}}
        )

        return {"message": "Profile image updated successfully", "profile_image": profile_image_url}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

# GET ALL USERS (Admin only)
@auth_router.get("/users", response_model=List[UserResponse])
async def get_all_users(current_admin: dict = Depends(get_current_admin)):
    users = []
    async for user in db["users"].find({}, {"password": 0}):  # Exclude password
        users.append({
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user.get("name", ""),
            "role": user.get("role", "user"),
            "is_banned": user.get("is_banned", False),
            "ban_reason": user.get("ban_reason"),
            "banned_at": user.get("banned_at"),
            "created_at": user.get("created_at"),
            "profile_image": user.get("profile_image"),
            "dob": user.get("dob"),
            "gender": user.get("gender"),
            "address": user.get("address"),
            "phone": user.get("phone")
        })
    return users

# BAN USER (Admin only)
@auth_router.post("/users/{user_id}/ban")
async def ban_user(
    user_id: str, 
    ban_request: BanUserRequest,
    current_admin: dict = Depends(get_current_admin)
):
    from bson import ObjectId
    
    try:
        user_object_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = await db["users"].find_one({"_id": user_object_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent banning admins
    if user.get("role") == "admin":
        raise HTTPException(status_code=400, detail="Cannot ban admin users")

    update_result = await db["users"].update_one(
        {"_id": user_object_id},
        {
            "$set": {
                "is_banned": True,
                "ban_reason": ban_request.reason,
                "banned_at": datetime.utcnow()
            }
        }
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to ban user")

    return {"message": "User banned successfully", "reason": ban_request.reason}

# UNBAN USER (Admin only)
@auth_router.post("/users/{user_id}/unban")
async def unban_user(
    user_id: str, 
    current_admin: dict = Depends(get_current_admin)
):
    from bson import ObjectId
    
    try:
        user_object_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = await db["users"].find_one({"_id": user_object_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_result = await db["users"].update_one(
        {"_id": user_object_id},
        {
            "$set": {
                "is_banned": False,
                "ban_reason": None,
                "banned_at": None
            }
        }
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to unban user")

    return {"message": "User unbanned successfully"}

# GET USER BY ID (Admin only)
@auth_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, current_admin: dict = Depends(get_current_admin)):
    from bson import ObjectId
    
    try:
        user_object_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = await db["users"].find_one({"_id": user_object_id}, {"password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "user"),
        "is_banned": user.get("is_banned", False),
        "ban_reason": user.get("ban_reason"),
        "banned_at": user.get("banned_at"),
        "created_at": user.get("created_at"),
        "profile_image": user.get("profile_image"),
        "dob": user.get("dob"),
        "gender": user.get("gender"),
        "address": user.get("address"),
        "phone": user.get("phone")
    }