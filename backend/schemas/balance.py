from pydantic import BaseModel, EmailStr
from typing import List, Optional

class Balance(BaseModel):
    user_id: int
    name: str
    amount: float

class GroupBalanceResponse(BaseModel):
    balances: List[Balance]