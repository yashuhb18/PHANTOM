import time
import threading
import logging
from typing import Callable, Optional, Set

logger = logging.getLogger("phantom.agent.process")

class ProcessMonitor:
    """
    Monitors process execution for suspicious script hosts and child processes.
    """
    SUSPICIOUS_NAMES = {"powershell.exe", "cmd.exe", "wscript.exe", "cscript.exe", "mshta.exe", "certutil.exe", "bitsadmin.exe"}

    def __init__(self, callback: Optional[Callable] = None):
        self.callback = callback
        self._running = False
        self._thread: Optional[threading.Thread] = None
        self._known_pids: Set[int] = set()

    def start(self):
        self._running = True
        self._thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self._thread.start()
        logger.info("ProcessMonitor started.")

    def stop(self):
        self._running = False
        logger.info("ProcessMonitor stopped.")

    def _monitor_loop(self):
        try:
            import psutil
            self._known_pids = set(psutil.pids())
            while self._running:
                current_pids = set(psutil.pids())
                new_pids = current_pids - self._known_pids
                for pid in new_pids:
                    try:
                        p = psutil.Process(pid)
                        name = p.name().lower()
                        if name in self.SUSPICIOUS_NAMES:
                            cmdline = " ".join(p.cmdline())
                            payload = {
                                "source": "PROCESS_MONITOR",
                                "event_type": "SUSPICIOUS_PROCESS_SPAWNED",
                                "process_name": name,
                                "pid": pid,
                                "cmdline": cmdline,
                                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                            }
                            if self.callback:
                                self.callback(payload)
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        pass
                self._known_pids = current_pids
                time.sleep(1.0)
        except ImportError:
            logger.warning("psutil not installed; ProcessMonitor running in passive simulation mode.")
            while self._running:
                time.sleep(2.0)
