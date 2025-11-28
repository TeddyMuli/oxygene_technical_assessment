from app.models.tag import Tag
from sqlmodel import select

# 1. CREATE
def test_create_tag_explicit(client, session, auth_headers):
    response = client.post("/tags/", json={"name": "Explicit Tag"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["name"] == "explicit tag" # Checks lowercase logic

# 2. READ ALL (My Tags)
def test_read_my_tags(client, auth_headers):
    # Create via bookmark
    client.post("/bookmarks/", json={"title": "B1", "url": "u1", "tags": ["python"]}, headers=auth_headers)
    # Create explicit
    client.post("/tags/", json={"name": "rust"}, headers=auth_headers)
    
    response = client.get("/tags/", headers=auth_headers)
    data = response.json()
    assert len(data) == 2
    names = [t["name"] for t in data]
    assert "python" in names
    assert "rust" in names

# 3. READ ONE (With Bookmarks)
def test_read_tag_details(client, auth_headers):
    # Link "python" to 2 bookmarks
    client.post("/bookmarks/", json={"title": "B1", "url": "u1", "tags": ["python"]}, headers=auth_headers)
    client.post("/bookmarks/", json={"title": "B2", "url": "u2", "tags": ["python"]}, headers=auth_headers)
    
    # Get ID of "python" tag
    tags_list = client.get("/tags/", headers=auth_headers).json()
    tag_id = tags_list[0]["id"]
    
    response = client.get(f"/tags/{tag_id}", headers=auth_headers)
    data = response.json()
    assert len(data["bookmarks"]) == 2

# 4. UPDATE (Rename)
def test_rename_tag(client, auth_headers):
    create = client.post("/tags/", json={"name": "typo"}, headers=auth_headers)
    t_id = create.json()["id"]
    
    response = client.patch(f"/tags/{t_id}", json={"name": "fixed"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["name"] == "fixed"

# 5. DELETE
def test_delete_tag(client, session, auth_headers):
    create = client.post("/tags/", json={"name": "waste"}, headers=auth_headers)
    t_id = create.json()["id"]
    
    response = client.delete(f"/tags/{t_id}", headers=auth_headers)
    assert response.status_code == 200
    assert session.get(Tag, t_id) is None
