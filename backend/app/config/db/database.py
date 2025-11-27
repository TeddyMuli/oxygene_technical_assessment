from typing import Annotated

from sqlmodel import Session, create_engine, SQLModel
from app.config.config import settings

database_url = f"{settings.DATABASE_TYPE}://{settings.DATABASE_USER}:{settings.DATABASE_PASSWORD}@{settings.DATABASE_HOST}/{settings.DATABASE_NAME}?sslmode=require"

engine = create_engine(database_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
