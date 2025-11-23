# models/user.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    dob: str
    gender: str
    address: str
    phone: str
    role: str = Field(default="user", description="Role can be 'user' or 'admin'")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    is_banned: Optional[bool] = None
    ban_reason: Optional[str] = None

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    profile_image: Optional[str] = Field(default=None, description="URL or path to profile picture")