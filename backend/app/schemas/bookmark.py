import uuid
from typing import List, Optional
from sqlmodel import SQLModel
from app.schemas.tag import TagRead

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

class BookmarkReadWithTags(BookmarkRead):
    tags: List[TagRead] = []
