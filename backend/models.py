from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    password = Column(String)

    splitters = relationship("Splitter", back_populates="owner")


class Splitter(Base):
    __tablename__ = "splitters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    data = Column(JSON, default={})
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="splitters")
