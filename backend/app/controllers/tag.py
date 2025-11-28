from typing import List
from sqlmodel import Session, select
from fastapi import Depends, APIRouter, HTTPException
from app.models.tag import Tag
import uuid

from app.config.db.database import get_session, Session
from app.models.tag import Tag
from app.models.bookmark import BookMark
from app.models.bookmarktag import BookmarkTag
from app.models.user import User
from app.schemas.tag import TagCreate, TagRead, TagUpdate, TagReadWithBookmarks
from app.schemas.bookmark import BookmarkRead
from app.controllers.user import get_current_user

def process_tags(session: Session, tag_names: List[str], user_id: uuid.UUID) -> List[Tag]:
    tag_objects = []
    for name in tag_names:
        clean_name = name.lower().strip()
        
        statement = (
            select(Tag)
            .where(Tag.name == clean_name)
            .where(Tag.user_id == user_id)
        )
        tag = session.exec(statement).first()
        
        if not tag:
            tag = Tag(name=clean_name, user_id=user_id)
            session.add(tag)
            
        tag_objects.append(tag)
    return tag_objects

router = APIRouter(prefix="/tags", tags=["Tags"])

@router.get("/", response_model=List[TagRead])
def get_my_tags(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = (
        select(Tag)
        .join(BookmarkTag)
        .join(BookMark)
        .where(BookMark.user_id == current_user.id)
        .distinct()
    )
    
    tags = session.exec(statement).all()
    return tags

@router.get("/{tag_id}", response_model=TagReadWithBookmarks)
def get_tag_details(
    tag_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    tag = session.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    statement = (
        select(BookMark)
        .join(BookmarkTag)
        .where(BookmarkTag.tag_id == tag_id)
        .where(BookMark.user_id == current_user.id)
    )
    
    user_bookmarks = session.exec(statement).all()
    return TagReadWithBookmarks(
        id=tag.id,
        name=tag.name,
        bookmarks=[BookmarkRead.from_orm(b) for b in user_bookmarks]
    )
