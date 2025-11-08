from pydantic import BaseModel, EmailStr
from typing import Any, Optional


class UserBase(BaseModel):
    email: EmailStr
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True


class SplitterBase(BaseModel):
    title: str
    data: Any


class SplitterCreate(SplitterBase):
    pass


class SplitterResponse(SplitterBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
