from fastapi import APIRouter
from app.controllers.user import router as auth_router
from app.controllers.bookmark import router as bookmark_router
from app.controllers.tag import router as tag_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(bookmark_router)
api_router.include_router(tag_router)
