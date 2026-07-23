from sqlalchemy import Column, Integer, String, ForeignKey, Table
from backend.database import Base
from sqlalchemy.orm import relationship

# this model file is used for creating table inside of database

quote_collection = Table(
    "quote_collection",
    Base.metadata,
    Column("quote_id", Integer, ForeignKey("Quote.id")),
    Column("collection_id", Integer, ForeignKey("Collection.id")),
)


class Quote(Base):
    __tablename__ = "Quote"
    id = Column(Integer, primary_key=True, index=True)
    quote = Column(String)
    # author = Column(String)
    author_id = Column(Integer, ForeignKey("Author.id"), nullable=True)
    author_obj = relationship("Author", back_populates="quotes")
    collections = relationship(
        "Collection", secondary=quote_collection, back_populates="quotes"
    )


class Collection(Base):
    __tablename__ = "Collection"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)

    quotes = relationship(
        "Quote", secondary=quote_collection, back_populates="collections"
    )


class Author(Base):
    __tablename__ = "Author"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    image_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    born = Column(String, nullable=True)
    died = Column(String, nullable=True)
    profession = Column(String, nullable=True)
    quotes = relationship("Quote", back_populates="author_obj")


class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
