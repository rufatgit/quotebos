from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.params import Depends
from backend.database import get_db
from backend import models
from backend import schemas
from backend import auth
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(tags=["Users"], prefix="/users")


@router.post(
    "/signup", status_code=status.HTTP_201_CREATED, response_model=schemas.DisplayUser
)
def signup(request: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = (
        db.query(models.User).filter(models.User.email == request.email).first()
    )
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = auth.hash_password(request.password)
    new_user = models.User(email=request.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()

    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
