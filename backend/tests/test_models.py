import uuid
import pytest
from app.models.bookmark import BookMark
from app.models.tag import Tag
from app.models.user import User
from unittest.mock import AsyncMock, patch

@pytest.mark.asyncio
async def test_create_bookmark_with_relationships(session):
    user = User(id=uuid.uuid4(), name="Test", email="test@test.com", password="hashed_pw")
    session.add(user)
    session.commit()
    session.refresh(user)

    tag_python = Tag(name="python", user_id=user.id)
    tag_coding = Tag(name="coding", user_id=user.id)
    session.add(tag_coding)
    session.add(tag_python)
    session.commit()

    with patch("app.utils.ai_summary.generate_summary", new_callable=AsyncMock) as mock_summary:
        mock_summary.return_value = "This is a fake AI summary."
        from app.utils.ai_summary import generate_summary
        ai_summary = await generate_summary("https://fastapi.tiangolo.com")

        bookmark = BookMark(
            title="Fastapi Documentation",
            url="https://fastapi.tiangolo.com",
            description="Documentation",
            user_id=user.id,
            tags=[tag_python, tag_coding],
            user=user,
            ai_summary=ai_summary
        )

        session.add(bookmark)
        session.commit()
        session.refresh(bookmark)

        assert bookmark.ai_summary == "This is a fake AI summary."
        assert len(bookmark.tags) == 2

    assert bookmark.id is not None

    assert bookmark.user_id == user.id
    assert bookmark.user.email == user.email

    assert bookmark.tags[0].name in ["python", "coding"]

    session.refresh(tag_python)
    assert len(tag_python.bookmarks) == 1
    assert tag_python.bookmarks[0].title == "Fastapi Documentation"
