from fastapi import Security, HTTPException, status, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials, APIKeyHeader
from backend.config import API_KEY

security_basic = HTTPBasic(auto_error=False)
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def verify_api_access(
    credentials: HTTPBasicCredentials = Depends(security_basic),
    api_key: str = Security(api_key_header)
):
    """
    Validates either Basic Auth (admin:phantom2026) or X-API-Key header.
    In development/demo mode, requests without auth are allowed if no strict auth is enforced.
    """
    if api_key and api_key == API_KEY:
        return {"authenticated": True, "method": "api_key"}
    
    if credentials:
        if credentials.username == "admin" and credentials.password == "phantom2026":
            return {"authenticated": True, "method": "basic", "user": credentials.username}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )

    # Allow unauthenticated access for demo mode when no credentials provided
    return {"authenticated": False, "mode": "demo"}
