from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Entry, User
from schemas import EntryCreate, EntryUpdate, EntryResponse
from auth_utils import get_current_user
from typing import List

router = APIRouter(prefix="/entries", tags=["entries"])


@router.get("/public/{username}", response_model=List[EntryResponse])
def get_public_entries(username: str, db: Session = Depends(get_db)):
    # Find the user by username
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Return their entries
    entries = db.query(Entry).filter(Entry.user_id == user.id).all()
    return entries


@router.get("/", response_model=List[EntryResponse])
def get_entries(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    entries = db.query(Entry).filter(Entry.user_id == current_user.id).all()
    return entries


@router.post("/", response_model=EntryResponse, status_code=status.HTTP_201_CREATED)
def create_entry(entry_in: EntryCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    new_entry = Entry(
        user_id=current_user.id,
        type=entry_in.type,
        title=entry_in.title,
        body=entry_in.body,
        author=entry_in.author,
        source=entry_in.source,
        url=entry_in.url,
        rating=entry_in.rating,
        tags=entry_in.tags,
        date=entry_in.date,
        cover_img=entry_in.cover_img,
        photo_img=entry_in.photo_img,
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(entry_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return


@router.patch("/{entry_id}", response_model=EntryResponse)
def update_entry(entry_id: int, entry_in: EntryUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    for field, value in entry_in.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry
