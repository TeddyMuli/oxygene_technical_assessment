from typing import List, Optional
from sqlmodel import SQLModel
import uuid

class TagBase(SQLModel):
    name: str

# Create (Input)
class TagCreate(TagBase):
    pass

# Update (Input)
class TagUpdate(SQLModel):
    name: Optional[str] = None

# Read (Output)
class TagRead(TagBase):
    id: uuid.UUID

# Read with Bookmarks (Output)
# We use a string forward reference to avoid circular imports in Pydantic
class TagReadWithBookmarks(TagRead):
    from app.schemas.bookmark import BookmarkRead
    bookmarks: List[BookmarkRead] = []