import uuid
from app.models.basemodel import BaseModel
from app.models.bookmarktag import BookmarkTag
from sqlmodel import Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.bookmark import BookMark
    from app.models.user import User

class Tag(BaseModel, table=True):
    name: str = Field(unique=True, index=True)

    user_id: uuid.UUID = Field(default=None, foreign_key="user.id")
    
    user: "User" = Relationship(back_populates="tags")
    bookmarks: list["BookMark"] = Relationship(back_populates="tags", link_model=BookmarkTag)
