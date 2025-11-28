from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select

from app.config.db.database import get_session, Session
from app.models.bookmark import BookMark
from app.models.tag import Tag
from app.models.user import User
from app.schemas.bookmark import (
    BookmarkCreate, 
    BookmarkReadWithTags, 
    BookmarkUpdate
)
from app.controllers.user import get_current_user
from app.controllers.tag import process_tags
from app.utils.ai_summary import generate_summary

router = APIRouter(prefix="/bookmarks", tags=["Bookmarks"])

@router.post("/", response_model=BookmarkReadWithTags)
async def create_bookmark(
    bookmark_in: BookmarkCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    tag_objects = process_tags(session, bookmark_in.tags, current_user.id)
    ai_summary = await generate_summary(bookmark_in.url)

    bookmark = BookMark(
        title=bookmark_in.title,
        url=bookmark_in.url,
        description=bookmark_in.description,
        user_id=current_user.id,
        tags=tag_objects,
        ai_summary=ai_summary
    )

    session.add(bookmark)
    session.commit()
    session.refresh(bookmark)
    return bookmark

@router.get("/", response_model=List[BookmarkReadWithTags])
def read_bookmarks(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    statement = (
        select(BookMark)
        .where(BookMark.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
    )
    bookmarks = session.exec(statement).all()
    return bookmarks

@router.get("/{bookmark_id}", response_model=BookmarkReadWithTags)
def read_bookmark(
    bookmark_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    bookmark = session.get(BookMark, bookmark_id)
    
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")
        
    if bookmark.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    return bookmark

@router.patch("/{bookmark_id}", response_model=BookmarkReadWithTags)
def update_bookmark(
    bookmark_id: int,
    bookmark_in: BookmarkUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    bookmark = session.get(BookMark, bookmark_id)
    
    if not bookmark or bookmark.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Bookmark not found")

    if bookmark_in.title is not None:
        bookmark.title = bookmark_in.title
    if bookmark_in.url is not None:
        bookmark.url = bookmark_in.url
    if bookmark_in.description is not None:
        bookmark.description = bookmark_in.description
        
    if bookmark_in.tags is not None:
        tag_objects = process_tags(session, bookmark_in.tags, current_user.id)
        bookmark.tags = tag_objects

    session.add(bookmark)
    session.commit()
    session.refresh(bookmark)
    return bookmark

@router.delete("/{bookmark_id}")
def delete_bookmark(
    bookmark_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    bookmark = session.get(BookMark, bookmark_id)
    
    if not bookmark or bookmark.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Bookmark not found")

    session.delete(bookmark)
    session.commit()
    return {"ok": True}
