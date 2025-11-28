from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.db.database import init_db
from app.config.config import settings
from app.routes.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()

    yield


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.include_router(api_router, prefix="/api")

@app.get('/')
def root():
    return "Bookmarks App"
