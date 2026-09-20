from typing import List, Dict, Any

class RiskScorer:
    """
    Rule-based weighted risk scoring that escalates on chained suspicious sequences.
    """

    EVENT_WEIGHTS = {
        "USB_INSERTED": 10,
        "SCRIPT_EXECUTED": 25,
        "PROC_INJECTION": 35,
        "MEM_INJECT_DETECTED": 40,
        "CANARY_FILE_READ": 50,
        "TLS_JA3_ANOMALY": 20,
        "DNS_BEACON_DETECTED": 25,
        "SUDO_ESCALATION_ATTEMPT": 30,
        "USB_REMOVED": 5,
        "AUTO_CONTAINMENT_SUCCESS": -10
    }

    @staticmethod
    def calculate_score(events: List[Dict[str, Any]]) -> int:
        base_score = 0
        has_canary = False
        has_injection = False
        has_script = False

        for evt in events:
            etype = evt.get("event_type", "")
            base_score += RiskScorer.EVENT_WEIGHTS.get(etype, 10)

            if "CANARY" in etype:
                has_canary = True
            if "INJECT" in etype:
                has_injection = True
            if "SCRIPT" in etype or "POWERSHELL" in etype:
                has_script = True

        # Chained escalation multipliers
        if has_canary and has_injection:
            base_score = max(base_score, 94)
        elif has_canary and has_script:
            base_score = max(base_score, 88)

        return min(100, max(0, base_score))
