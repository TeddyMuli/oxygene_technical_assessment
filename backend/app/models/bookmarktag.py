from sqlmodel import SQLModel, Field
import uuid

class BookmarkTag(SQLModel, table=True):
    bookmark_id: uuid.UUID = Field(foreign_key="bookmark.id")
    tag_id: uuid.UUID = Field(foreign_key="tag.id")
