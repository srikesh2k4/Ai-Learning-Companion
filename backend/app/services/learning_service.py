"""Learning service."""
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List, Optional
import logging
import time

from ..models.db_models import Conversation, Message, PracticeSession
from ..models.schemas import *

logger = logging.getLogger(__name__)

class LearningService:
    """Learning service."""
    
    @staticmethod
    async def create_conversation(db: AsyncSession, user_id: int, title: Optional[str] = None) -> Conversation:
        """Create new conversation."""
        conv = Conversation(
            user_id=user_id,
            title=title or "New Conversation"
        )
        db.add(conv)
        await db.commit()
        await db.refresh(conv)
        return conv
    
    @staticmethod
    async def get_user_conversations(db: AsyncSession, user_id: int) -> List[Conversation]:
        """Get user conversations."""
        result = await db.execute(
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(desc(Conversation.updated_at))
        )
        return list(result.scalars().all())
    
    @staticmethod
    async def get_conversation_with_messages(db: AsyncSession, conv_id: int, user_id: int) -> Optional[Conversation]:
        """Get conversation with messages."""
        result = await db.execute(
            select(Conversation)
            .options(selectinload(Conversation.messages))
            .where(Conversation.id == conv_id, Conversation.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def add_message(db: AsyncSession, conv_id: int, role: str, content: str) -> Message:
        """Add message to conversation."""
        message = Message(
            conversation_id=conv_id,
            role=role,
            content=content
        )
        db.add(message)
        await db.commit()
        await db.refresh(message)
        return message
    
    @staticmethod
    async def create_practice_session(
        db: AsyncSession,
        user_id: int,
        topic: str,
        difficulty: str,
        problem_text: str,
        hints: List[str],
        solution: str
    ) -> PracticeSession:
        """Create practice session."""
        session = PracticeSession(
            user_id=user_id,
            topic=topic,
            difficulty=difficulty,
            problem_text=problem_text,
            hints=hints,
            solution=solution
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return session
    
    @staticmethod
    async def submit_practice_answer(
        db: AsyncSession,
        session_id: int,
        user_id: int,
        answer: str,
        is_correct: bool,
        score: float,
        feedback: str
    ) -> PracticeSession:
        """Submit practice answer."""
        result = await db.execute(
            select(PracticeSession)
            .where(PracticeSession.id == session_id, PracticeSession.user_id == user_id)
        )
        session = result.scalar_one_or_none()
        
        if not session:
            raise ValueError("Session not found")
        
        session.user_answer = answer
        session.is_correct = is_correct
        session.score = score
        session.feedback = feedback
        session.completed_at = func.now()
        
        await db.commit()
        await db.refresh(session)
        return session
    
    @staticmethod
    async def get_user_stats(db: AsyncSession, user_id: int) -> dict:
        """Get user learning statistics."""
        # Total conversations
        conv_result = await db.execute(
            select(func.count(Conversation.id)).where(Conversation.user_id == user_id)
        )
        total_conversations = conv_result.scalar() or 0
        
        # Total practice sessions
        practice_result = await db.execute(
            select(func.count(PracticeSession.id)).where(PracticeSession.user_id == user_id)
        )
        total_practice = practice_result.scalar() or 0
        
        # Completed sessions
        completed_result = await db.execute(
            select(func.count(PracticeSession.id))
            .where(PracticeSession.user_id == user_id, PracticeSession.is_correct.isnot(None))
        )
        completed = completed_result.scalar() or 0
        
        # Average score
        avg_result = await db.execute(
            select(func.avg(PracticeSession.score))
            .where(PracticeSession.user_id == user_id, PracticeSession.score.isnot(None))
        )
        avg_score = float(avg_result.scalar() or 0.0)
        
        # Topics practiced
        topics_result = await db.execute(
            select(PracticeSession.topic)
            .where(PracticeSession.user_id == user_id)
            .distinct()
        )
        topics = [t[0] for t in topics_result.all()]
        
        return {
            "total_conversations": total_conversations,
            "total_practice_sessions": total_practice,
            "practice_sessions_completed": completed,
            "average_score": round(avg_score, 2),
            "topics_practiced": topics,
            "recent_activity": [],
            "progress_by_topic": {}
        }
