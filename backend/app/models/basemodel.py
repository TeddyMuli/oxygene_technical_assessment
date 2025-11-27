from sqlmodel import SQLModel, Field
import uuid
from typing import Optional
from datetime import datetime, timezone, timedelta

class BaseModel(SQLModel, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, 
        primary_key=True,
        index=True,
        nullable=False
    )
    created_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone(timedelta(hours=3)))
    )
    updated_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone(timedelta(hours=3))),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone(timedelta(hours=3)))}
    )
