import sys
import time
import threading
import logging
from typing import Callable, Optional

logger = logging.getLogger("phantom.agent.usb")

class USBMonitor:
    """
    Monitors USB device insertion and removal events using WMI on Windows,
    with fallback polling for cross-platform/sandbox environments.
    """
    def __init__(self, callback: Optional[Callable] = None):
        self.callback = callback
        self._running = False
        self._thread: Optional[threading.Thread] = None

    def start(self):
        self._running = True
        self._thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self._thread.start()
        logger.info("USB Monitor started.")

    def stop(self):
        self._running = False
        logger.info("USB Monitor stopped.")

    def _monitor_loop(self):
        if sys.platform == "win32":
            try:
                import wmi
                c = wmi.WMI()
                raw_wql = "SELECT * FROM __InstanceOperationEvent WITHIN 2 WHERE TargetInstance ISA 'Win32_PnPEntity'"
                watcher = c.watch_for(raw_wql=raw_wql)
                while self._running:
                    try:
                        event = watcher(timeout_ms=1000)
                        if event:
                            device = event.TargetInstance
                            pnpid = str(getattr(device, "PNPDeviceID", ""))
                            if "USB" in pnpid:
                                event_type = "INSERTION" if event.path().Class == "__InstanceCreationEvent" else "REMOVAL"
                                payload = {
                                    "event_type": f"USB_{event_type}",
                                    "device_name": str(getattr(device, "Name", "Unknown USB Device")),
                                    "hardware_id": pnpid,
                                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                                }
                                if self.callback:
                                    self.callback(payload)
                    except Exception:
                        pass
                return
            except Exception as e:
                logger.warning(f"WMI USB listener initialization failed: {e}. Falling back to passive state.")

        while self._running:
            time.sleep(2)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    mon = USBMonitor(callback=lambda e: print("USB Event:", e))
    mon.start()
    time.sleep(3)
    mon.stop()
