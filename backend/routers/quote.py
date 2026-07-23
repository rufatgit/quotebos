from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.params import Depends
from backend.database import get_db
from backend import models
from typing import List
from backend import schemas
from datetime import date
from backend import auth
from datetime import date, timedelta

router = APIRouter(tags=["Quotes"], prefix="/quotes")


@router.get("/", response_model=List[schemas.DisplayQuote])
def quotes(db: Session = Depends(get_db)):
    quotes = db.query(models.Quote).all()
    return [schemas.DisplayQuote.from_orm(q) for q in quotes]


@router.get("/quote-of-the-day", response_model=schemas.DisplayQuote)
def quote_of_the_day(db: Session = Depends(get_db)):
    quotes = db.query(models.Quote).order_by(models.Quote.id).all()
    if not quotes:
        raise HTTPException(status_code=404, detail="No quotes available")

    day_index = date.today().toordinal() % len(quotes)
    selected = quotes[day_index]

    return schemas.DisplayQuote.from_orm(selected)


@router.get("/quote-of-the-day-history")
def quote_of_the_day_history(days: int = 7, db: Session = Depends(get_db)):
    quotes = db.query(models.Quote).order_by(models.Quote.id).all()
    if not quotes:
        return []

    history = []
    for i in range(days):
        day = date.today() - timedelta(days=i)
        day_index = day.toordinal() % len(quotes)
        selected = quotes[day_index]
        history.append(
            {
                "date": day.isoformat(),
                "quote": schemas.DisplayQuote.from_orm(selected),
            }
        )

    return history


# search bar route
@router.get("/search")
def search_quotes(q: str, db: Session = Depends(get_db)):
    result = (
        db.query(models.Quote)
        .join(models.Author)
        .filter(models.Quote.quote.contains(q) | models.Author.name.contains(q))
        .all()
    )
    return [schemas.DisplayQuote.from_orm(r) for r in result]


# This finds the Author by name, creates one if it doesn't exist, then links the new quote to it via author_id.
@router.post("/", status_code=status.HTTP_201_CREATED)
def add(
    request: schemas.Quote,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    author_obj = (
        db.query(models.Author).filter(models.Author.name == request.author).first()
    )
    if not author_obj:
        author_obj = models.Author(name=request.author, image_url=None)
        db.add(author_obj)
        db.commit()
        db.refresh(author_obj)

    new_quote = models.Quote(quote=request.quote, author_id=author_obj.id)
    db.add(new_quote)
    db.commit()
    db.refresh(new_quote)
    return request


# 1. Find the quote — looks up the quote by id, returns 404 if it doesn't exist.
# 2. Find or create the author — takes the author name from the request (e.g. "Marcus Aurelius"), checks if an Author row with that name already exists in the Author table. If yes, uses it. If no, creates a new Author row.
# 3. Update the quote — sets the quote's text to the new value, and sets author_id to point to the correct Author row.
@router.put("/{id}", status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.Quote, db: Session = Depends(get_db)):
    quote_data = db.query(models.Quote).filter(models.Quote.id == id).first()

    if not quote_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quote with id {id} not found",
        )

    # find or create the author
    # This finds the author that's already linked to the quote and updates their name in place
    existing_author = (
        db.query(models.Author).filter(models.Author.id == quote_data.author_id).first()
    )
    if existing_author:
        existing_author.name = request.author
        db.commit()
        author_obj = existing_author
    else:
        author_obj = models.Author(name=request.author, image_url=None)
        db.add(author_obj)
        db.commit()
        db.refresh(author_obj)

    quote_data.quote = request.quote
    quote_data.author_id = author_obj.id
    db.commit()

    return {"detail": "Quote successfully updated"}


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    quote = db.query(models.Quote).filter(models.Quote.id == id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    db.delete(quote)
    db.commit()
    return {"message": "Quote deleted successfully"}
