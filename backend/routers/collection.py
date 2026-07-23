from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.params import Depends
from backend.database import get_db
from backend import models
from typing import List
from backend import schemas

router = APIRouter(tags=["Collections"], prefix="/collections")


@router.get("/", response_model=List[schemas.DisplayCollection])
def collections(db: Session = Depends(get_db)):
    return db.query(models.Collection).order_by(models.Collection.title).all()


@router.get("/search")
def search_collections(q: str, db: Session = Depends(get_db)):
    result = (
        db.query(models.Collection)
        .filter(models.Collection.title.contains(q))
        .order_by(models.Collection.title)
        .all()
    )
    return result


@router.get("/{id}", response_model=schemas.DisplayCollectionWithQuotes)
def get_collection(id: int, db: Session = Depends(get_db)):
    collection = db.query(models.Collection).filter(models.Collection.id == id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    return schemas.DisplayCollectionWithQuotes(
        id=collection.id,
        title=collection.title,
        description=collection.description,
        quotes=[schemas.DisplayQuote.from_orm(q) for q in collection.quotes],
    )


@router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=schemas.DisplayCollection
)
def add(request: schemas.Collection, db: Session = Depends(get_db)):
    new_collection = models.Collection(
        title=request.title, description=request.description
    )
    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)
    return new_collection


@router.post("/{collection_id}/quotes/{quote_id}", status_code=status.HTTP_200_OK)
def add_quote_to_collection(
    collection_id: int, quote_id: int, db: Session = Depends(get_db)
):
    collection = (
        db.query(models.Collection)
        .filter(models.Collection.id == collection_id)
        .first()
    )
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    if quote in collection.quotes:
        return {"detail": "Quote already in collection"}

    collection.quotes.append(quote)
    db.commit()

    return {"detail": "Quote added to collection"}


@router.delete("/{collection_id}/quotes/{quote_id}", status_code=status.HTTP_200_OK)
def remove_quote_from_collection(
    collection_id: int, quote_id: int, db: Session = Depends(get_db)
):
    collection = (
        db.query(models.Collection)
        .filter(models.Collection.id == collection_id)
        .first()
    )
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    if quote not in collection.quotes:
        return {"detail": "Quote not in collection"}

    collection.quotes.remove(quote)
    db.commit()

    return {"detail": "Quote removed from collection"}


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_collection(id: int, db: Session = Depends(get_db)):
    collection = db.query(models.Collection).filter(models.Collection.id == id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    db.delete(collection)
    db.commit()

    return {"detail": "Collection deleted"}
