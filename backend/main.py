from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
from backend.routers import quote, author, collection, user
from backend import models
from backend.database import engine

app = FastAPI()
app.include_router(quote.router)
app.include_router(author.router)
app.include_router(collection.router)
app.include_router(user.router)

models.Base.metadata.create_all(engine)

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# homepage
@app.get("/", tags=["Default"])
def home():
    return {"message": "Home page works"}


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
