import pytest
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool
from fastapi.testclient import TestClient
from main import app
from app.config.db.database import get_session
from app.models.user import User
from app.utils.security import get_password_hash, create_access_token
import uuid

TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )

    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        yield session

    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

@pytest.fixture(name="auth_headers")
def auth_headers_fixture(session: Session):
    user = User(
        id=uuid.uuid4(),
        email="user_a@test.com",
        password=get_password_hash("password123"),
        name="user a"
    )
    session.add(user)
    session.commit()
    token = create_access_token(subject=user.id)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(name="other_user_headers")
def other_user_headers_fixture(session: Session):
    user = User(
        id=uuid.uuid4(),
        email="user_b@test.com",
        password=get_password_hash("password456"),
        name="user b"
    )
    session.add(user)
    session.commit()
    token = create_access_token(subject=user.id)
    return {"Authorization": f"Bearer {token}"}
