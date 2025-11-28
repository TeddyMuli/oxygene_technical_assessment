from app.models.bookmark import BookMark
from app.models.tag import Tag
from sqlmodel import select

# 1. CREATE
def test_create_bookmark(client, session, auth_headers):
    payload = {
        "title": "FastAPI Docs",
        "url": "https://fastapi.tiangolo.com",
        "description": "Docs",
        "tags": ["python", "api"]
    }
    response = client.post("/bookmarks/", json=payload, headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "FastAPI Docs"
    assert len(data["tags"]) == 2
    
    # Verify DB Logic
    db_tags = session.exec(select(Tag)).all()
    assert len(db_tags) == 2

# 2. READ ALL
def test_read_bookmarks(client, auth_headers):
    # Create 2 bookmarks
    client.post("/bookmarks/", json={"title": "B1", "url": "u1", "tags": []}, headers=auth_headers)
    client.post("/bookmarks/", json={"title": "B2", "url": "u2", "tags": []}, headers=auth_headers)
    
    response = client.get("/bookmarks/", headers=auth_headers)
    assert len(response.json()) == 2

# 3. READ ONE (and Privacy)
def test_read_bookmark_privacy(client, auth_headers, other_user_headers):
    # User A creates a bookmark
    create_res = client.post("/bookmarks/", json={"title": "Secret", "url": "u1"}, headers=auth_headers)
    bookmark_id = create_res.json()["id"]
    
    # User B tries to read it
    response = client.get(f"/bookmarks/{bookmark_id}", headers=other_user_headers)
    assert response.status_code == 403 # Forbidden!

# 4. UPDATE
def test_update_bookmark(client, auth_headers):
    # Create
    create_res = client.post("/bookmarks/", json={"title": "Old", "url": "u1", "tags": ["old"]}, headers=auth_headers)
    b_id = create_res.json()["id"]
    
    # Update: Change title and REPLACE tags
    update_payload = {
        "title": "New Title",
        "tags": ["new"] # "old" tag should be removed from this bookmark
    }
    response = client.patch(f"/bookmarks/{b_id}", json=update_payload, headers=auth_headers)
    
    data = response.json()
    assert data["title"] == "New Title"
    assert len(data["tags"]) == 1
    assert data["tags"][0]["name"] == "new"

# 5. DELETE
def test_delete_bookmark(client, session, auth_headers):
    create_res = client.post("/bookmarks/", json={"title": "Del", "url": "u1"}, headers=auth_headers)
    b_id = create_res.json()["id"]
    
    response = client.delete(f"/bookmarks/{b_id}", headers=auth_headers)
    assert response.status_code == 200
    
    # Verify gone
    assert session.get(BookMark, b_id) is None
