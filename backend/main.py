from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, crud
from database import engine, get_db
from utils import create_access_token

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if not db_user or not crud.verify_user_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer", "user_id": db_user.id}


@app.get("/me/{email}", response_model=schemas.UserResponse)
def get_me(email: str, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/splitters/{user_id}", response_model=list[schemas.SplitterResponse])
def get_splitters(user_id: int, db: Session = Depends(get_db)):
    return crud.get_splitters_by_user(db, user_id)


@app.post("/splitters/{user_id}", response_model=schemas.SplitterResponse)
def create_splitter(user_id: int, splitter: schemas.SplitterCreate, db: Session = Depends(get_db)):
    return crud.create_splitter(db, user_id, splitter)


@app.put("/splitters/{splitter_id}", response_model=schemas.SplitterResponse)
def update_splitter(splitter_id: int, data: dict, db: Session = Depends(get_db)):
    updated = crud.update_splitter(db, splitter_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Splitter not found")
    return updated
