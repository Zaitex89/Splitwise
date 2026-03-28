from pydantic import BaseModel
from typing import List
from .user import UserResponse

class GroupBase(BaseModel):
    name: str

class GroupCreate(GroupBase):
    member_ids: List[int]

class GroupUpdate(BaseModel):
    name: str | None = None
    member_ids: List[int] | None = None

class GroupResponse(GroupBase):
    id: int
    members: List[UserResponse]

    class Config:
        from_attributes = True