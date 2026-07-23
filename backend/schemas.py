# pydantic models here
from pydantic import BaseModel
from typing import Optional, List

# this model is used for data validation


class Quote(BaseModel):
    quote: str
    author: str


class DisplayQuote(BaseModel):
    id: int
    quote: str
    author: Optional[str] = None
    author_id: Optional[int] = None

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            quote=obj.quote,
            author=obj.author_obj.name if obj.author_obj else None,
            author_id=obj.author_obj.id if obj.author_obj else None,
        )


class Author(BaseModel):
    name: str
    image_url: Optional[str] = None
    bio: Optional[str] = None
    born: Optional[str] = None
    died: Optional[str] = None
    profession: Optional[str] = None


class DisplayAuthor(BaseModel):
    id: int
    name: str
    image_url: Optional[str] = None
    bio: Optional[str] = None
    born: Optional[str] = None
    died: Optional[str] = None
    profession: Optional[str] = None

    class Config:
        from_attributes = True


class Collection(BaseModel):
    title: str
    description: Optional[str] = None


class DisplayCollection(BaseModel):
    id: int
    title: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class DisplayCollectionWithQuotes(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    quotes: List[DisplayQuote] = []

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class DisplayUser(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
