from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.db.database import init_db
from app.config.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()

    yield


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)
