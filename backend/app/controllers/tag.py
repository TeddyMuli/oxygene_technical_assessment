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
