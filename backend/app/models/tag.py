from app.models.basemodel import BaseModel
from app.models.bookmarktag import BookmarkTag
from sqlmodel import Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.bookmark import BookMark


class Tag(BaseModel, table=True):
    name: str = Field(unique=True, index=True)

    bookmarks: list["BookMark"] = Relationship(back_populates="tags", link_model=BookmarkTag)
