import uuid
from app.models.bookmark import BookMark
from app.models.tag import Tag
from app.models.user import User

def test_create_bookmark_with_relationships(session):
    user = User(id=uuid.uuid4(), name="Test", email="test@test.com", password="hashed_pw")
    session.add(user)
    session.commit()
    session.refresh(user)

    tag_python = Tag(name="python")
    tag_coding = Tag(name="coding")
    session.add(tag_coding)
    session.add(tag_python)
    session.commit()

    bookmark = BookMark(
        title="Fastapi Documentation",
        url="https://fastapi.tiangolo.com",
        description="Documentation for the fastapi library",
        user_id=user.id,
        tags=[tag_python, tag_coding],
        user=user
    )
    session.add(bookmark)
    session.commit()
    session.refresh(bookmark)

    assert bookmark.id is not None

    assert bookmark.user_id == user.id
    assert bookmark.user.email == user.email

    assert len(bookmark.tags) == 2
    assert bookmark.tags[0].name in ["python", "coding"]

    session.refresh(tag_python)
    assert len(tag_python.bookmarks) == 1
    assert tag_python.bookmarks[0].title == "Fastapi Documentation"
