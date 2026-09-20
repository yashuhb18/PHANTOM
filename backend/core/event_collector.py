import uuid
import datetime
from typing import Dict, Any
from backend.models import NormalizedEvent

class EventCollector:
    """
    Normalizes all telemetry sources (USB, process, filesystem, deception, network)
    into a single canonical JSON event format.
    """
    @staticmethod
    def normalize_event(
        session_id: str,
        source: str,
        event_type: str,
        severity: str,
        data: Dict[str, Any],
        risk_score_delta: int = 0,
        raw_os_event: Dict[str, Any] = None
    ) -> NormalizedEvent:
        event_id = f"evt_{uuid.uuid4().hex[:10]}"
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"
        
        return NormalizedEvent(
            event_id=event_id,
            session_id=session_id,
            timestamp=timestamp,
            source=source,
            event_type=event_type,
            severity=severity,
            data=data,
            risk_score_delta=risk_score_delta,
            raw_os_event=raw_os_event
        )

event_collector = EventCollector()
