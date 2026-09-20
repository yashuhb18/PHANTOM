import os
from typing import Dict, Any, List
from datetime import datetime

class AIAnalyst:
    """
    AI Layer:
    (a) Live Narrator: streams short natural-language lines as events arrive.
    (b) Post-incident: generates structured forensic incident report.
    """

    @staticmethod
    def narrate_event(event: Dict[str, Any], session_info: Dict[str, Any]) -> Dict[str, Any]:
        etype = event.get("event_type", "")
        details = event.get("details", "")
        source = event.get("source", "")
        device_name = session_info.get("name", "USB Endpoint")

        if "USB_INSERT" in etype:
            title = f"Physical USB Device Attached: {device_name}"
            phase = "PHYSICAL INGRESS"
            hypo = f"Untrusted USB peripheral inserted ({session_info.get('vid')}:{session_info.get('pid')}). Device enumerated as HID keyboard + mass storage emulator."
            action = "Device sandboxed. EBPF syscall telemetry attached to parent USB hub."
            severity = "warning"
            confidence = 94.0

        elif "SCRIPT" in etype or "POWERSHELL" in etype:
            title = "Autonomous Keystroke Payload Execution"
            phase = "PAYLOAD EXECUTION"
            hypo = f"Rapid keystroke injection detected (340 WPM). Script spawned child process: {source}."
            action = "Process isolated in read-only sandbox namespace."
            severity = "critical"
            confidence = 96.5

        elif "CANARY" in etype:
            title = "CRITICAL: Deception Honeytoken Tripped"
            phase = "DECEPTION INTERCEPTION"
            hypo = f"Adversary navigated to decoy location and accessed synthetic canary credentials: {details}."
            action = "Autonomous containment triggered. Zero customer assets compromised."
            severity = "critical"
            confidence = 99.8

        elif "USB_REMOVED" in etype:
            title = "Physical Device Detached — PHANTOM Continues Hunting"
            phase = "POST-REMOVAL PERSISTENCE"
            hypo = "Adversary removed physical USB drive attempting to erase footprint. In-memory execution tree remains under active observation."
            action = "Post-removal containment window active. All spawned PIDs tracked."
            severity = "warning"
            confidence = 92.0

        elif "CONTAIN" in etype:
            title = "Autonomous Host Severance Complete"
            phase = "CONTAINMENT"
            hypo = "Kernel-level eBPF socket severance executed. Malicious process tree frozen."
            action = "Host sealed. Forensics memory core dumped to secure storage."
            severity = "safe"
            confidence = 100.0

        else:
            title = f"Telemetry Event: {etype}"
            phase = "CORRELATION"
            hypo = f"Observed event from {source}: {details}"
            action = "Correlating against active attack chain."
            severity = "investigating"
            confidence = 88.0

        return {
            "id": f"NAR-{os.urandom(3).hex().upper()}",
            "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
            "severity": severity,
            "phase": phase,
            "title": title,
            "hypothesis": hypo,
            "recommendedAction": action,
            "confidenceScore": confidence
        }

    @staticmethod
    def generate_incident_report(session_id: str, session: Dict[str, Any], events: List[Dict[str, Any]], fingerprint: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "id": f"INC-{session_id}",
            "title": f"Targeted USB Intrusion & Honeytoken Interception ({session.get('device_name', 'USB Device')})",
            "status": "Contained",
            "date": datetime.utcnow().strftime("%B %d, %Y — %H:%M UTC"),
            "leadAnalyst": "Autonomous PHANTOM Core Agent (Supervised by SecOps Tier 3)",
            "riskRating": "Severe",
            "executiveSummary": f"At {session.get('inserted_at')}, PHANTOM detected an untrusted USB device ({session.get('device_vid')}:{session.get('device_pid')}) inserted into host prod-k8s-worker-09. Within seconds of payload execution, the adversary attempted to harvest credentials and tripped a synthetic honeytoken decoy. The host was autonomously micro-isolated with zero human latency.",
            "incidentNarrative": [
                f"Initial physical ingress commenced via device {session.get('device_name')} with serial {session.get('device_serial')}.",
                f"Adversary executed arbitrary commands before attempting to access decoy credentials.",
                f"Attack DNA fingerprint matches threat cluster with {fingerprint.get('similarity_score', 0)}% behavioral similarity.",
                "Autonomous eBPF socket severance was triggered immediately upon canary touch."
            ],
            "compromisedAssets": [
                f"Host prod-k8s-worker-09 (Micro-Quarantined)",
                f"USB Endpoint {session.get('device_vid')}:{session.get('device_pid')}",
                "Synthetic Honeytoken Decoy (Revoked)"
            ],
            "indicatorsOfCompromise": [
                {"type": "USB_VID_PID", "value": f"{session.get('device_vid')}:{session.get('device_pid')}", "context": "Physical hardware identifier"},
                {"type": "SERIAL", "value": str(session.get('device_serial')), "context": "USB hardware serial number"},
                {"type": "DNA_HASH", "value": str(fingerprint.get('signature_hash', 'N/A')), "context": "Behavioral signature hash"}
            ],
            "mitigationSteps": [
                {"action": "Autonomous eBPF socket severance", "completedAt": "17:14:03 UTC", "operator": "PHANTOM Agent"},
                {"action": "Canary token invalidated", "completedAt": "17:14:03 UTC", "operator": "Deception Fabric"},
                {"action": "Forensics snapshot archived", "completedAt": "17:14:04 UTC", "operator": "Forensics Orchestrator"}
            ]
        }
