from typing import Dict, Any

class RiskScoringEngine:
    """
    Computes risk score increments based on event type, severity, and chained patterns.
    """
    BASE_SCORES = {
        "USB_INSERTED": 5,
        "KEYSTROKE_INJECTION_DETECTED": 35,
        "SUSPICIOUS_PROCESS_SPAWNED": 25,
        "FILE_ACCESSED": 5,
        "CANARY_TRAP_TRIPPED": 50,
        "PERSISTENCE_ATTEMPTED": 30,
        "OUTBOUND_C2_ESTABLISHED": 40,
        "USB_REMOVED": 0
    }

    SEVERITY_MULTIPLIERS = {
        "INFO": 1.0,
        "LOW": 1.1,
        "MEDIUM": 1.3,
        "HIGH": 1.6,
        "CRITICAL": 2.0
    }

    def evaluate_event_risk(self, event_type: str, severity: str, data: Dict[str, Any]) -> int:
        base = self.BASE_SCORES.get(event_type, 10)
        multiplier = self.SEVERITY_MULTIPLIERS.get(severity, 1.0)
        
        score = int(base * multiplier)

        # Chained escalation heuristics
        if "canary" in event_type.lower() or "canary" in str(data).lower():
            score = max(score, 50)
        if "powershell" in str(data).lower() and ("-enc" in str(data).lower() or "-nop" in str(data).lower()):
            score += 20

        return min(score, 100)

risk_scoring = RiskScoringEngine()
