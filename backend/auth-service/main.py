import os
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import jwt
import logging
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - AUTH SERVICE - %(levelname)s - %(message)s")
app = FastAPI(title="GuardUPI Authentication Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "super_secure_fintech_jwt_secret_for_guardupi"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15


# Schema Definitions
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    device_fingerprint: str = "unknown_device"
    
class LoginResponse(BaseModel):
    status: str
    mfa_required: bool
    mfa_token: Optional[str] = None
    access_token: Optional[str] = None
    role: Optional[str] = None
    first_name: Optional[str] = None

class MFARequest(BaseModel):
    mfa_token: str
    otp_code: str

class RegisterRequest(BaseModel):
    email: EmailStr
    first_name: str
    password: str
    role: str = "Fraud Analyst"


# Mock Database
USERS_DB = {
    "admin@guardupi.gov": {"first_name": "System", "password_hash": "pass123", "role": "Admin", "requires_mfa": True},
    "analyst@guardupi.gov": {"first_name": "Raj", "password_hash": "pass123", "role": "Fraud Analyst", "requires_mfa": False},
    "investigator@guardupi.gov": {"first_name": "Priya", "password_hash": "pass123", "role": "Senior Investigator", "requires_mfa": False},
    "riskmanager@guardupi.gov": {"first_name": "Arjun", "password_hash": "pass123", "role": "Risk Manager", "requires_mfa": False},
}


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/api/v1/auth/register")
async def register(req: RegisterRequest):
    if req.email in USERS_DB:
        raise HTTPException(status_code=400, detail="User already exists.")
        
    USERS_DB[req.email] = {
        "first_name": req.first_name,
        "password_hash": req.password,
        "role": req.role,
        "requires_mfa": False
    }
    
    logging.info(f"New user registered: {req.email} ({req.first_name}) as {req.role}")
    return {"status": "success", "message": f"User {req.first_name} registered successfully."}

@app.post("/api/v1/auth/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    user = USERS_DB.get(req.email)
    
    if not user or user["password_hash"] != req.password:
        logging.warning(f"Failed login attempt for {req.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    logging.info(f"User {req.email} ({user['first_name']}) authenticated.")
    
    is_high_risk_device = "suspicious" in req.device_fingerprint.lower() or "new" in req.device_fingerprint.lower()
    
    if user["requires_mfa"] or is_high_risk_device:
        logging.warning(f"Step-up authentication required for {req.email}.")
        mfa_payload = {"sub": req.email, "type": "mfa_pending", "exp": datetime.utcnow() + timedelta(minutes=5)}
        mfa_token = jwt.encode(mfa_payload, SECRET_KEY, algorithm=ALGORITHM)
        return LoginResponse(status="mfa_challenge", mfa_required=True, mfa_token=mfa_token)
        
    access_token = create_access_token({"sub": req.email, "role": user["role"], "first_name": user["first_name"]})
    return LoginResponse(status="success", mfa_required=False, access_token=access_token, role=user["role"], first_name=user["first_name"])

@app.post("/api/v1/auth/verify-mfa")
async def verify_mfa(req: MFARequest):
    try:
        payload = jwt.decode(req.mfa_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "mfa_pending":
            raise HTTPException(status_code=400, detail="Corrupt token type detected")
            
        email = payload.get("sub")
        if req.otp_code != "123456":
            logging.error(f"Failed MFA attempt for {email}")
            raise HTTPException(status_code=401, detail="Invalid MFA code")
            
        user = USERS_DB.get(email)
        access_token = create_access_token({"sub": email, "role": user["role"], "first_name": user.get("first_name", "User")})
        logging.info(f"User {email} successfully completed MFA.")
        
        return {"status": "success", "access_token": access_token, "role": user["role"], "first_name": user.get("first_name", "User")}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="MFA challenge expired.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid MFA token.")

@app.post("/api/v1/auth/logout")
async def logout(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401)
    logging.info("Session terminated.")
    return {"status": "success", "message": "Logged out successfully"}
