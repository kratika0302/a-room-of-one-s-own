from sqlalchemy import Column, Integer, String, DateTime, Text, JSON, ForeignKey, Date
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    theme = Column(String, default="white")  # default 'white' as seen in frontend
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Entry(Base):
    __tablename__ = "entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Core fields
    type = Column(String, nullable=False)  # Movies, Books, Quotes, etc.
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)

    # Metadata
    author = Column(String, nullable=True)
    source = Column(String, nullable=True)
    url = Column(String, nullable=True)
    rating = Column(Integer, nullable=True)
    tags = Column(JSON, default=[])

    # Media
    cover_img = Column(Text, nullable=True)  # Storing as text (Base64 or URL)
    photo_img = Column(Text, nullable=True)  # Storing as text (Base64 or URL)

    # Timing
    date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
