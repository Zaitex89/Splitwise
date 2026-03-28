from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from config.database import get_db

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from models.tables import Group
from schemas.balance import Balance, GroupBalanceResponse

router = APIRouter(prefix="/groups", tags=["Balances"])


@router.get("/{group_id}/balances", response_model=GroupBalanceResponse)
def get_group_balances(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group wasn't found")

 
    balances: dict[int, int] = {}
    names: dict[int, str] = {}

    for member in group.members:
        balances[member.id] = 0
        names[member.id] = member.name

    for expense in group.expenses:
        if not expense.split_between:
            continue

        share = expense.amount // len(expense.split_between)

        balances[expense.paid_by] += expense.amount

        for user in expense.split_between:
            balances[user.id] -= share

    result = [
        Balance(user_id=uid, name=names[uid], amount=round(balances[uid], 2))
        for uid in balances
    ]

    return GroupBalanceResponse(balances=result)