from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.db.database import init_db
from app.config.config import settings
from app.routes.router import api_router
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()

    yield


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "https://oxygene-bookmarks.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get('/')
def root():
    return "Bookmarks App"
