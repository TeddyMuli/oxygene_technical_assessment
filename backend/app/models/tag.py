from app.models.basemodel import BaseModel
from app.models.bookmarktag import BookmarkTag
from app.models.bookmark import BookMark
from sqlmodel import Field, Relationship

class Tag(BaseModel):
    name: str = Field(unique=True, index=True)

    bookmarks: list["BookMark"] = Relationship(back_populates="tags", link_model=BookmarkTag)
