import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import HOST, PORT, DEBUG
from backend.database import init_db
from backend.core.canary_manager import canary_manager
from backend.api.routes_sessions import router as sessions_router
from backend.api.routes_alerts import router as alerts_router
from backend.api.routes_fingerprints import router as fingerprints_router
from backend.api.routes_canary import router as canary_router
from backend.api.routes_reports import router as reports_router
from backend.api.routes_devices import router as devices_router
from backend.api.routes_simulate import router as simulate_router
from backend.api.ws_routes import router as ws_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("phantom.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing PHANTOM Database...")
    init_db()
    logger.info("Starting Canary Deception Watcher...")
    canary_manager.start_monitoring()
    logger.info(f"PHANTOM Platform ready on http://{HOST}:{PORT}")
    yield
    # Shutdown
    logger.info("Shutting down Canary Deception Watcher...")
    canary_manager.stop_monitoring()

app = FastAPI(
    title="PHANTOM: Autonomous USB Threat Hunting & Deception Platform",
    description="Precision USB threat hunting, behavioral DNA fingerprinting, deception grid, and autonomous containment API.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(sessions_router)
app.include_router(alerts_router)
app.include_router(fingerprints_router)
app.include_router(canary_router)
app.include_router(reports_router)
app.include_router(devices_router)
app.include_router(simulate_router)
app.include_router(ws_router)

@app.get("/health")
def health():
    return {"status": "healthy"}

from fastapi.responses import FileResponse

@app.get("/api/download/app")
def download_app():
    exe_path = Path(__file__).resolve().parent.parent / "dist" / "PHANTOM.exe"
    if exe_path.exists():
        return FileResponse(
            path=str(exe_path),
            filename="PHANTOM-Desktop-v1.0.exe",
            media_type="application/octet-stream"
        )
    # If compiling or fallback, provide launcher batch
    start_bat_path = Path(__file__).resolve().parent.parent / "start.bat"
    return FileResponse(
        path=str(start_bat_path),
        filename="PHANTOM-Launcher.bat",
        media_type="application/octet-stream"
    )

# Mount React frontend static build if available
import sys
from pathlib import Path
from fastapi.staticfiles import StaticFiles

dist_dir = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if hasattr(sys, "_MEIPASS"):
    bundled_dist = Path(sys._MEIPASS) / "frontend" / "dist"
    if bundled_dist.exists():
        dist_dir = bundled_dist

if dist_dir.exists():
    app.mount("/", StaticFiles(directory=str(dist_dir), html=True), name="frontend")
else:
    @app.get("/")
    def root():
        return {
            "platform": "PHANTOM",
            "status": "OPERATIONAL",
            "version": "1.0.0",
            "docs": "/docs"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=DEBUG)
