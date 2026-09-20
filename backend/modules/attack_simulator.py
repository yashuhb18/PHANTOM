import asyncio
import json
from datetime import datetime
from typing import Callable, Optional, Dict, Any
from backend.modules.session_manager import SessionManager
from backend.modules.event_collector import EventCollector
from backend.modules.correlation_engine import CorrelationEngine
from backend.modules.risk_scoring import RiskScorer
from backend.modules.fingerprint_engine import FingerprintEngine
from backend.modules.canary_manager import CanaryManager
from backend.modules.response_engine import ResponseEngine
from backend.modules.ai_analyst import AIAnalyst
from backend.db.database import get_connection

class AttackSimulator:
    """
    Executes the exact 2-stage hackathon demo sequence:
    1. USB #1 (RubberDucky) -> payload -> canary touched -> USB removed -> graph & fingerprint saved.
    2. USB #2 (BashBunny, different device) -> fingerprint engine immediately flags 82% match to Session #1!
    """

    @staticmethod
    async def run_sequence_1(
        broadcast_event: Optional[Callable[[Dict[str, Any]], None]] = None,
        broadcast_narrator: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> Dict[str, Any]:
        session_id = "SES-USB-01"
        device_info = {
            "vid": "0x0483",
            "pid": "0x5740",
            "serial": "SN-DUCKY-8841",
            "name": "USB RubberDucky Keystroke Injector"
        }

        # 1. USB #1 Inserted
        SessionManager.create_session(
            session_id,
            device_info["vid"],
            device_info["pid"],
            device_info["serial"],
            device_info["name"]
        )

        events_data = []

        async def emit_step(event_type: str, source: str, details: str, risk: float, raw: Optional[str] = None):
            evt = EventCollector.normalize(session_id, event_type, source, details, risk, raw)
            evt_dict = evt.model_dump()
            events_data.append(evt_dict)

            # Persist event
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("""
            INSERT OR REPLACE INTO events (id, session_id, event_type, timestamp, source, details, risk_weight, raw_payload)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (evt.id, evt.session_id, evt.event_type, evt.timestamp, evt.source, evt.details, evt.risk_weight, evt.raw_payload))
            conn.commit()
            conn.close()

            # Broadcast live event
            if broadcast_event:
                await broadcast_event(evt_dict)

            # AI Narration
            narration = AIAnalyst.narrate_event(evt_dict, device_info)
            if broadcast_narrator:
                await broadcast_narrator(narration)

            await asyncio.sleep(0.6)

        # Step 1: Ingress
        await emit_step("USB_INSERTED", "kernel/usbcore", "Device connected to Port 1-2. HID descriptor registered.", 0.2)

        # Step 2: Keystroke Injection
        await emit_step("SCRIPT_EXECUTED", "powershell.exe", "Rapid keystroke injection: powershell.exe -w hidden -enc JABz...", 0.6, "powershell.exe -w hidden -enc JABzAHIAYwA9ACIAaHR0cD...")

        # Step 3: Process Masquerading
        await emit_step("PROC_INJECTION", "kworker/u32:4 (masqueraded)", "Injected thread using ptrace into masqueraded kworker process (PID 40912).", 0.8)

        # Step 4: Canary Decoy Touched -> Instant Alert!
        await emit_step("CANARY_FILE_READ", "/usr/bin/cat", "Accessed synthetic decoy: /opt/decoy/.aws_creds_canary (UUID: 8fa19e-4b).", 1.0)
        CanaryManager.handle_canary_hit("/opt/decoy/.aws_creds_canary", "READ")

        # Step 5: USB Removed -> PHANTOM keeps hunting
        SessionManager.mark_removed(session_id)
        await emit_step("USB_REMOVED", "kernel/usbcore", "Physical device removed from port 1-2. Hunting window persists.", 0.3)

        # Build Graph
        CorrelationEngine.build_graph(session_id, events_data)

        # Update Risk Score
        score = RiskScorer.calculate_score(events_data)
        SessionManager.update_risk_score(session_id, score, "contained")

        # Store Fingerprint
        fp_result = FingerprintEngine.save_and_attribute(session_id, events_data)

        # Micro-containment
        ResponseEngine.contain_session(session_id, "ISOLATE_HOST")

        return {
            "session_id": session_id,
            "status": "Contained",
            "risk_score": score,
            "events_count": len(events_data),
            "fingerprint": fp_result
        }

    @staticmethod
    async def run_sequence_2(
        broadcast_event: Optional[Callable[[Dict[str, Any]], None]] = None,
        broadcast_narrator: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> Dict[str, Any]:
        """
        Second simulate: USB #2 (different device, similar payload) ->
        Fingerprint engine immediately flags 82% match to Session #1 BEFORE correlation finishes!
        """
        session_id = "SES-USB-02"
        device_info = {
            "vid": "0x0951",
            "pid": "0x1666",
            "serial": "SN-BUNNY-9012",
            "name": "BashBunny Multi-Payload Peripheral"
        }

        # 1. USB #2 Inserted (Different device!)
        SessionManager.create_session(
            session_id,
            device_info["vid"],
            device_info["pid"],
            device_info["serial"],
            device_info["name"]
        )

        events_data = []

        async def emit_step(event_type: str, source: str, details: str, risk: float, raw: Optional[str] = None):
            evt = EventCollector.normalize(session_id, event_type, source, details, risk, raw)
            evt_dict = evt.model_dump()
            events_data.append(evt_dict)

            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("""
            INSERT OR REPLACE INTO events (id, session_id, event_type, timestamp, source, details, risk_weight, raw_payload)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (evt.id, evt.session_id, evt.event_type, evt.timestamp, evt.source, evt.details, evt.risk_weight, evt.raw_payload))
            conn.commit()
            conn.close()

            if broadcast_event:
                await broadcast_event(evt_dict)

            narration = AIAnalyst.narrate_event(evt_dict, device_info)
            if broadcast_narrator:
                await broadcast_narrator(narration)

            await asyncio.sleep(0.6)

        # Step 1: Different USB Inserted
        await emit_step("USB_INSERTED", "kernel/usbcore", "Device attached: BashBunny VID:0x0951 PID:0x1666.", 0.2)

        # Step 2: Similar Payload Starts
        await emit_step("SCRIPT_EXECUTED", "powershell.exe", "Powershell child invocation with obfuscated payload string.", 0.6)

        # Step 3: IMMEDIATE FINGERPRINT MATCH ALERT (WOW MOMENT!)
        fp_result = FingerprintEngine.save_and_attribute(session_id, events_data)
        # Override to 82.4% match to Session #1 as specified in prompt
        fp_result["similarity_score"] = 82.4
        fp_result["matched_session"] = "SES-USB-01"
        fp_result["is_threat_family"] = True

        # AI Narrator calls out the 82% match live!
        if broadcast_narrator:
            await broadcast_narrator({
                "id": f"NAR-DNA-MATCH",
                "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                "severity": "critical",
                "phase": "ATTACK DNA ATTRIBUTION",
                "title": "THREAT FAMILY IDENTIFIED: 82.4% Match to Session #1",
                "hypothesis": "Behavioral signature (event sequence + memory traversal) correlates 82.4% with SES-USB-01 despite differing USB hardware identifiers.",
                "recommendedAction": "Immediate proactive containment applied. Zero trust lockout.",
                "confidenceScore": 98.4
            })

        # Step 4: Canary Touched
        await emit_step("CANARY_FILE_READ", "/usr/bin/cat", "Accessed decoy /opt/decoy/passwords_2026.xlsx.", 1.0)
        CanaryManager.handle_canary_hit("/opt/decoy/passwords_2026.xlsx", "READ")

        # Step 5: Auto-Containment
        await emit_step("AUTO_CONTAINMENT_SUCCESS", "phantom-ebpf", "eBPF socket severance verified in 108ms. Threat contained.", 0.0)

        # Complete graph
        CorrelationEngine.build_graph(session_id, events_data)
        score = RiskScorer.calculate_score(events_data)
        SessionManager.update_risk_score(session_id, score, "contained")
        ResponseEngine.contain_session(session_id, "ISOLATE_HOST")

        return {
            "session_id": session_id,
            "status": "Contained",
            "risk_score": score,
            "events_count": len(events_data),
            "fingerprint": fp_result
        }
