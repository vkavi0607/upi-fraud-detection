import os
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import jwt
import logging
from typing import Optional
import random
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - AUTH SERVICE - %(levelname)s - %(message)s")
app = FastAPI(title="GuardUPI Authentication & MFA Service")

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

# --- TWILIO CONFIGURATION ---
# In production, securely load these from .env or AWS Secrets Manager
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER", "")


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
    mobile: str
    role: str = "Fraud Analyst"

class OTPVerifyRequest(BaseModel):
    mobile: str
    otp_code: str

class OTPSendRequest(BaseModel):
    mobile: str


# Mock Database including mobile_verified states and names
USERS_DB = {
    "admin@guardupi.gov": {"first_name": "System", "password_hash": "pass123", "mobile": "+919876543210", "mobile_verified": True, "role": "Admin", "requires_mfa": True},
    "analyst@guardupi.gov": {"first_name": "Raj", "password_hash": "pass123", "mobile": "+918876543211", "mobile_verified": True, "role": "Fraud Analyst", "requires_mfa": False},
    "investigator@guardupi.gov": {"first_name": "Priya", "password_hash": "pass123", "mobile": "+917876543212", "mobile_verified": True, "role": "Senior Investigator", "requires_mfa": True},
    "riskmanager@guardupi.gov": {"first_name": "Arjun", "password_hash": "pass123", "mobile": "+916876543213", "mobile_verified": True, "role": "Risk Manager", "requires_mfa": True},
}

OTP_STORE = {}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/api/v1/auth/register")
async def register(req: RegisterRequest):
    if req.email in USERS_DB:
        raise HTTPException(status_code=400, detail="User securely exists. Access denied.")
        
    USERS_DB[req.email] = {
        "first_name": req.first_name,
        "password_hash": req.password,
        "mobile": req.mobile,
        "role": req.role,
        "mobile_verified": False,
        "requires_mfa": True if req.role in ["Admin", "Risk Manager", "Senior Investigator"] else False
    }
    
    # -------------------------------------------------------------
    # Production Grade SMS Gateway Integration (Twilio)
    # -------------------------------------------------------------
    otp_code = str(random.randint(100000, 999999))
    OTP_STORE[req.mobile] = {"code": otp_code, "expires": datetime.utcnow() + timedelta(minutes=5), "attempts": 0}
    
    if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER:
        try:
            client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            message = client.messages.create(
                body=f"Your GuardUPI Secure Node Pin: {otp_code}. Valid for 5 minutes. DO NOT SHARE THIS WITH ANYONE.",
                from_=TWILIO_FROM_NUMBER,
                to=req.mobile
            )
            logging.info(f"Twilio SMS successfully dispatched to {req.mobile}. Message SID: {message.sid}")
        except Exception as e:
            logging.error(f"Failed to dispatch physical Twilio SMS to {req.mobile}. Error: {str(e)}")
            # Fallback if connection fails for resilience
            if str(req.mobile) == "+1234567890": # strict testing fallback bypass
               OTP_STORE[req.mobile]["code"] = "123456" 
    else:
        # Fallback Mode for Local Developer Sandbox
        logging.warning("Twilio environment variables (Account SID/Token) missing. Running in physical Sandbox bypass mode.")
        otp_code = "123456" # Predictable standard PIN prevents soft-locking the UI during testing without paid API keys
        OTP_STORE[req.mobile]["code"] = otp_code
        logging.info(f"[SANDBOX MOCK] Generated SMS PIN {otp_code} for {req.mobile}.")

    return {"status": "pending_verification", "message": f"OTP provisioning initialized for {req.mobile}"}

@app.post("/api/v1/auth/verify-mobile-otp")
async def verify_mobile_otp(req: OTPVerifyRequest):
    record = OTP_STORE.get(req.mobile)
    if not record:
        raise HTTPException(status_code=400, detail="OTP expired or not requested")
        
    if datetime.utcnow() > record["expires"]:
        del OTP_STORE[req.mobile]
        raise HTTPException(status_code=400, detail="OTP payload has expired")
        
    if record["attempts"] >= 3:
        raise HTTPException(status_code=429, detail="Maximum 3 failed attempts exceeded. Request a new OTP flow.")
        
    if req.otp_code != record["code"]:
        record["attempts"] += 1
        raise HTTPException(status_code=401, detail="Invalid OTP structural code supplied")
        
    user_email = next((email for email, user in USERS_DB.items() if user.get("mobile") == req.mobile), None)
    if user_email:
        USERS_DB[user_email]["mobile_verified"] = True
        
    del OTP_STORE[req.mobile]
    logging.info(f"Mobile number {req.mobile} securely validated.")
    
    return {"status": "success", "message": "Mobile number confirmed successfully."}

@app.post("/api/v1/auth/send-otp")
async def send_otp(req: OTPSendRequest):
    # In a real system, you'd rate limit this.
    otp_code = str(random.randint(100000, 999999))
    OTP_STORE[req.mobile] = {"code": otp_code, "expires": datetime.utcnow() + timedelta(minutes=5), "attempts": 0}
    
    if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER:
        try:
            client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            client.messages.create(
                body=f"Your GuardUPI Secure Node Pin: {otp_code}. Valid for 5 minutes. DO NOT SHARE THIS WITH ANYONE.",
                from_=TWILIO_FROM_NUMBER,
                to=req.mobile
            )
            logging.info(f"Twilio SMS resend to {req.mobile}.")
        except Exception as e:
            logging.error(f"Failed to resend physical Twilio SMS to {req.mobile}. Error: {str(e)}")
            if str(req.mobile) == "+1234567890": 
               OTP_STORE[req.mobile]["code"] = "123456" 
    else:
        otp_code = "123456" 
        OTP_STORE[req.mobile]["code"] = otp_code
        logging.info(f"[SANDBOX MOCK] Resent SMS PIN {otp_code} for {req.mobile}.")

    return {"status": "success", "message": f"OTP sent successfully to {req.mobile}"}

@app.post("/api/v1/auth/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    user = USERS_DB.get(req.email)
    
    if not user or user["password_hash"] != req.password:
        logging.warning(f"Failed login attempt for {req.email}")
        raise HTTPException(status_code=401, detail="Invalid global credentials")
        
    if not user.get("mobile_verified", False):
        logging.warning(f"Blocked unverified mobile login attempt for {req.email}")
        raise HTTPException(status_code=403, detail="Mobile clearance not verified. Setup incomplete.")
        
    logging.info(f"User {req.email} ({user['first_name']}) authenticated. Calculating Hardware Risk...")
    
    is_high_risk_device = "suspicious" in req.device_fingerprint.lower() or "new" in req.device_fingerprint.lower()
    
    if user["requires_mfa"] or is_high_risk_device:
        logging.warning(f"Step-up authenticating {req.email}.")
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
            raise HTTPException(status_code=401, detail="Invalid TOTP challenge code")
            
        user = USERS_DB.get(email)
        access_token = create_access_token({"sub": email, "role": user["role"], "first_name": user.get("first_name", "User")})
        logging.info(f"User {email} successfully completed TOTP bypass.")
        
        return {"status": "success", "access_token": access_token, "role": user["role"], "first_name": user.get("first_name", "User")}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Challenge window expired, renew authorization.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Malicious token payload injected.")

@app.post("/api/v1/auth/logout")
async def logout(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401)
    logging.info("Session physically terminated.")
    return {"status": "success", "message": "Node successfully scrubbed"}
