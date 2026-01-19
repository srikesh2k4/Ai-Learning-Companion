"""User service."""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import logging

from ..models.db_models import User
from ..models.schemas import UserUpdate

logger = logging.getLogger(__name__)

class UserService:
    """User service."""
    
    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
        """Get user by ID."""
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def update_user(db: AsyncSession, user: User, update_data: UserUpdate) -> User:
        """Update user profile."""
        if update_data.full_name is not None:
            user.full_name = update_data.full_name
        if update_data.email is not None:
            user.email = update_data.email
        if update_data.learning_goals is not None:
            user.learning_goals = update_data.learning_goals
        if update_data.preferred_topics is not None:
            user.preferred_topics = update_data.preferred_topics
        
        await db.commit()
        await db.refresh(user)
        
        logger.info(f"User updated: {user.username}")
        return user
