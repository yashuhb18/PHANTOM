import os
from pathlib import Path
from dotenv import load_dotenv

# Base Directory
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables
load_dotenv(BASE_DIR / ".env")

# Server Config
HOST = os.getenv("PHANTOM_HOST", "0.0.0.0")
PORT = int(os.getenv("PHANTOM_PORT", "8001"))
DEBUG = os.getenv("PHANTOM_DEBUG", "True").lower() == "true"

# Security Config
SECRET_KEY = os.getenv("PHANTOM_SECRET_KEY", "phantom-super-secret-key-2026")
API_KEY = os.getenv("PHANTOM_API_KEY", "phantom-admin-key")

# Database & Storage
DB_PATH = BASE_DIR / os.getenv("PHANTOM_DB_NAME", "phantom.db")
DECOY_DIR = BASE_DIR / "decoy_files"

# Deception & Agent Config
CANARY_WATCH_ENABLED = os.getenv("CANARY_WATCH_ENABLED", "True").lower() == "true"
AI_NARRATION_INTERVAL = float(os.getenv("AI_NARRATION_INTERVAL", "1.5"))

# GLM / Ollama AI Model Config
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
GLM_MODEL = os.getenv("GLM_MODEL", "glm4:latest")
GLM_TIMEOUT = float(os.getenv("GLM_TIMEOUT", "90.0"))
GLM_ENABLED = os.getenv("GLM_ENABLED", "True").lower() == "true"

