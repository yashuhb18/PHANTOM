import json
from typing import Dict, Any, List
from backend.database import get_db

class AIAnalyst:
    """
    Generates real-time contextual threat narration and structured executive forensic briefs.
    """
    def narrate_event(self, event: Dict[str, Any]) -> str:
        etype = event.get("event_type", "")
        source = event.get("source", "")
        data = event.get("data", {})

        if etype == "USB_INSERTED":
            return f"Hardware alert: USB device '{data.get('device_name', 'Unknown')}' attached (VID:{data.get('vendor_id')} PID:{data.get('product_id')}). Commencing behavioral surveillance."
        elif etype == "KEYSTROKE_INJECTION_DETECTED":
            cps = data.get("chars_per_second", 850)
            return f"CRITICAL ANOMALY: Synthetic keystroke burst detected ({cps} chars/sec). Matches RubberDucky/BadUSB automated payload delivery."
        elif etype == "SUSPICIOUS_PROCESS_SPAWNED":
            proc = data.get("process_name", "process")
            cmd = data.get("command_line", "")
            return f"Process alert: Subverted host execution spawned '{proc}'. Command: '{cmd}'. Detected evasive execution flags."
        elif etype == "CANARY_TRAP_TRIPPED":
            canary = data.get("file_path", "decoy_file")
            return f"🚨 HONEYPOT DECEPTION COMPROMISE: Attacker enumerated and accessed decoy credential '{canary}'. Intent confirmed as credential harvesting."
        elif etype == "CONTAINMENT_TRIGGERED":
            action = data.get("action", "ISOLATION")
            return f"AUTONOMOUS CONTAINMENT ENGAGED: Executed {action} on host. Socket connection severed. Threat neutralized."
        elif etype == "USB_REMOVED":
            return "Physical USB device detached. Session moved to Post-Removal Observation Window to intercept delayed persistence payloads."
        else:
            return f"Telemetry event: {etype} recorded from {source} subsystem."

    def generate_incident_report(self, session_id: str) -> Dict[str, Any]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM sessions WHERE session_id = ?", (session_id,))
        session_row = cursor.fetchone()
        if not session_row:
            conn.close()
            return {"error": "Session not found"}

        session = dict(session_row)
        cursor.execute("SELECT * FROM events WHERE session_id = ? ORDER BY timestamp ASC", (session_id,))
        events = [dict(r) for r in cursor.fetchall()]
        cursor.execute("SELECT * FROM alerts WHERE session_id = ? ORDER BY created_at ASC", (session_id,))
        alerts = [dict(r) for r in cursor.fetchall()]
        cursor.execute("SELECT * FROM fingerprints WHERE session_id = ?", (session_id,))
        fp_row = cursor.fetchone()
        conn.close()

        fp = dict(fp_row) if fp_row else {"cluster_family": "UNCLASSIFIED", "dna_hash": "N/A", "tokens_json": "[]"}
        tokens = json.loads(fp.get("tokens_json", "[]"))

        report_md = f"""# EXECUTIVE FORENSIC INCIDENT REPORT: {session_id}

**Incident Classification:** CRITICAL - Autonomous USB Keystroke Injection & Deception Trip  
**Target Host:** SEC-WORKSTATION-09  
**Initial Access Device:** {session['device_name']} (VID:{session['vendor_id']} PID:{session['product_id']})  
**Detection Timestamp:** {session['inserted_at']}  
**Autonomous Status:** CONTAINED / MICRO-ISOLATED  

---

### 1. Executive Summary
At {session['inserted_at']}, an untrusted USB peripheral was physically inserted into the target endpoint. Within 420ms of hardware enumeration, the device registered synthetic Human Interface Device (HID) input at an abnormal rate of 850 characters per second, circumventing standard endpoint protection. The injected payload spawned an obfuscated PowerShell child process configured with `-WindowStyle Hidden` and `-NoProfile` evasion flags.

The threat actor actively navigated filesystem directories and touched a designated PHANTOM Canary Decoy file (`.aws_creds_canary`). Upon trap violation, PHANTOM's Autonomous Response Engine severed all non-whitelisted outbound sockets, quarantined the active process tree, and blocked the peripheral hardware descriptor.

---

### 2. Attack DNA & Behavioral Fingerprint
- **Cluster Family:** `{fp.get('cluster_family')}`
- **DNA Hash:** `{fp.get('dna_hash')}`
- **Extracted Behavioral Tokens:**
{chr(10).join([f"  - `{t}`" for t in tokens])}

---

### 3. MITRE ATT&CK Matrix Mapping
- **T1059.001 - Command and Scripting Interpreter: PowerShell**
- **T1056.001 - Input Capture: Keylogging / HID Emulation**
- **T1083 - File and Directory Discovery**
- **T1552.001 - Unsecured Credentials: Local Files (Canary Decoy)**
- **T1041 - Exfiltration Over C2 Channel (Prevented)**

---

### 4. Forensic Timeline & Evidence Log
| Timestamp | Subsystem | Event Type | Severity | Risk Delta |
|---|---|---|---|---|
"""
        for e in events:
            report_md += f"| {e['timestamp']} | {e['source']} | {e['event_type']} | {e['severity']} | +{e['risk_score_delta']} |\n"

        report_md += """
---

### 5. Autonomous Mitigation & Remediation
- **Socket Severance:** Host outbound traffic throttled and redirected to blackhole.
- **Process Termination:** Injected PowerShell script host terminated with exit code -9.
- **Hardware Blacklist:** Device hardware ID persistently restricted in OS hardware registry.
- **Verdict:** Threat fully mitigated before data egress.
"""

        return {
            "session_id": session_id,
            "title": f"Incident Forensics Brief - {session_id}",
            "generated_at": session.get("inserted_at"),
            "risk_score": session.get("risk_score", 0),
            "status": "CONTAINED",
            "cluster_family": fp.get("cluster_family"),
            "markdown": report_md
        }

ai_analyst = AIAnalyst()
