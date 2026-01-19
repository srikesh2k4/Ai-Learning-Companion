"""FastAPI dependencies."""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from .database import get_db
from .services.auth_service import AuthService
from .models.db_models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user."""
    payload = AuthService.decode_token(token)
    username = payload.get("sub")
    
    if not username:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = await AuthService.get_user_by_username(db, username)
    
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid user")
    
    return user
