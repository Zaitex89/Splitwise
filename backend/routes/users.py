from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from config.database import get_db
from models.tables import User, Expense, expense_splits
from schemas.user import UserResponse, UserCreate
from typing import List

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    
    new_user = User(
        name=user.name,
        email=user.email
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

from models.tables import User, Expense, expense_splits

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get expenses where user is payed
    expenses = db.query(Expense).filter(Expense.paid_by == user_id).all()
    
    # Delete expense_splits for these expenses first
    for expense in expenses:
        db.execute(expense_splits.delete().where(expense_splits.c.expense_id == expense.id))
    
    # Delete expenses
    db.query(Expense).filter(Expense.paid_by == user_id).delete()
    
    # Delete the user
    db.delete(user)
    db.commit()