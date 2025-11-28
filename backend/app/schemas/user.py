from pydantic import BaseModel, EmailStr
import uuid
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: uuid.UUID
    email: EmailStr
    name: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    name: Optional[str] = None