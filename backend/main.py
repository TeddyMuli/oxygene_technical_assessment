from fastapi import FastAPI
from app.config.db.database import init_db

app = FastAPI()

@app.on_event("startup")
def start_up():
    init_db()
