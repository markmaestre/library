from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime, timedelta
from app.models.book import Book, BorrowRequest, BorrowRecord, ReturnRequest, BookStatus, BorrowStatus
from app.config.database import db
from app.utils.auth_handler import get_current_user

book_router = APIRouter(prefix="/books", tags=["Books"])

# Helper function to convert ObjectId to string
def convert_objectid(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# Helper to check if ObjectId is valid
def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except:
        return False

# BOOK MANAGEMENT
@book_router.get("/")
async def get_available_books():
    books = await db["books"].find({"available_copies": {"$gt": 0}}).to_list(1000)
    return [convert_objectid(book) for book in books]

@book_router.get("/all")
async def get_all_books(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    books = await db["books"].find().to_list(1000)
    return [convert_objectid(book) for book in books]

@book_router.post("/")
async def add_book(book: Book, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Check if book with same ISBN already exists
    existing_book = await db["books"].find_one({"isbn": book.isbn})
    if existing_book:
        raise HTTPException(status_code=400, detail="Book with this ISBN already exists")
    
    book_dict = book.dict()
    await db["books"].insert_one(book_dict)
    return {"message": "Book added successfully", "book": convert_objectid(book_dict)}

# BORROWING SYSTEM - FIXED VERSION
@book_router.post("/borrow")
async def borrow_book(borrow_request: BorrowRequest, current_user: dict = Depends(get_current_user)):
    user_email = current_user.get("email")
    
    # Validate book_id format
    if not is_valid_objectid(borrow_request.book_id):
        raise HTTPException(status_code=400, detail="Invalid book ID format")
    
    # Check if book exists and is available
    book = await db["books"].find_one({"_id": ObjectId(borrow_request.book_id)})
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if book["available_copies"] <= 0:
        raise HTTPException(status_code=400, detail="No copies available")
    
    # Check if user already borrowed this book and not returned
    existing_borrow = await db["borrow_records"].find_one({
        "book_id": borrow_request.book_id,
        "user_email": user_email,
        "status": BorrowStatus.BORROWED
    })
    
    if existing_borrow:
        raise HTTPException(status_code=400, detail="You have already borrowed this book")
    
    # Create borrow record
    borrow_date = datetime.now()
    due_date = borrow_date + timedelta(days=borrow_request.borrow_days)
    
    borrow_record = {
        "book_id": borrow_request.book_id,
        "user_email": user_email,
        "borrow_date": borrow_date,
        "due_date": due_date,
        "status": BorrowStatus.BORROWED,
        "fine_amount": 0.0,
        "return_date": None
    }
    
    # Update book available copies
    await db["books"].update_one(
        {"_id": ObjectId(borrow_request.book_id)},
        {"$inc": {"available_copies": -1}}
    )
    
    # Insert borrow record
    result = await db["borrow_records"].insert_one(borrow_record)
    borrow_record["_id"] = result.inserted_id
    
    # Prepare response
    borrow_record_response = convert_objectid(borrow_record)
    borrow_record_response["book"] = convert_objectid(book)
    
    return {
        "message": "Book borrowed successfully",
        "receipt": {
            "transaction_id": str(borrow_record["_id"]),
            "book_title": book["title"],
            "user_name": current_user.get("name"),
            "borrow_date": borrow_date.isoformat(),
            "due_date": due_date.isoformat(),
            "fine_note": "Please screenshot this receipt. Present it to collect your book."
        }
    }

@book_router.post("/return")
async def return_book(return_request: ReturnRequest, current_user: dict = Depends(get_current_user)):
    user_email = current_user.get("email")
    
    # Validate borrow_id format
    if not is_valid_objectid(return_request.borrow_id):
        raise HTTPException(status_code=400, detail="Invalid borrow ID format")
    
    # Find borrow record
    borrow_record = await db["borrow_records"].find_one({
        "_id": ObjectId(return_request.borrow_id),
        "user_email": user_email
    })
    
    if not borrow_record:
        raise HTTPException(status_code=404, detail="Borrow record not found")
    
    if borrow_record["status"] == BorrowStatus.RETURNED:
        raise HTTPException(status_code=400, detail="Book already returned")
    
    # Calculate fine if overdue
    return_date = datetime.now()
    fine_amount = 0.0
    
    if return_date > borrow_record["due_date"]:
        days_overdue = (return_date - borrow_record["due_date"]).days
        fine_amount = days_overdue * 5.0  # $5 per day fine
    
    # Update borrow record
    await db["borrow_records"].update_one(
        {"_id": ObjectId(return_request.borrow_id)},
        {
            "$set": {
                "return_date": return_date,
                "status": BorrowStatus.RETURNED,
                "fine_amount": fine_amount
            }
        }
    )
    
    # Update book available copies
    await db["books"].update_one(
        {"_id": ObjectId(borrow_record["book_id"])},
        {"$inc": {"available_copies": 1}}
    )
    
    return {"message": "Book returned successfully", "fine_amount": fine_amount}

@book_router.get("/my-borrows")
async def get_my_borrowed_books(current_user: dict = Depends(get_current_user)):
    user_email = current_user.get("email")
    
    borrow_records = await db["borrow_records"].find({
        "user_email": user_email,
        "status": BorrowStatus.BORROWED
    }).sort("borrow_date", -1).to_list(1000)
    
    # Get book details for each borrow record
    result = []
    for record in borrow_records:
        book = await db["books"].find_one({"_id": ObjectId(record["book_id"])})
        record = convert_objectid(record)
        if book:
            record["book"] = convert_objectid(book)
        result.append(record)
    
    return result

@book_router.get("/borrowing-history")
async def get_borrowing_history(current_user: dict = Depends(get_current_user)):
    user_email = current_user.get("email")
    
    borrow_records = await db["borrow_records"].find({
        "user_email": user_email,
        "status": BorrowStatus.RETURNED
    }).sort("borrow_date", -1).to_list(1000)
    
    # Get book details for each borrow record
    result = []
    for record in borrow_records:
        book = await db["books"].find_one({"_id": ObjectId(record["book_id"])})
        record = convert_objectid(record)
        if book:
            record["book"] = convert_objectid(book)
        result.append(record)
    
    return result

# UPDATE BOOK
@book_router.put("/{book_id}")
async def update_book(book_id: str, book: Book, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if not is_valid_objectid(book_id):
        raise HTTPException(status_code=400, detail="Invalid book ID format")
    
    existing_book = await db["books"].find_one({"_id": ObjectId(book_id)})
    if not existing_book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if ISBN is being changed and if it conflicts with another book
    if book.isbn != existing_book["isbn"]:
        isbn_exists = await db["books"].find_one({"isbn": book.isbn, "_id": {"$ne": ObjectId(book_id)}})
        if isbn_exists:
            raise HTTPException(status_code=400, detail="ISBN already exists")
    
    book_dict = book.dict()
    await db["books"].update_one(
        {"_id": ObjectId(book_id)},
        {"$set": book_dict}
    )
    
    return {"message": "Book updated successfully"}

# DELETE BOOK
@book_router.delete("/{book_id}")
async def delete_book(book_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if not is_valid_objectid(book_id):
        raise HTTPException(status_code=400, detail="Invalid book ID format")
    
    existing_book = await db["books"].find_one({"_id": ObjectId(book_id)})
    if not existing_book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if book is currently borrowed
    active_borrows = await db["borrow_records"].count_documents({
        "book_id": book_id,
        "status": BorrowStatus.BORROWED
    })
    
    if active_borrows > 0:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete book that is currently borrowed"
        )
    
    await db["books"].delete_one({"_id": ObjectId(book_id)})
    return {"message": "Book deleted successfully"}