from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from config.database import get_db
from schemas.group import GroupCreate, GroupResponse, GroupUpdate
from schemas.expense import ExpenseResponse
from models.tables import Group, User, Expense, expense_splits

router = APIRouter(
    prefix="/groups", 
    tags=["Groups"]
)

@router.get("/", response_model=list[GroupResponse])
def get_all_groups(db: Session = Depends(get_db)):
    groups = db.query(Group).all()
    return groups

@router.get("/{group_id}", response_model=GroupResponse)
def get_one_group(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
     
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Group with ID: {group_id} not found")
    print(f"Fetched group with ID: {group_id}")
    return group

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=GroupResponse)
def create_group(group: GroupCreate, db: Session = Depends(get_db)):
    existing_group = db.query(Group).filter(Group.name == group.name).first()
    if existing_group:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A group with name {group.name} already exists"
        )
    
    members = db.query(User).filter(User.id.in_(group.member_ids)).all()

    if len(members) != len(group.member_ids):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One or more users not found"
        )

    new_group = Group(
        name=group.name,
        members=members
    )

    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    return new_group

@router.put("/{group_id}", response_model=GroupResponse)
def update_group(group_id: int, group_update: GroupUpdate, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Group with ID: {group_id} not found"
        )
    
    
    if group_update.name:
        existing_name = db.query(Group).filter(
            Group.name == group_update.name,
            Group.id != group_id
        ).first()
        
        if existing_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A group with name {group_update.name} already exists"
            )
        group.name = group_update.name # type: ignore

    if group_update.member_ids is not None:
        members = db.query(User).filter(User.id.in_(group_update.member_ids)).all()

        if len(members) != len(group_update.member_ids):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"One or more users not found"
            )
        
        group.members = members

    db.commit()
    db.refresh(group)
    return group


@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_group(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )

    expenses = db.query(Expense).filter(Expense.group_id == group_id).all()
    for expense in expenses:
        db.execute(expense_splits.delete().where(expense_splits.c.expense_id == expense.id))
    
    db.query(Expense).filter(Expense.group_id == group_id).delete()
    db.delete(group)
    db.commit()

@router.get("/{group_id}/expenses", response_model=list[ExpenseResponse])
def get_group_expenses(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group wasn't found"
        )
    return group.expenses