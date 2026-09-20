from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class NormalizedEvent(BaseModel):
    event_id: str
    session_id: str
    timestamp: str
    source: str
    event_type: str
    severity: str = "INFO"
    data: Dict[str, Any] = Field(default_factory=dict)
    risk_score_delta: int = 0
    raw_os_event: Optional[Dict[str, Any]] = None

class SessionCreate(BaseModel):
    session_id: str
    device_name: str
    vendor_id: str
    product_id: str
    serial_number: Optional[str] = None
    mount_point: Optional[str] = None

class SessionResponse(BaseModel):
    session_id: str
    device_name: str
    vendor_id: str
    product_id: str
    serial_number: Optional[str] = None
    mount_point: Optional[str] = None
    inserted_at: str
    removed_at: Optional[str] = None
    status: str
    risk_score: int
    attack_detected: bool
    event_count: int

class AlertCreate(BaseModel):
    session_id: str
    alert_type: str
    severity: str
    title: str
    description: str
    mitre_technique: Optional[str] = None

class AlertResponse(BaseModel):
    id: int
    session_id: str
    alert_type: str
    severity: str
    title: str
    description: str
    mitre_technique: Optional[str] = None
    status: str
    created_at: str

class CanaryTrapCreate(BaseModel):
    filename: str
    path: str
    file_type: str = "CREDENTIALS"
    description: Optional[str] = None

class CanaryTrapResponse(BaseModel):
    id: int
    filename: str
    path: str
    file_type: str
    description: Optional[str] = None
    is_active: bool
    created_at: str
    hit_count: int = 0

class CanaryHitResponse(BaseModel):
    id: int
    trap_id: int
    filename: str
    session_id: Optional[str] = None
    process_name: Optional[str] = None
    process_id: Optional[int] = None
    action: str
    timestamp: str

class FingerprintResponse(BaseModel):
    session_id: str
    dna_hash: str
    cluster_family: str
    tokens: List[str]
    created_at: str

class FingerprintComparison(BaseModel):
    source_session_id: str
    target_session_id: str
    similarity_score: float
    is_match: bool
    common_subgraphs: List[str]
    divergence_points: List[str]
    verdict: str

class DeviceResponse(BaseModel):
    id: int
    vendor_id: str
    product_id: str
    device_name: str
    serial_number: Optional[str] = None
    trust_status: str
    first_seen: str
    last_seen: str
    session_count: int

class ContainmentActionRequest(BaseModel):
    session_id: str
    action_type: str  # "SOCKET_SEVER", "MICRO_ISOLATE", "BLOCK_DEVICE"
    target: Optional[str] = None
    notes: Optional[str] = None

class ContainmentActionResponse(BaseModel):
    status: str
    action_type: str
    session_id: str
    timestamp: str
    details: Dict[str, Any]
