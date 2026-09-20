import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.ws_manager import ws_manager

logger = logging.getLogger("phantom.ws_routes")
router = APIRouter(tags=["websockets"])

@router.websocket("/ws/live")
async def ws_live_endpoint(websocket: WebSocket):
    await ws_manager.connect_live(websocket)
    try:
        while True:
            # Keepalive / ping-pong
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect_live(websocket)
    except Exception as e:
        logger.error(f"Live WebSocket error: {e}")
        ws_manager.disconnect_live(websocket)

@router.websocket("/ws/narrator")
async def ws_narrator_endpoint(websocket: WebSocket):
    await ws_manager.connect_narrator(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect_narrator(websocket)
    except Exception as e:
        logger.error(f"Narrator WebSocket error: {e}")
        ws_manager.disconnect_narrator(websocket)
