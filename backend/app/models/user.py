from sqlmodel import SQLModel, Field
from typing import Optional
import uuid

class User(SQLModel, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, 
        primary_key=True,
        index=True,
        nullable=False
    )
    email: str = Field(unique=True, index=True)
    name: str
    password: str
