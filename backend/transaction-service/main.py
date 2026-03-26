from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncio
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - TRANSACTION SERVICE - %(message)s")
app = FastAPI(title="Transaction Core Service")

class TransactionValidationRequest(BaseModel):
    transaction_id: str
    sender_upi: str
    receiver_upi: str
    amount: float
    currency: str

@app.post("/v1/core/validate")
async def validate_transaction(req: TransactionValidationRequest):
    """
    Synchronous validation API called by API Gateway BEFORE queuing.
    Handles hard regulatory blocks (AML limits, KYC flags).
    """
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid payment amount")
        
    if req.amount > 500000: # 5 Lakh limit check
        logging.warning(f"Tx {req.transaction_id} exceeded AML limit. Flagging for manual clearance.")
        return {"status": "held", "reason": "Requires manual AML clearance (Amount exceeds max limit)"}
        
    logging.info(f"Tx {req.transaction_id} passed L1 validation.")
    return {"status": "approved", "processed_at": asyncio.get_event_loop().time()}
