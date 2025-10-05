from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class BookStatus(str, Enum):
    AVAILABLE = "available"
    BORROWED = "borrowed"
    RESERVED = "reserved"

class BorrowStatus(str, Enum):
    BORROWED = "borrowed"
    RETURNED = "returned"
    OVERDUE = "overdue"

class Book(BaseModel):
    title: str
    author: str
    isbn: str
    genre: str
    description: str
    published_year: int
    publisher: str
    total_copies: int = Field(default=1)
    available_copies: int = Field(default=1)
    status: BookStatus = Field(default=BookStatus.AVAILABLE)
    image_url: Optional[str] = None

class BorrowRequest(BaseModel):
    book_id: str
    borrow_days: int = Field(default=14, ge=1, le=30)
    # Removed user_email since it comes from JWT token

class BorrowRecord(BaseModel):
    book_id: str
    user_email: str
    borrow_date: datetime
    due_date: datetime
    return_date: Optional[datetime] = None
    status: BorrowStatus = Field(default=BorrowStatus.BORROWED)
    fine_amount: float = Field(default=0.0)

class ReturnRequest(BaseModel):
    borrow_id: str