from sqlmodel import Field, Relationship
from app.models.basemodel import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.bookmark import BookMark

class User(BaseModel, table=True):
    email: str = Field(unique=True, index=True)
    name: str
    password: str

    bookmarks: list["BookMark"] = Relationship(back_populates="user", cascade_delete=True)
