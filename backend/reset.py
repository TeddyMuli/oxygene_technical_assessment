# reset.py
from sqlmodel import SQLModel
from app.config.db.database import engine

# --- CRITICAL: Import ALL your models here ---
# If you don't import them, SQLModel won't know they exist
# and won't create the tables for them!
from app.models.user import User
from app.models.bookmark import BookMark
from app.models.tag import Tag
from app.models.bookmarktag import BookmarkTag

def reset_database():
    print("Dropping all tables...")
    # This deletes every table defined in your models
    SQLModel.metadata.drop_all(engine)
    
    print("Creating new tables...")
    # This creates the tables based on your CURRENT code
    SQLModel.metadata.create_all(engine)
    
    print("Done! Database is fresh.")

if __name__ == "__main__":
    reset_database()