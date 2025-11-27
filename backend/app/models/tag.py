from app.models.basemodel import BaseModel
from sqlmodel import Field

class Tag(BaseModel):
    name: str = Field(unique=True, index=True)
