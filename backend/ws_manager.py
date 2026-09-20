import json
import logging
from typing import List, Dict, Any
from fastapi import WebSocket

logger = logging.getLogger("phantom.ws")

class WebSocketManager:
    def __init__(self):
        self.live_connections: List[WebSocket] = []
        self.narrator_connections: List[WebSocket] = []

    async def connect_live(self, websocket: WebSocket):
        await websocket.accept()
        self.live_connections.append(websocket)
        logger.info(f"Live client connected. Total: {len(self.live_connections)}")

    def disconnect_live(self, websocket: WebSocket):
        if websocket in self.live_connections:
            self.live_connections.remove(websocket)
            logger.info(f"Live client disconnected. Total: {len(self.live_connections)}")

    async def connect_narrator(self, websocket: WebSocket):
        await websocket.accept()
        self.narrator_connections.append(websocket)
        logger.info(f"Narrator client connected. Total: {len(self.narrator_connections)}")

    def disconnect_narrator(self, websocket: WebSocket):
        if websocket in self.narrator_connections:
            self.narrator_connections.remove(websocket)
            logger.info(f"Narrator client disconnected. Total: {len(self.narrator_connections)}")

    async def broadcast_live(self, message: Dict[str, Any]):
        payload = json.dumps(message)
        dead_connections = []
        for ws in self.live_connections:
            try:
                await ws.send_text(payload)
            except Exception:
                dead_connections.append(ws)
        for ws in dead_connections:
            self.disconnect_live(ws)

    async def broadcast_narrator(self, message: Dict[str, Any]):
        payload = json.dumps(message)
        dead_connections = []
        for ws in self.narrator_connections:
            try:
                await ws.send_text(payload)
            except Exception:
                dead_connections.append(ws)
        for ws in dead_connections:
            self.disconnect_narrator(ws)

ws_manager = WebSocketManager()
