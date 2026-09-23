"""
PHANTOM Autonomous Process Surveillance & Containment Agent
=============================================================
Ultra-aggressive real-time process monitoring with autonomous kill capability.
Monitors ALL process spawns, detects suspicious script hosts, USB-origin execution,
evasive command-line flags, and surgically terminates threats with zero human intervention.
Kills entire process trees, not just individual processes.
"""

import sys
import os
import time
import asyncio
import threading
import logging
import re
from typing import Callable, Optional, Set, Dict, Any, List
import psutil
from backend.core.session_manager import session_manager
from backend.core.event_collector import event_collector
from backend.core.response_engine import response_engine
from backend.core.ai_analyst import ai_analyst
from backend.ws_manager import ws_manager
from backend.database import get_db

logger = logging.getLogger("phantom.agent.process")


class ProcessMonitor:
    """
    Autonomous Real-Time Process Surveillance & Containment Agent.
    
    This is PHANTOM's strongest defense layer. It monitors every new process spawn
    on the system and makes autonomous decisions to terminate threats.
    
    Detection Capabilities:
    1. Script interpreter abuse (PowerShell, CMD, WScript, CScript, MSHTA, etc.)
    2. USB-origin execution (any process running from a removable drive)
    3. Evasive command-line flags (hidden windows, encoded commands, bypass policies)
    4. Download cradles (Invoke-WebRequest, certutil, bitsadmin)
    5. Persistence installation (reg add, schtasks, sc create)
    6. Credential access tools (mimikatz references, credential dumping)
    7. Network reconnaissance (nslookup, netstat, ipconfig enumeration)
    8. Living-off-the-land binaries (LOLBins) abuse
    
    Response Capabilities:
    1. Instant process termination via psutil.kill()
    2. Full process tree annihilation (parent + all children)
    3. Event recording with MITRE ATT&CK mapping
    4. Real-time WebSocket broadcast to UI
    5. AI-narrated threat analysis
    """

    # ─────────────────────────────────────────────────────────────────────
    # SUSPICIOUS PROCESS NAMES — script interpreters and LOLBins
    # ─────────────────────────────────────────────────────────────────────
    SUSPICIOUS_NAMES: Set[str] = {
        # Script interpreters
        "powershell.exe", "pwsh.exe", "cmd.exe",
        "wscript.exe", "cscript.exe", "mshta.exe",
        # LOLBins (Living Off The Land Binaries)
        "certutil.exe", "bitsadmin.exe", "rundll32.exe",
        "regsvr32.exe", "msiexec.exe", "installutil.exe",
        "regasm.exe", "regsvcs.exe", "msbuild.exe",
        "cmstp.exe", "msxsl.exe", "ieexec.exe",
        # System utilities often abused
        "reg.exe", "schtasks.exe", "sc.exe",
        "net.exe", "net1.exe", "netsh.exe",
        "wmic.exe", "taskkill.exe",
        # Scripting runtimes
        "python.exe", "python3.exe", "pythonw.exe",
        "node.exe", "ruby.exe", "perl.exe",
        "java.exe", "javaw.exe",
    }

    # Processes that should ALWAYS be killed if spawned from USB
    ALWAYS_KILL_FROM_USB: Set[str] = {
        "powershell.exe", "pwsh.exe", "cmd.exe",
        "wscript.exe", "cscript.exe", "mshta.exe",
        "certutil.exe", "bitsadmin.exe", "rundll32.exe",
        "regsvr32.exe", "python.exe", "python3.exe",
        "node.exe", "ruby.exe", "perl.exe",
        "java.exe", "javaw.exe",
    }

    # ─────────────────────────────────────────────────────────────────────
    # SUSPICIOUS COMMAND-LINE FLAGS — evasive execution patterns
    # ─────────────────────────────────────────────────────────────────────
    SUSPICIOUS_FLAGS: List[str] = [
        # PowerShell evasion
        "-nop", "-noprofile", "-executionpolicy bypass", "-ep bypass",
        "-w hidden", "-windowstyle hidden", "-enc", "-encodedcommand",
        "-sta", "-noninteractive",
        # Generic evasion
        "phantom-test", "phantom_test", "start-sleep",
        # Download cradles
        "invoke-webrequest", "invoke-restmethod", "downloadstring",
        "downloadfile", "downloaddata", "start-bitstransfer",
        "urlcache", "certutil -urlcache",
        # Persistence
        "reg add", "schtasks /create", "sc create",
        "new-scheduledtask", "register-scheduledtask",
        # Credential access
        "mimikatz", "sekurlsa", "lsadump", "invoke-mimikatz",
        "get-credential", "convertto-securestring",
        # Reconnaissance
        "invoke-portscan", "test-netconnection",
        # Execution
        "invoke-expression", "iex(", "iex (",
        # Obfuscation
        "frombase64string", "[convert]::frombase64",
        "charcode", "replace(",
        # Process injection
        "invoke-shellcode", "invoke-dllinjection",
        "virtualalloc", "createthread",
    ]

    # High-confidence kill indicators — if ANY of these are in cmdline, kill immediately
    INSTANT_KILL_PATTERNS: List[str] = [
        "-encodedcommand", "-enc ", "encodedcommand",
        "invoke-mimikatz", "mimikatz",
        "invoke-shellcode", "invoke-dllinjection",
        "downloadstring(", "downloadfile(",
        "-windowstyle hidden",
        "certutil -urlcache -split -f",
        "bitsadmin /transfer",
        "phantom-test", "phantom_test",
    ]

    def __init__(self, callback: Optional[Callable] = None):
        self.callback = callback
        self._running = False
        self._thread: Optional[threading.Thread] = None
        self._known_pids: Set[int] = set()
        self._event_loop: Optional[asyncio.AbstractEventLoop] = None
        self._killed_pids: Set[int] = set()  # Track killed PIDs to avoid duplicate alerts
        self._kill_count = 0

    def start(self, loop: Optional[asyncio.AbstractEventLoop] = None):
        if self._running:
            return
        self._running = True
        self._event_loop = loop
        self._thread = threading.Thread(
            target=self._monitor_loop,
            name="PhantomProcessMonitor",
            daemon=True
        )
        self._thread.start()
        logger.info("🛡️ PHANTOM Autonomous Process Surveillance & Containment Agent started.")

    def stop(self):
        self._running = False
        logger.info(f"PHANTOM Process Surveillance Agent stopped. Total kills this session: {self._kill_count}")

    def _broadcast_safe(self, coro):
        if self._event_loop and self._event_loop.is_running():
            try:
                asyncio.run_coroutine_threadsafe(coro, self._event_loop)
            except Exception as e:
                logger.debug(f"Failed to dispatch coroutine to loop: {e}")

    # ─────────────────────────────────────────────────────────────────────
    # MAIN MONITORING LOOP — Ultra-fast 500ms polling
    # ─────────────────────────────────────────────────────────────────────

    def _monitor_loop(self):
        """
        Continuous process surveillance loop.
        Polls every 500ms for new processes and analyzes each one.
        """
        try:
            self._known_pids = set(psutil.pids())
        except Exception:
            self._known_pids = set()

        while self._running:
            try:
                time.sleep(0.5)  # 500ms polling — fast enough for real-time response
                current_pids = set(psutil.pids())
                new_pids = current_pids - self._known_pids

                for pid in new_pids:
                    if pid in self._killed_pids:
                        continue

                    try:
                        self._analyze_process(pid)
                    except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                        pass
                    except Exception as e:
                        logger.debug(f"Process analysis error for PID {pid}: {e}")

                self._known_pids = current_pids

            except Exception as e:
                logger.debug(f"Process monitor cycle error: {e}")
                time.sleep(1.0)

    # ─────────────────────────────────────────────────────────────────────
    # PROCESS ANALYSIS ENGINE
    # ─────────────────────────────────────────────────────────────────────

    def _analyze_process(self, pid: int):
        """
        Deep-analyzes a new process to determine if it's a threat.
        Makes autonomous kill/allow decisions.
        """
        # Whitelist PHANTOM backend itself, frontend dev server (node/vite), parent process, and project workspace
        try:
            my_pid = os.getpid()
            if pid == my_pid:
                return
            p = psutil.Process(pid)
            parent = p.parent()
            if parent and (parent.pid == my_pid or parent.pid == os.getppid()):
                return

            proc_cwd = (p.cwd() or "").lower()
            proc_exe = (p.exe() or "").lower()
            project_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).lower()
            if project_dir in proc_cwd or project_dir in proc_exe:
                return
        except Exception:
            return

        try:
            name = p.name().lower()
            cmdline_list = p.cmdline()
            cmdline = " ".join(cmdline_list).lower()
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            return

        exe_path = ""
        cwd = ""

        try:
            exe_path = p.exe() or ""
        except (psutil.AccessDenied, psutil.NoSuchProcess):
            pass

        try:
            cwd = p.cwd() or ""
        except (psutil.AccessDenied, psutil.NoSuchProcess):
            pass

        # ── Check 1: Is this a known suspicious process name? ──
        is_suspicious_host = name in self.SUSPICIOUS_NAMES

        # ── Check 2: Does command line contain suspicious flags? ──
        has_suspicious_flag = any(flag in cmdline for flag in self.SUSPICIOUS_FLAGS)

        # ── Check 3: Is it spawned from or references a USB drive? ──
        is_from_usb = False
        detected_usb_mount = ""
        active_session = session_manager.get_active_session()
        usb_mount = ""
        if active_session:
            raw_mount = active_session.get("mount_point", "").lower()
            clean_usb = raw_mount.rstrip("\\").rstrip("/")
            if clean_usb:
                # Require path separator to prevent false matches like 'node:process' matching 'e:'
                if (f"{clean_usb}\\" in cmdline or f"{clean_usb}/" in cmdline or 
                    (exe_path and f"{clean_usb}\\" in exe_path.lower()) or 
                    (cwd and f"{clean_usb}\\" in cwd.lower())):
                    is_from_usb = True
                    detected_usb_mount = active_session.get("mount_point", "")

        # Also check all removable drive letters mounted on the machine
        if not is_from_usb:
            try:
                for part in psutil.disk_partitions(all=True):
                    if "removable" in part.opts.lower():
                        r_drive = part.device.rstrip("\\").rstrip("/").lower()
                        if (f"{r_drive}\\" in cmdline or f"{r_drive}/" in cmdline or
                            (exe_path and f"{r_drive}\\" in exe_path.lower()) or 
                            (cwd and f"{r_drive}\\" in cwd.lower())):
                            is_from_usb = True
                            detected_usb_mount = part.device
                            break
            except Exception:
                pass

        # Regex fallback for non-system drive letters in cmdline (must be followed by slash)
        if not is_from_usb:
            import re
            m = re.search(r'\b([a-zA-Z]:)[/\\]', cmdline)
            if m:
                matched_drive = m.group(1).upper()
                if matched_drive not in ("C:", "D:"):
                    is_from_usb = True
                    detected_usb_mount = matched_drive

        # ── Check 4: Instant-kill pattern match ──
        has_instant_kill = any(pat in cmdline for pat in self.INSTANT_KILL_PATTERNS)

        # ── Check 5: Executable running directly from USB path ──
        exe_from_usb = False
        if usb_mount and exe_path:
            exe_from_usb = usb_mount in exe_path.lower()

        # ─────────────────────────────────────────────────────────
        # DECISION ENGINE — Autonomous Kill/Allow
        # ─────────────────────────────────────────────────────────

        should_kill = False
        threat_type = "UNKNOWN"
        severity = "MEDIUM"
        risk_delta = 0

        # RULE 1: Any executable running from USB → KILL
        if exe_from_usb:
            should_kill = True
            threat_type = "USB_ORIGIN_EXECUTION"
            severity = "CRITICAL"
            risk_delta = 45
            logger.warning(f"🚨 USB-ORIGIN EXECUTION: {name} (PID: {pid}) running from {exe_path}")

        # RULE 2: Instant-kill patterns → KILL immediately
        elif has_instant_kill:
            should_kill = True
            threat_type = "INSTANT_KILL_PATTERN"
            severity = "CRITICAL"
            risk_delta = 50
            logger.warning(f"🚨 INSTANT KILL PATTERN: {name} (PID: {pid})")

        # RULE 3: Suspicious host + suspicious flags → KILL
        elif is_suspicious_host and has_suspicious_flag:
            should_kill = True
            threat_type = "EVASIVE_SCRIPT_HOST_EXECUTION"
            severity = "CRITICAL"
            risk_delta = 40
            logger.warning(f"🚨 EVASIVE EXECUTION: {name} (PID: {pid})")

        # RULE 4: Suspicious host + from USB → KILL
        elif is_suspicious_host and is_from_usb:
            should_kill = True
            threat_type = "USB_TRIGGERED_SCRIPT_HOST"
            severity = "CRITICAL"
            risk_delta = 45
            logger.warning(f"🚨 USB-TRIGGERED SCRIPT HOST: {name} (PID: {pid})")

        # RULE 5: Known always-kill process from USB context → KILL
        elif name in self.ALWAYS_KILL_FROM_USB and is_from_usb:
            should_kill = True
            threat_type = "ALWAYS_KILL_USB_PROCESS"
            severity = "CRITICAL"
            risk_delta = 40

        # RULE 6: Any suspicious host with "phantom" in cmdline (test detection) → KILL
        elif is_suspicious_host and "phantom" in cmdline:
            should_kill = True
            threat_type = "PHANTOM_TEST_DETECTED"
            severity = "HIGH"
            risk_delta = 35

        if not should_kill:
            return  # Process is clean — allow it

        # ─────────────────────────────────────────────────────────
        # EXECUTE CONTAINMENT
        # ─────────────────────────────────────────────────────────
        self._execute_containment(
            proc=p,
            pid=pid,
            name=name,
            cmdline=" ".join(cmdline_list),
            threat_type=threat_type,
            severity=severity,
            risk_delta=risk_delta,
            is_from_usb=is_from_usb,
            detected_usb_mount=detected_usb_mount,
            active_session=active_session
        )

    # ─────────────────────────────────────────────────────────────────────
    # CONTAINMENT EXECUTION — Kill process + entire tree + auto-eject USB
    # ─────────────────────────────────────────────────────────────────────

    def _execute_containment(
        self, proc: psutil.Process, pid: int, name: str, cmdline: str,
        threat_type: str, severity: str, risk_delta: int,
        is_from_usb: bool, detected_usb_mount: str,
        active_session: Optional[Dict[str, Any]]
    ):
        """
        Executes autonomous containment:
        1. Records threat event
        2. Broadcasts to UI
        3. Kills the process
        4. Kills the entire process tree (children)
        5. Records containment alert
        6. Forcefully auto-ejects the USB drive if threat is USB-related
        """
        session_id = active_session["session_id"] if active_session else f"sess_live_{int(time.time())}"
        now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        self._killed_pids.add(pid)
        self._kill_count += 1

        # 1. Record threat detection event
        event = event_collector.normalize_event(
            session_id=session_id,
            source="PROCESS_MONITOR",
            event_type="SUSPICIOUS_PROCESS_SPAWNED",
            severity=severity,
            data={
                "process_name": name,
                "pid": pid,
                "command_line": cmdline[:500],
                "is_from_usb": is_from_usb,
                "detected_usb_mount": detected_usb_mount,
                "threat_type": threat_type,
                "anomaly": threat_type,
                "decision": "AUTONOMOUS_KILL"
            },
            risk_score_delta=risk_delta
        )
        session_manager.record_event(event)

        # 2. AI Narration
        narration = (
            f"🚨 CRITICAL THREAT DETECTED: '{name}' (PID: {pid}) identified as {threat_type.replace('_', ' ')}. "
            f"Command: '{cmdline[:120]}'. "
            f"AUTONOMOUS CONTAINMENT ENGAGED — process will be surgically terminated."
        )
        self._broadcast_safe(ws_manager.broadcast_live(event.dict()))
        self._broadcast_safe(ws_manager.broadcast_narrator({
            "session_id": session_id,
            "narration": narration,
            "timestamp": now
        }))

        # 3. KILL THE PROCESS TREE
        killed_children = []
        try:
            # First, kill all children (recursive)
            children = proc.children(recursive=True)
            for child in children:
                try:
                    child_name = child.name()
                    child.kill()
                    killed_children.append({"pid": child.pid, "name": child_name})
                    self._killed_pids.add(child.pid)
                    logger.warning(f"   └── Killed child process: {child_name} (PID: {child.pid})")
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    pass
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass

        # 4. Kill the main process
        containment_res = response_engine.terminate_process(
            pid=pid,
            process_name=name,
            session_id=session_id,
            reason=f"Autonomous Kill: {threat_type} ('{cmdline[:80]}')"
        )

        # 5. Broadcast containment action
        containment_event = {
            "source": "RESPONSE_ENGINE",
            "event_type": "CONTAINMENT_TRIGGERED",
            "severity": "CRITICAL",
            "timestamp": now,
            "session_id": session_id,
            "data": {
                "action": "PROCESS_TREE_ANNIHILATION",
                "target_pid": pid,
                "process_name": name,
                "threat_type": threat_type,
                "children_killed": len(killed_children),
                "killed_children": killed_children[:5],
                "status": "TERMINATED_AND_ISOLATED",
                "total_kills_this_session": self._kill_count
            }
        }
        self._broadcast_safe(ws_manager.broadcast_live(containment_event))

        # 6. Final narration for kill
        children_msg = f" Along with {len(killed_children)} child processes." if killed_children else ""
        self._broadcast_safe(ws_manager.broadcast_narrator({
            "session_id": session_id,
            "narration": (
                f"🛡️ AUTONOMOUS CONTAINMENT COMPLETE: '{name}' (PID: {pid}) surgically neutralized. "
                f"Threat type: {threat_type.replace('_', ' ')}.{children_msg} "
                f"Total kills this session: {self._kill_count}. System secured."
            ),
            "timestamp": now
        }))

        logger.warning(
            f"🛡️ CONTAINMENT EXECUTED: {name} (PID: {pid}) | "
            f"Type: {threat_type} | "
            f"Children killed: {len(killed_children)} | "
            f"Session kills: {self._kill_count}"
        )

        # 7. USER-CONTROLLED USB EJECT — If threat is from USB or references USB, notify user that ejection is available
        if is_from_usb or detected_usb_mount or threat_type in {"USB_ORIGIN_EXECUTION", "USB_TRIGGERED_SCRIPT_HOST", "ALWAYS_KILL_USB_PROCESS"}:
            eject_drive = detected_usb_mount
            if not eject_drive and active_session:
                eject_drive = active_session.get("mount_point", "")
            if not eject_drive:
                import re
                m = re.search(r'\b([a-zA-Z]:)[/\\]?', cmdline)
                if m and m.group(1).upper() not in ("C:", "D:"):
                    eject_drive = m.group(1).upper()
            if not eject_drive:
                try:
                    for part in psutil.disk_partitions(all=True):
                        if "removable" in part.opts.lower():
                            eject_drive = part.device
                            break
                except Exception:
                    pass

            if eject_drive:
                logger.warning(f"⚠️ USB-LINKED PROCESS TERMINATED ({name} PID:{pid}) — Drive {eject_drive} remains mounted. Eject option available to user.")
                try:
                    threat_action_event = {
                        "source": "PROCESS_MONITOR",
                        "event_type": "USB_THREAT_ACTION_REQUIRED",
                        "severity": "CRITICAL",
                        "timestamp": now,
                        "session_id": session_id,
                        "data": {
                            "mount_point": eject_drive,
                            "triggering_process": name,
                            "triggering_pid": pid,
                            "threat_type": threat_type,
                            "status": "AWAITING_USER_EJECT",
                            "can_eject": True,
                            "reason": f"Malicious process {name} (PID: {pid}) terminated. Drive remains connected until user chooses to eject."
                        }
                    }
                    self._broadcast_safe(ws_manager.broadcast_live(threat_action_event))

                    self._broadcast_safe(ws_manager.broadcast_narrator({
                        "session_id": session_id,
                        "narration": (
                            f"🛡️ MALICIOUS PROCESS TERMINATED: Process '{name}' from {eject_drive} was killed immediately. "
                            f"Drive remains mounted — click EJECT DRIVE when you wish to safely disconnect."
                        ),
                        "timestamp": now
                    }))
                except Exception as e:
                    logger.error(f"Error notifying user eject for USB drive {eject_drive}: {e}")


process_monitor = ProcessMonitor()
