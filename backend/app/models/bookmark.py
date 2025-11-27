from sqlmodel import Field, Relationship
from app.models.basemodel import BaseModel
from app.models.bookmarktag import BookmarkTag
from app.models.tag import Tag
from app.models.user import User
import uuid
from typing import Optional

class BookMark(BaseModel):
    title: str = Field(index=True)
    user_id: uuid.UUID  = Field(foreign_key="user.id")
    url: str
    description: str

    user: "User" = Relationship(back_populates="bookmarks")
    tags: list["Tag"] = Relationship(back_populates="bookmarks", link_model=BookmarkTag)
