from sqlmodel import Field, Relationship
from app.models.basemodel import BaseModel
from app.models.user import User
import uuid

class BookMark(BaseModel):
    title: str = Field(index=True)
    user_id: uuid.UUID  = Field(foreign_key="user.id")
    url: str
    description: str

    user: list["User"] = Relationship(back_populates="bookmarks")
