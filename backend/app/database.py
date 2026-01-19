"""Async database configuration."""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from typing import AsyncGenerator
from contextlib import asynccontextmanager
import logging

from .config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

Base = declarative_base()

class DatabaseSessionManager:
    """Manages async database sessions."""
    
    def __init__(self):
        self.engine = None
        self.session_factory = None
    
    def init(self):
        """Initialize database."""
        self.engine = create_async_engine(
            settings.database_url,
            echo=settings.debug,
            future=True,
        )
        
        self.session_factory = async_sessionmaker(
            self.engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autoflush=False,
        )
        
        logger.info("Database initialized")
    
    async def close(self):
        """Close database connections."""
        if self.engine:
            await self.engine.dispose()
    
    @asynccontextmanager
    async def session(self) -> AsyncGenerator[AsyncSession, None]:
        """Get database session."""
        if not self.session_factory:
            raise RuntimeError("DatabaseSessionManager not initialized")
        
        async with self.session_factory() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
    
    async def create_all(self):
        """Create all tables."""
        if not self.engine:
            raise RuntimeError("DatabaseSessionManager not initialized")
        
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        logger.info("Database tables created")

sessionmanager = DatabaseSessionManager()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get database session."""
    async with sessionmanager.session() as session:
        yield session
