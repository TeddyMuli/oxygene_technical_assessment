from typing import List, Optional
from sqlmodel import SQLModel
import uuid

class TagBase(SQLModel):
    name: str

class TagCreate(TagBase):
    pass

class TagUpdate(SQLModel):
    name: Optional[str] = None

class TagRead(TagBase):
    id: uuid.UUID
    
from app.schemas.bookmark import BookmarkRead
class TagReadWithBookmarks(TagRead):
    bookmarks: List[BookmarkRead] = []