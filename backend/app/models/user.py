from sqlmodel import Field
from app.models.basemodel import BaseModel

class User(BaseModel):
    email: str = Field(unique=True, index=True)
    name: str
    password: str
