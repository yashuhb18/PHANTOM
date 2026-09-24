import json
import logging
import hashlib
import time
from typing import Dict, Any, List, Optional
import httpx
from backend.config import OLLAMA_HOST, GLM_MODEL, GLM_TIMEOUT, GLM_ENABLED

logger = logging.getLogger("phantom.core.glm_client")

class GLMClient:
    """
    High-performance, resilient interface for the GLM-4 model via Ollama.
    Unlocks full potential with:
    - Async & Sync inference with timeouts
    - Memory caching to eliminate redundant local GPU/CPU compute
    - Graceful fallback when Ollama is busy or stopped
    - Structured cybersecurity reasoning (Payload De-obfuscation, Threat Narration, SecOps Copilot)
    """

    def __init__(self):
        self.host = OLLAMA_HOST.rstrip("/")
        self.model = GLM_MODEL
        self.timeout = GLM_TIMEOUT
        self.enabled = GLM_ENABLED
        self._cache: Dict[str, str] = {}
        self._max_cache_size = 200

    def _hash_key(self, text: str) -> str:
        return hashlib.sha256(text.encode("utf-8")).hexdigest()

    def check_health(self) -> Dict[str, Any]:
        """Checks if Ollama is running and if the GLM model is available."""
        if not self.enabled:
            return {"status": "disabled", "model": self.model, "available": False}
        
        start_time = time.time()
        try:
            with httpx.Client(timeout=3.0) as client:
                res = client.get(f"{self.host}/api/tags")
                latency_ms = round((time.time() - start_time) * 1000, 2)
                if res.status_code == 200:
                    models_data = res.json().get("models", [])
                    model_names = [m.get("name") for m in models_data]
                    has_model = any(self.model in name for name in model_names)
                    return {
                        "status": "online",
                        "available": has_model,
                        "model": self.model,
                        "latency_ms": latency_ms,
                        "installed_models": model_names
                    }
                return {
                    "status": "error",
                    "available": False,
                    "code": res.status_code,
                    "latency_ms": latency_ms
                }
        except Exception as e:
            return {
                "status": "offline",
                "available": False,
                "error": str(e),
                "model": self.model
            }

    async def acheck_health(self) -> Dict[str, Any]:
        """Asynchronous health check."""
        if not self.enabled:
            return {"status": "disabled", "model": self.model, "available": False}
        
        start_time = time.time()
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(f"{self.host}/api/tags")
                latency_ms = round((time.time() - start_time) * 1000, 2)
                if res.status_code == 200:
                    models_data = res.json().get("models", [])
                    model_names = [m.get("name") for m in models_data]
                    has_model = any(self.model in name for name in model_names)
                    return {
                        "status": "online",
                        "available": has_model,
                        "model": self.model,
                        "latency_ms": latency_ms,
                        "installed_models": model_names
                    }
                return {
                    "status": "error",
                    "available": False,
                    "code": res.status_code,
                    "latency_ms": latency_ms
                }
        except Exception as e:
            return {
                "status": "offline",
                "available": False,
                "error": str(e),
                "model": self.model
            }

    def generate(self, prompt: str, system: Optional[str] = None, temperature: float = 0.2) -> str:
        """Synchronous text generation with caching and fallback."""
        cache_key = self._hash_key(f"{system}:{prompt}:{temperature}")
        if cache_key in self._cache:
            return self._cache[cache_key]

        if not self.enabled:
            return "[GLM Disabled]"

        try:
            with httpx.Client(timeout=self.timeout) as client:
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": temperature
                    }
                }
                if system:
                    payload["system"] = system

                response = client.post(f"{self.host}/api/generate", json=payload)
                if response.status_code == 200:
                    text = response.json().get("response", "").strip()
                    if len(self._cache) >= self._max_cache_size:
                        self._cache.pop(next(iter(self._cache)))
                    self._cache[cache_key] = text
                    return text
                else:
                    logger.warning(f"Ollama returned code {response.status_code}: {response.text}")
                    return ""
        except Exception as e:
            logger.warning(f"GLM-4 generation failed: {e}")
            return ""

    async def agenerate(self, prompt: str, system: Optional[str] = None, temperature: float = 0.2) -> str:
        """Asynchronous text generation with caching and fallback."""
        cache_key = self._hash_key(f"{system}:{prompt}:{temperature}")
        if cache_key in self._cache:
            return self._cache[cache_key]

        if not self.enabled:
            return "[GLM Disabled]"

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": temperature
                    }
                }
                if system:
                    payload["system"] = system

                response = await client.post(f"{self.host}/api/generate", json=payload)
                if response.status_code == 200:
                    text = response.json().get("response", "").strip()
                    if len(self._cache) >= self._max_cache_size:
                        self._cache.pop(next(iter(self._cache)))
                    self._cache[cache_key] = text
                    return text
                else:
                    logger.warning(f"Ollama async call returned code {response.status_code}")
                    return ""
        except Exception as e:
            logger.warning(f"GLM-4 async generation failed: {e}")
            return ""

    async def achat(self, messages: List[Dict[str, str]], temperature: float = 0.3) -> str:
        """Asynchronous multi-turn chat completion with GPU optimizations."""
        if not self.enabled:
            return "GLM AI reasoning engine is currently disabled in configuration."

        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(self.timeout, connect=10.0, read=90.0)) as client:
                payload = {
                    "model": self.model,
                    "messages": messages,
                    "stream": False,
                    "keep_alive": "60m",
                    "options": {
                        "temperature": 0.1,
                        "num_ctx": 1536,
                        "num_predict": 400,
                        "num_thread": 8
                    }
                }
                response = await client.post(f"{self.host}/api/chat", json=payload)
                if response.status_code == 200:
                    data = response.json()
                    msg = data.get("message", {}).get("content", "").strip()
                    return msg
                else:
                    return f"GLM Chat Error: HTTP {response.status_code}"
        except Exception as e:
            logger.warning(f"GLM Chat failed: {e}")
            return f"Unable to reach GLM-4 inference engine: {e}"

    async def astream_chat(self, messages: List[Dict[str, str]], temperature: float = 0.1):
        """
        Asynchronous streaming chat yielding tokens in real-time as they are produced.
        Optimized with 8-thread scheduling and streamlined VRAM allocation.
        """
        if not self.enabled:
            yield "GLM AI reasoning engine is disabled in configuration."
            return

        payload = {
            "model": self.model,
            "messages": messages,
            "stream": True,
            "keep_alive": "60m",
            "options": {
                "temperature": 0.1,
                "num_ctx": 1536,
                "num_predict": 400,
                "num_thread": 8
            }
        }

        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(self.timeout, connect=10.0, read=60.0)) as client:
                async with client.stream("POST", f"{self.host}/api/chat", json=payload) as response:
                    if response.status_code != 200:
                        yield f"Error from GLM engine: HTTP {response.status_code}"
                        return
                    async for line in response.aiter_lines():
                        if not line:
                            continue
                        try:
                            chunk = json.loads(line)
                            content = chunk.get("message", {}).get("content", "")
                            if content:
                                yield content
                        except Exception:
                            pass
        except Exception as e:
            logger.warning(f"Streaming chat error: {e}")
            yield f"⚠️ Stream interrupted: {e}"


    # ─────────────────────────────────────────────────────────────────────────
    # DOMAIN-SPECIFIC CYBER INTELLIGENCE CAPABILITIES
    # ─────────────────────────────────────────────────────────────────────────

    async def analyze_script(self, script_content: str, filename: str) -> Dict[str, Any]:
        """
        Deep semantic analysis of suspicious scripts (PowerShell, Batch, VBS, Autorun).
        De-obfuscates intent, identifies evasion techniques, and maps MITRE ATT&CK.
        """
        system_prompt = (
            "You are an elite malware analyst and reverse engineer for the PHANTOM endpoint defense system. "
            "Analyze the provided code or script discovered on a USB device. "
            "You must return your analysis in strict JSON format with keys: "
            "'verdict' (SAFE, SUSPICIOUS, or MALICIOUS), "
            "'threat_score' (integer 0-100), "
            "'summary' (2-3 concise sentences), "
            "'evasion_techniques' (list of strings explaining obfuscation or bypasses), "
            "'mitre_techniques' (list of strings like 'T1059.001 - PowerShell'), "
            "'iocs' (list of strings for registry keys, IPs, dropped files, or cmd flags), "
            "'remediation' (clear recommended defensive action)."
        )

        user_prompt = f"Filename: {filename}\nContent:\n```\n{script_content[:3500]}\n```"

        raw_output = await self.agenerate(user_prompt, system=system_prompt, temperature=0.1)

        # Attempt to parse structured JSON from GLM output
        try:
            # Strip markdown fences if present
            clean_json = raw_output
            if "```json" in clean_json:
                clean_json = clean_json.split("```json")[1].split("```")[0].strip()
            elif "```" in clean_json:
                clean_json = clean_json.split("```")[1].split("```")[0].strip()

            parsed = json.loads(clean_json)
            parsed["raw_model"] = self.model
            return parsed
        except Exception:
            # Fallback wrapper if model answered in text
            return {
                "verdict": "SUSPICIOUS" if "malicious" in raw_output.lower() or "threat" in raw_output.lower() else "ANALYZED",
                "threat_score": 75 if "malicious" in raw_output.lower() else 40,
                "summary": raw_output[:300] if raw_output else "Analysis complete.",
                "evasion_techniques": ["Script analysis performed"],
                "mitre_techniques": ["T1059 - Command and Scripting Interpreter"],
                "iocs": [],
                "remediation": "Review suspicious script manually and isolate target host if executed.",
                "raw_analysis": raw_output,
                "raw_model": self.model
            }

    async def generate_forensic_brief(self, session_context: Dict[str, Any]) -> str:
        """
        Generates a comprehensive executive forensic brief from session telemetry.
        """
        system_prompt = (
            "You are the Lead Forensic Incident Responder for the PHANTOM Autonomous Threat Hunting Platform. "
            "Produce an authoritative, publication-ready Executive Forensic Brief in clean GitHub Markdown. "
            "Structure the report with: "
            "# EXECUTIVE FORENSIC INCIDENT REPORT\n"
            "### 1. Executive Summary\n"
            "### 2. Attack DNA & Behavioral Indicators\n"
            "### 3. MITRE ATT&CK Matrix Mapping (Technique IDs & Explanations)\n"
            "### 4. Forensic Chronology & Evidence Breakdown\n"
            "### 5. Autonomous Mitigation & Tactical Remediation\n"
            "Maintain high precision, professional cybersecurity terminology, and clear verdicts."
        )

        context_str = json.dumps(session_context, indent=2)
        prompt = f"Analyze the following USB incident session telemetry and construct the full forensic report:\n{context_str}"

        markdown_report = await self.agenerate(prompt, system=system_prompt, temperature=0.2)
        return markdown_report

glm_client = GLMClient()
