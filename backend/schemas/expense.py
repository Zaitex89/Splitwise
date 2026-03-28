from pydantic import BaseModel, field_validator
from typing import List
from datetime import datetime

class ExpenseBase(BaseModel):
    title: str
    amount: float 

class ExpenseCreate(ExpenseBase):
    group_id: int 
    paid_by: int
    split_between: List[int]

class ExpenseResponse(ExpenseBase):
    id: int
    group_id: int
    paid_by: int
    split_between: List[int]
    created_at: datetime

    @field_validator("split_between", mode="before")
    @classmethod
    def extract_ids(cls, users):
        if users and hasattr(users[0], "id"):
            return [user.id for user in users]
        return users

    class Config:
        from_attributes = True