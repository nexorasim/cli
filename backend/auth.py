from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET", "esim-myanmar-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class User(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str
    is_active: bool

# Mock user database
users_db = {}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(user_password):
    return pwd_context.hash(user_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/register", response_model=dict)
async def register_user(user: UserRegister):
    # Check if user already exists
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate user input strength
    if len(user.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    # Hash user password and store user
    hashed_user_password = get_password_hash(user.password)
    user_id = f"user_{len(users_db) + 1}"
    
    users_db[user.email] = {
        "id": user_id,
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "hashed_auth": hashed_user_password,
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    
    return {
        "message": "User registered successfully",
        "user_id": user_id,
        "email": user.email
    }

@router.post("/login", response_model=Token)
async def login_user(user: UserLogin):
    # Check if user exists
    if user.email not in users_db:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    stored_user = users_db[user.email]
    
    # Verify user credentials
    if not verify_password(user.password, stored_user["hashed_auth"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if user is active
    if not stored_user["is_active"]:
        raise HTTPException(status_code=401, detail="Account is disabled")
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.get("/me", response_model=User)
async def get_current_user(email: str = Depends(verify_token)):
    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = users_db[email]
    return User(
        id=user_data["id"],
        email=user_data["email"],
        full_name=user_data["full_name"],
        phone=user_data["phone"],
        is_active=user_data["is_active"]
    )

@router.post("/logout")
async def logout_user(email: str = Depends(verify_token)):
    return {"message": "Successfully logged out"}

@router.post("/refresh", response_model=Token)
async def refresh_token(email: str = Depends(verify_token)):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }