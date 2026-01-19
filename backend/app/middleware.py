"""Application middleware."""
import logging
import time
import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    """Request logging middleware."""
    
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        start_time = time.time()
        
        logger.info(f"→ {request.method} {request.url.path} | ID: {request_id}")
        
        response = await call_next(request)
        
        duration = time.time() - start_time
        
        logger.info(f"← {response.status_code} | {duration:.3f}s | ID: {request_id}")
        
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = f"{duration:.3f}"
        
        return response
