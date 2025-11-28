def test_register_user(client):
    response = client.post(
        "/register",
        json={"email": "new@test.com", "password": "password123", "name": "test"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "new@test.com"
    assert "password" not in data
    assert data["name"] == "test"

def test_register_duplicate_email(client):
    client.post("/register", json={"email": "dup@test.com", "password": "123", "name": "duplicate"})
    response = client.post("/register", json={"email": "dup@test.com", "password": "123", "name": "duplicate"})
    assert response.status_code == 400

def test_login_success(client):
    client.post("/register", json={"email": "login@test.com", "password": "123", "name": "login test"})
    
    response = client.post(
        "/login",
        json={"email": "login@test.com", "password": "123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_fail(client):
    response = client.post(
        "/login",
        json={"email": "wrong@test.com", "password": "wrong"}
    )
    assert response.status_code == 401

from app.models.user import User
from sqlmodel import select
def test_read_current_user(client, auth_headers):
    response = client.get("/me", headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "user_a@test.com"
    assert "password" not in data
    assert "id" in data
    
def test_update_me(client, session, auth_headers):
    response = client.patch(
        "/me",
        json={"email": "updated@test.com"},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["email"] == "updated@test.com"
    
    user = session.exec(select(User).where(User.email == "updated@test.com")).first()
    assert user is not None

def test_update_me_duplicate_email_fail(client, auth_headers, other_user_headers):
    response = client.patch(
        "/me",
        json={"email": "user_b@test.com"},
        headers=auth_headers
    )
    assert response.status_code == 400

def test_delete_me(client, session, auth_headers):
    response = client.delete("/me", headers=auth_headers)
    assert response.status_code == 200
    
    user = session.exec(select(User).where(User.email == "user_a@test.com")).first()
    assert user is None
