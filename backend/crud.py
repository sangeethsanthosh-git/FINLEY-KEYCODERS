from sqlalchemy.orm import Session
import models, schemas
from utils import hash_password, verify_password


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = hash_password(user.password)
    db_user = models.User(email=user.email, phone=user.phone, password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def verify_user_password(plain_pw: str, hashed_pw: str):
    return verify_password(plain_pw, hashed_pw)


def create_splitter(db: Session, user_id: int, splitter: schemas.SplitterCreate):
    db_splitter = models.Splitter(
        title=splitter.title,
        data=splitter.data,
        user_id=user_id
    )
    db.add(db_splitter)
    db.commit()
    db.refresh(db_splitter)
    return db_splitter


def get_splitters_by_user(db: Session, user_id: int):
    return db.query(models.Splitter).filter(models.Splitter.user_id == user_id).all()


def update_splitter(db: Session, splitter_id: int, data: dict):
    splitter = db.query(models.Splitter).filter(models.Splitter.id == splitter_id).first()
    if splitter:
        splitter.data = data
        db.commit()
        db.refresh(splitter)
    return splitter
