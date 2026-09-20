from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class SecurityEventModel(BaseModel):
    id: str = Field(default_factory=lambda: f"EVT-{uuid.uuid4().hex[:6].upper()}")
    session_id: str
    event_type: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().strftime("%H:%M:%S.%f")[:-3])
    source: str
    details: str
    risk_weight: float = 0.5
    raw_payload: Optional[str] = None

class EventCollector:
    """
    Normalizes raw endpoint/USB events into a standardized,
    language-agnostic JSON schema for C++/Go swappability.
    """
    @staticmethod
    def normalize(
        session_id: str,
        event_type: str,
        source: str,
        details: str,
        risk_weight: float = 0.5,
        raw_payload: Optional[str] = None
    ) -> SecurityEventModel:
        return SecurityEventModel(
            session_id=session_id,
            event_type=event_type,
            timestamp=datetime.utcnow().strftime("%H:%M:%S.%f")[:-3],
            source=source,
            details=details,
            risk_weight=risk_weight,
            raw_payload=raw_payload
        )
