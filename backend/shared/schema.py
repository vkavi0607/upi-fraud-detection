from pydantic import BaseModel, Field
from datetime import datetime

class UpiEvent(BaseModel):
    """Standardized Canonical Model for a UPI Transaction Event across all Kafka topics."""
    transaction_id: str = Field(..., description="Unique ID for the transaction")
    sender_upi_id: str = Field(..., description="VPA of the sender")
    receiver_upi_id: str = Field(..., description="VPA of the receiver")
    amount: float = Field(..., ge=0.01)
    currency: str = Field(default="INR")
    device_id: str = Field(..., description="Hardware fingerprint of sender device")
    ip_address: str = Field(..., description="Network origin IP")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
class FraudAlert(BaseModel):
    """Schema for emitted fraud alerts."""
    alert_id: str
    related_transaction: UpiEvent
    gnn_risk_score: float
    trigger_rule: str
    severity: str
    timestamp: datetime
