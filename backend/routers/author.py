from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.params import Depends
from backend.database import get_db
from backend import models
from typing import List
from backend import schemas

router = APIRouter(tags=["Authors"], prefix="/authors")


@router.get("/", response_model=List[schemas.DisplayAuthor])
def authors(db: Session = Depends(get_db)):
    authors = db.query(models.Author).order_by(models.Author.name).all()
    return authors


@router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=schemas.DisplayAuthor
)
def add(request: schemas.Author, db: Session = Depends(get_db)):
    new_author = models.Author(
        name=request.name,
        image_url=request.image_url,
        bio=request.bio,
        born=request.born,
        died=request.died,
        profession=request.profession,
    )
    db.add(new_author)
    db.commit()
    db.refresh(new_author)
    return new_author


@router.put("/{id}", status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.Author, db: Session = Depends(get_db)):
    author_query = db.query(models.Author).filter(models.Author.id == id)
    author_data = author_query.first()

    if not author_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Author with id {id} not found",
        )
    author_query.update(request.model_dump())
    db.commit()

    return {"detail": "Author successfully updated"}


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    author = db.query(models.Author).filter(models.Author.id == id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")

    db.delete(author)
    db.commit()
    return {"message": "Author deleted successfully"}


# migration route for linking quote to author
# What it does: loops through every existing quote,
# checks if an Author row already exists with that name
# — creates one if not — then sets q.author_id to link the quote to it.
# Returns counts so you can confirm it worked.


# @router.get("/migrate-from-quotes")
# def migrate_from_quotes(db: Session = Depends(get_db)):
#     quotes = db.query(models.Quote).all()
#     created = 0
#     linked = 0

#     for q in quotes:
#         if not q.author:
#             continue

#         author_obj = (
#             db.query(models.Author).filter(models.Author.name == q.author).first()
#         )
#         if not author_obj:
#             author_obj = models.Author(name=q.author, image_url=None)
#             db.add(author_obj)
#             db.commit()
#             db.refresh(author_obj)
#             created += 1

#         if q.author_id != author_obj.id:
#             q.author_id = author_obj.id
#             linked += 1

#     db.commit()
#     return {"authors_created": created, "quotes_linked": linked}


@router.get("/search")
def search_authors(q: str, db: Session = Depends(get_db)):
    result = (
        db.query(models.Author)
        .filter(models.Author.name.contains(q))
        .order_by(models.Author.name)
        .all()
    )
    return result


# shows author information and bio
@router.get("/{id}", response_model=schemas.DisplayAuthor)
def get_author(id: int, db: Session = Depends(get_db)):
    author = db.query(models.Author).filter(models.Author.id == id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    return author
