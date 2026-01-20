"""Main FastAPI application."""
import logging
from contextlib import asynccontextmanager
from datetime import timedelta

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.config import get_settings
from app.database import get_db, sessionmanager
from app.dependencies import get_current_user
from app.middleware import LoggingMiddleware
from app.models.db_models import User
from app.models.schemas import *
from app.services.auth_service import AuthService
from app.services.learning_service import LearningService
from app.agents.tutor_agent import get_tutor_agent
from app.agents.problem_generator import get_problem_generator

# Setup
settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan."""
    logger.info(f"Starting {settings.app_name}")
    
    # Initialize database
    sessionmanager.init()
    await sessionmanager.create_all()
    
    # Initialize agents
    get_tutor_agent()
    get_problem_generator()
    
    logger.info("Application ready")
    
    yield
    
    await sessionmanager.close()
    logger.info("Application shutdown")

# Create app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan
)

# Middleware
app.add_middleware(LoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth endpoints

@app.post("/api/auth/register", response_model=Token, status_code=201)
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register new user."""
    user = await AuthService.register_user(db, user_data)
    
    token = AuthService.create_access_token(data={"sub": user.username})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }

@app.post("/api/auth/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """Login user."""
    user = await AuthService.authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    
    token = AuthService.create_access_token(data={"sub": user.username})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }

@app.get("/api/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user."""
    return UserResponse.model_validate(current_user)

@app.put("/api/auth/profile", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update user profile."""
    if update_data.full_name:
        current_user.full_name = update_data.full_name
    if update_data.email:
        current_user.email = update_data.email
    if update_data.learning_goals:
        current_user.learning_goals = update_data.learning_goals
    if update_data.preferred_topics:
        current_user.preferred_topics = update_data.preferred_topics
    
    await db.commit()
    await db.refresh(current_user)
    
    return UserResponse.model_validate(current_user)

# Conversation endpoints

@app.post("/api/conversations", response_model=ConversationResponse)
async def create_conversation(
    conv_data: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create new conversation."""
    conv = await LearningService.create_conversation(db, current_user.id, conv_data.title)
    
    return ConversationResponse(
        id=conv.id,
        title=conv.title,
        topic=conv.topic,
        created_at=conv.created_at,
        message_count=0
    )

@app.get("/api/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user conversations."""
    convs = await LearningService.get_user_conversations(db, current_user.id)
    
    return [
        ConversationResponse(
            id=c.id,
            title=c.title,
            topic=c.topic,
            created_at=c.created_at,
            message_count=len(c.messages) if hasattr(c, 'messages') else 0
        )
        for c in convs
    ]

@app.get("/api/conversations/{conv_id}", response_model=ConversationDetailResponse)
async def get_conversation(
    conv_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get conversation with messages."""
    conv = await LearningService.get_conversation_with_messages(db, conv_id, current_user.id)
    
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return ConversationDetailResponse(
        id=conv.id,
        title=conv.title,
        topic=conv.topic,
        created_at=conv.created_at,
        messages=[MessageResponse.model_validate(m) for m in conv.messages]
    )

@app.delete("/api/conversations/{conv_id}", status_code=204)
async def delete_conversation(
    conv_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a conversation."""
    deleted = await LearningService.delete_conversation(db, conv_id, current_user.id)
    
    if not deleted:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return None

@app.post("/api/conversations/{conv_id}/messages", response_model=MessageResponse)
async def send_message(
    conv_id: int,
    msg_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Send message in conversation."""
    # Verify conversation belongs to user
    conv = await LearningService.get_conversation_with_messages(db, conv_id, current_user.id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Save user message
    user_msg = await LearningService.add_message(db, conv_id, "user", msg_data.content)
    
    # Get AI response
    agent = get_tutor_agent()
    ai_response = await agent.chat(msg_data.content)
    
    # Save AI message
    ai_msg = await LearningService.add_message(db, conv_id, "assistant", ai_response)
    
    return MessageResponse.model_validate(ai_msg)

# Practice endpoints

@app.post("/api/practice/generate", response_model=dict)
async def generate_problem(
    request: ProblemGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate practice problem."""
    agent = get_problem_generator()
    problem = await agent.generate(request.topic, request.difficulty)
    
    # Save session
    session = await LearningService.create_practice_session(
        db,
        current_user.id,
        request.topic,
        request.difficulty,
        problem.problem_text,
        problem.hints,
        problem.solution
    )
    
    return {
        "session_id": session.id,
        "problem": {
            "problem_text": problem.problem_text,
            "hints": problem.hints,
            "difficulty": request.difficulty,
            "topic": request.topic
        }
    }

@app.post("/api/practice/submit", response_model=dict)
async def submit_answer(
    request: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Submit practice answer."""
    # Get tutor agent to evaluate
    agent = get_tutor_agent()
    
    # Simple evaluation (you can make this more sophisticated)
    feedback_prompt = f"""Evaluate this student answer and provide feedback.

Problem context available in session.
Student answer: {request.answer}

Provide:
1. Is it correct? (yes/no)
2. Score out of 100
3. Constructive feedback"""
    
    feedback_text = await agent.chat(feedback_prompt)
    
    # Parse feedback (simplified - in production use structured output)
    is_correct = "yes" in feedback_text.lower()[:100]
    score = 85.0 if is_correct else 40.0
    
    # Update session
    await LearningService.submit_practice_answer(
        db,
        request.session_id,
        current_user.id,
        request.answer,
        is_correct,
        score,
        feedback_text
    )
    
    return {
        "is_correct": is_correct,
        "score": score,
        "feedback": feedback_text
    }

@app.get("/api/practice/history", response_model=List[PracticeSessionResponse])
async def get_practice_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get practice history."""
    from sqlalchemy import select, desc
    from app.models.db_models import PracticeSession
    
    result = await db.execute(
        select(PracticeSession)
        .where(PracticeSession.user_id == current_user.id)
        .order_by(desc(PracticeSession.created_at))
        .limit(20)
    )
    
    sessions = result.scalars().all()
    
    return [PracticeSessionResponse.model_validate(s) for s in sessions]

# Analytics endpoints

@app.get("/api/stats", response_model=LearningStats)
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get learning statistics."""
    stats = await LearningService.get_user_stats(db, current_user.id)
    return LearningStats(**stats)

# Utility endpoints

@app.get("/", response_model=HealthCheck)
async def health():
    """Health check."""
    return HealthCheck(
        status="healthy",
        service=settings.app_name,
        version=settings.app_version,
        database=True,
        ai_service=True
    )

@app.get("/api/topics")
async def get_topics():
    """Get suggested topics."""
    return {
        "topics": [
            "Python Programming",
            "Data Structures",
            "Algorithms",
            "Web Development",
            "Machine Learning",
            "Database Design",
            "System Design",
            "Mathematics",
            "Statistics",
            "Computer Networks"
        ]
    }

# ============================================================================
# AI AGENT ENDPOINTS
# ============================================================================

@app.post("/api/agent/recommendation", response_model=AgentRecommendationResponse)
async def get_agent_recommendation(
    request: AgentRecommendationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get AI agent recommendation based on user context."""
    try:
        # Get user stats
        stats = await LearningService.get_user_stats(db, current_user.id)
        
        # Build context for AI
        context = f"""
User: {current_user.full_name}
Current page: {request.current_route}
Learning goals: {current_user.learning_goals or 'Not set'}
Total conversations: {stats['total_conversations']}
Practice sessions: {stats['total_practice_sessions']}
Completed sessions: {stats['practice_sessions_completed']}
Average score: {stats['average_score']:.1f}%
Topics practiced: {', '.join(stats['topics_practiced'][:5]) if stats['topics_practiced'] else 'None yet'}
"""
        
        # Get recommendation from tutor agent
        tutor = get_tutor_agent()
        prompt = f"""Based on this user's learning context, provide a brief, helpful recommendation.

{context}

Respond in this exact JSON format:
{{
    "quick_tip": "A short motivational tip (1 sentence)",
    "suggestion": "What the user should do next (2-3 sentences max)",
    "estimated_time": "Time estimate like '5 min' or '15 min'",
    "priority": "low" or "medium" or "high",
    "action_type": "practice" or "review" or "learn" or "break"
}}

Be encouraging and specific. If they're new, suggest starting with basics. If they've been practicing a lot, maybe suggest a break or review."""

        response = await tutor.get_response(prompt, [])
        
        # Parse JSON from response
        import json
        import re
        
        # Try to extract JSON from response
        json_match = re.search(r'\{[^{}]*\}', response, re.DOTALL)
        if json_match:
            rec_data = json.loads(json_match.group())
        else:
            # Default response if parsing fails
            rec_data = {
                "quick_tip": "Keep up the great work! Consistency is key to learning.",
                "suggestion": "Try practicing a new topic or review your recent sessions to reinforce your learning.",
                "estimated_time": "10 min",
                "priority": "medium",
                "action_type": "practice"
            }
        
        return AgentRecommendationResponse(
            quick_tip=rec_data.get("quick_tip", "Keep learning!"),
            suggestion=rec_data.get("suggestion", "Try a practice session."),
            estimated_time=rec_data.get("estimated_time", "10 min"),
            priority=rec_data.get("priority", "medium"),
            action_type=rec_data.get("action_type", "practice"),
            stats=AgentStatsResponse(
                total_conversations=stats['total_conversations'],
                total_practice_sessions=stats['total_practice_sessions'],
                practice_sessions_completed=stats['practice_sessions_completed'],
                average_score=stats['average_score'],
                topics_practiced=stats['topics_practiced'][:10]
            )
        )
    except Exception as e:
        logger.error(f"Agent recommendation error: {e}")
        # Return default recommendation on error
        return AgentRecommendationResponse(
            quick_tip="Ready to learn something new today?",
            suggestion="Start with a practice session or chat with the AI tutor to explore topics.",
            estimated_time="10 min",
            priority="medium",
            action_type="learn",
            stats=None
        )

@app.post("/api/agent/chat", response_model=AgentChatResponse)
async def agent_chat(
    request: AgentChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Chat with AI agent."""
    try:
        # Get user stats for context
        stats = await LearningService.get_user_stats(db, current_user.id)
        
        # Build system context
        system_context = f"""You are a helpful AI learning assistant for {current_user.full_name}.

User's learning profile:
- Learning goals: {current_user.learning_goals or 'Not specified'}
- Topics practiced: {', '.join(stats['topics_practiced'][:5]) if stats['topics_practiced'] else 'None yet'}
- Practice sessions: {stats['total_practice_sessions']} ({stats['practice_sessions_completed']} completed)
- Average score: {stats['average_score']:.1f}%

Be helpful, encouraging, and concise. You can:
- Answer questions about topics they're learning
- Suggest what to study next
- Explain concepts simply
- Provide study tips
- Motivate them

Keep responses brief (2-4 sentences) unless they ask for detailed explanations.
Format responses in markdown when helpful."""

        tutor = get_tutor_agent()
        
        # Create message history with system context
        messages = [{"role": "system", "content": system_context}]
        
        response = await tutor.get_response(request.message, messages)
        
        # Generate follow-up suggestions
        suggestions = []
        if "practice" in request.message.lower() or "learn" in request.message.lower():
            suggestions = ["Start a practice session", "View my progress", "Explore topics"]
        elif "help" in request.message.lower():
            suggestions = ["How do I practice?", "What topics can I learn?", "Show my stats"]
        
        return AgentChatResponse(
            message=response,
            suggestions=suggestions if suggestions else None
        )
    except Exception as e:
        logger.error(f"Agent chat error: {e}")
        return AgentChatResponse(
            message="I apologize, but I'm having trouble responding right now. Please try again in a moment.",
            suggestions=["Try again", "Go to dashboard", "Start practice"]
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
