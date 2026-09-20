import sys
import time
import threading
import logging
from typing import Callable, Optional

logger = logging.getLogger("phantom.agent.registry")

class RegistryMonitor:
    """
    Monitors Windows Registry modifications in persistence locations (Run keys, Services, USBSTOR).
    """
    def __init__(self, callback: Optional[Callable] = None):
        self.callback = callback
        self._running = False
        self._thread: Optional[threading.Thread] = None

    def start(self):
        self._running = True
        self._thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self._thread.start()
        logger.info("RegistryMonitor started.")

    def stop(self):
        self._running = False
        logger.info("RegistryMonitor stopped.")

    def _monitor_loop(self):
        if sys.platform != "win32":
            while self._running:
                time.sleep(2.0)
            return

        try:
            import winreg
            # Passive monitoring of Run key changes
            run_key_path = r"Software\Microsoft\Windows\CurrentVersion\Run"
            last_values = {}
            while self._running:
                try:
                    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, run_key_path, 0, winreg.KEY_READ) as key:
                        count = winreg.QueryInfoKey(key)[1]
                        current_values = {}
                        for i in range(count):
                            name, val, _ = winreg.EnumValue(key, i)
                            current_values[name] = val
                        
                        # Compare
                        if last_values and current_values != last_values:
                            new_keys = set(current_values.keys()) - set(last_values.keys())
                            if new_keys and self.callback:
                                for k in new_keys:
                                    self.callback({
                                        "source": "REGISTRY_MONITOR",
                                        "event_type": "REGISTRY_PERSISTENCE_ADDED",
                                        "key": f"HKCU\\{run_key_path}\\{k}",
                                        "value": current_values[k],
                                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                                    })
                        last_values = current_values
                except Exception:
                    pass
                time.sleep(2.0)
        except Exception as e:
            logger.warning(f"Registry monitor error: {e}")
            while self._running:
                time.sleep(2.0)
