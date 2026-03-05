from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    theme: Optional[str] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class EntryCreate(BaseModel):
    type: str
    title: str
    body: str
    author: Optional[str] = None
    source: Optional[str] = None
    url: Optional[str] = None
    rating: Optional[int] = None
    tags: Optional[List[str]] = []
    date: date
    cover_img: Optional[str] = None
    photo_img: Optional[str] = None


class EntryUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    author: Optional[str] = None
    source: Optional[str] = None
    url: Optional[str] = None
    rating: Optional[int] = None
    tags: Optional[List[str]] = None
    cover_img: Optional[str] = None
    photo_img: Optional[str] = None


class EntryResponse(BaseModel):
    id: int
    type: str
    title: str
    body: str
    author: Optional[str] = None
    source: Optional[str] = None
    url: Optional[str] = None
    rating: Optional[int] = None
    tags: Optional[List[str]] = []
    date: date
    cover_img: Optional[str] = None
    photo_img: Optional[str] = None

    class Config:
        from_attributes = True


class ThemeUpdate(BaseModel):
    theme: str
