from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserRead, UserCreate, UserLogin, Token
from app.config.db.database import get_session
from sqlmodel import Session, select
from app.models.user import User
from app.utils.security import get_password_hash, create_access_token, verify_password
from typing import Annotated, Any
from app.config.config import settings
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from app.schemas.user import UserUpdate

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Session = Depends(get_session)
) -> User:
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        user_id: str | Any = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception

    user = session.get(User, user_id)
    
    if user is None:
        raise credentials_exception
        
    return user

@router.get("/me", response_model=UserRead)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/register", response_model=UserRead)
def register(user_input: UserCreate, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == user_input.email)
    existing_user = session.exec(statement).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    new_user = User(
        email=user_input.email,
        name=user_input.name,
        password=get_password_hash(user_input.password) 
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user

@router.post("/login", response_model=Token)
def login(user_input: UserLogin, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == user_input.email)
    user = session.exec(statement).first()

    if not user or not verify_password(user_input.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(subject=user.id)

    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }

@router.patch("/me", response_model=UserRead)
def update_current_user(
    user_update: UserUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if user_update.email:
        existing_user = session.exec(select(User).where(User.email == user_update.email)).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email already assigned")
        current_user.email = user_update.email

    if user_update.password:
        current_user.password = get_password_hash(user_update.password)

    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user

@router.delete("/me")
def delete_current_user(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    session.delete(current_user)
    session.commit()
    return {"ok": True, "message": "User deleted"}
