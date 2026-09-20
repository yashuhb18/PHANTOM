import os
import time
import logging
from pathlib import Path
from typing import Callable, Optional
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

logger = logging.getLogger("phantom.agent.file")

class SensitiveFileHandler(FileSystemEventHandler):
    def __init__(self, callback: Optional[Callable] = None):
        super().__init__()
        self.callback = callback

    def _notify(self, action: str, path: str):
        if self.callback:
            self.callback({
                "source": "FILE_MONITOR",
                "action": action,
                "file_path": path,
                "filename": os.path.basename(path),
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            })

    def on_modified(self, event):
        if not event.is_directory:
            self._notify("FILE_MODIFIED", event.src_path)

    def on_created(self, event):
        if not event.is_directory:
            self._notify("FILE_CREATED", event.src_path)

    def on_deleted(self, event):
        if not event.is_directory:
            self._notify("FILE_DELETED", event.src_path)

class FileMonitor:
    def __init__(self, watch_paths: Optional[list] = None, callback: Optional[Callable] = None):
        self.watch_paths = watch_paths or []
        self.callback = callback
        self.observer = Observer()

    def start(self):
        handler = SensitiveFileHandler(self.callback)
        for path in self.watch_paths:
            p = Path(path)
            if p.exists() and p.is_dir():
                self.observer.schedule(handler, str(p), recursive=True)
                logger.info(f"Watching directory: {p}")
        self.observer.start()
        logger.info("FileMonitor started.")

    def stop(self):
        try:
            self.observer.stop()
            self.observer.join()
        except Exception as e:
            logger.error(f"Error stopping FileMonitor: {e}")
        logger.info("FileMonitor stopped.")
