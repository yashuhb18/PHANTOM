import time
import threading
import logging
from typing import Callable, Optional, Set

logger = logging.getLogger("phantom.agent.network")

class NetworkMonitor:
    """
    Monitors outbound TCP/UDP connections for suspicious C2 egress or unusual ports.
    """
    SUSPICIOUS_PORTS = {4444, 1337, 8888, 9001, 4443, 6667}

    def __init__(self, callback: Optional[Callable] = None):
        self.callback = callback
        self._running = False
        self._thread: Optional[threading.Thread] = None
        self._known_conns: Set[str] = set()

    def start(self):
        self._running = True
        self._thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self._thread.start()
        logger.info("NetworkMonitor started.")

    def stop(self):
        self._running = False
        logger.info("NetworkMonitor stopped.")

    def _monitor_loop(self):
        try:
            import psutil
            while self._running:
                try:
                    connections = psutil.net_connections(kind="inet")
                    for conn in connections:
                        if conn.status == "ESTABLISHED" and conn.raddr:
                            key = f"{conn.raddr.ip}:{conn.raddr.port}"
                            if key not in self._known_conns:
                                self._known_conns.add(key)
                                if conn.raddr.port in self.SUSPICIOUS_PORTS:
                                    payload = {
                                        "source": "NETWORK_MONITOR",
                                        "event_type": "SUSPICIOUS_OUTBOUND_CONNECTION",
                                        "remote_ip": conn.raddr.ip,
                                        "remote_port": conn.raddr.port,
                                        "pid": conn.pid,
                                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                                    }
                                    if self.callback:
                                        self.callback(payload)
                except Exception:
                    pass
                time.sleep(2.0)
        except ImportError:
            logger.warning("psutil not installed; NetworkMonitor running in passive mode.")
            while self._running:
                time.sleep(2.0)
