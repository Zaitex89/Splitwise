from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from config.database import get_db
from schemas.expense import ExpenseCreate, ExpenseBase, ExpenseResponse
from models.tables import Group, User, Expense

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.post("/")
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == expense.group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group wasn't found"
        )
    
    payer = db.query(User).filter(User.id == expense.paid_by).first()
    if not payer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payer not found"
        )
    
    users = db.query(User).filter(User.id.in_(expense.split_between)).all()
    if len(users) != len(expense.split_between):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One or more users wasn't found"
        )
    
    new_expense = Expense(
        title=expense.title,
        amount = expense.amount,
        group_id = expense.group_id,
        paid_by = expense.paid_by,
        split_between = users
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense





@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(Expense). filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense wasn't found"
        )
    
    db.delete(expense)
    db.commit()