from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import ThemeUpdate, UserResponse
from auth_utils import get_current_user

router = APIRouter(prefix="/user", tags=["user"])


@router.patch("/theme", response_model=UserResponse)
def update_theme(theme_in: ThemeUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    current_user.theme = theme_in.theme
    db.commit()
    db.refresh(current_user)
    return current_user
