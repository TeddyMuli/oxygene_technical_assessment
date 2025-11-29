import uuid
from typing import List, Optional
from sqlmodel import SQLModel
from datetime import datetime

class BookmarkBase(SQLModel):
    title: str
    url: str
    description: Optional[str] = None

class BookmarkCreate(BookmarkBase):
    tags: List[str] = [] 

class BookmarkUpdate(SQLModel):
    title: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

class BookmarkRead(BookmarkBase):
    id: uuid.UUID
    user_id: uuid.UUID
    ai_summary: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

from app.schemas.tag import TagRead
class BookmarkReadWithTags(BookmarkRead):
    tags: List[TagRead] = []
