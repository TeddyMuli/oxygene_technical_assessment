from sqlmodel import Field
from app.models.basemodel import BaseModel
import uuid

class BookMark(BaseModel):
    title: str = Field(index=True)
    user_id: uuid.UUID  = Field(foreign_key="user.id")
    url: str
    description: str
