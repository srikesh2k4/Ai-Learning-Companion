"""Pydantic schemas."""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional, Literal
from datetime import datetime

# Auth schemas

class UserRegister(BaseModel):
    """User registration."""
    username: str = Field(..., min_length=3, max_length=50, pattern="^[a-zA-Z0-9_-]+$")
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=8, max_length=100)
    learning_goals: Optional[str] = None
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain lowercase')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v

class UserLogin(BaseModel):
    """User login."""
    username: str
    password: str

class UserResponse(BaseModel):
    """User response."""
    id: int
    username: str
    email: str
    full_name: str
    learning_goals: Optional[str]
    preferred_topics: Optional[List[str]]
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    """JWT token."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UserUpdate(BaseModel):
    """User update."""
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    learning_goals: Optional[str] = None
    preferred_topics: Optional[List[str]] = None

# Conversation schemas

class MessageCreate(BaseModel):
    """Create message."""
    content: str = Field(..., min_length=1, max_length=5000)

class MessageResponse(BaseModel):
    """Message response."""
    id: int
    role: str
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    """Create conversation."""
    title: Optional[str] = None
    topic: Optional[str] = None

class ConversationResponse(BaseModel):
    """Conversation response."""
    id: int
    title: str
    topic: Optional[str]
    created_at: datetime
    message_count: int

class ConversationDetailResponse(BaseModel):
    """Conversation with messages."""
    id: int
    title: str
    topic: Optional[str]
    created_at: datetime
    messages: List[MessageResponse]

# Practice schemas

class ProblemGenerateRequest(BaseModel):
    """Generate practice problem."""
    topic: str = Field(..., min_length=2, max_length=100)
    difficulty: Literal["easy", "medium", "hard"]
    problem_type: Optional[str] = None  # "multiple-choice", "coding", "explanation"

class ProblemResponse(BaseModel):
    """Generated problem."""
    problem_text: str
    hints: List[str]
    difficulty: str
    topic: str

class SubmitAnswerRequest(BaseModel):
    """Submit answer."""
    session_id: int
    answer: str = Field(..., min_length=1, max_length=5000)

class AnswerFeedback(BaseModel):
    """Answer feedback."""
    is_correct: bool
    score: float = Field(..., ge=0, le=100)
    feedback: str
    solution: Optional[str] = None

class PracticeSessionResponse(BaseModel):
    """Practice session response."""
    id: int
    topic: str
    difficulty: str
    problem_text: str
    user_answer: Optional[str]
    is_correct: Optional[bool]
    feedback: Optional[str]
    score: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Analytics schemas

class LearningStats(BaseModel):
    """Learning statistics."""
    total_conversations: int
    total_practice_sessions: int
    practice_sessions_completed: int
    average_score: float
    topics_practiced: List[str]
    recent_activity: List[dict]
    progress_by_topic: dict

# ============================================================================
# UTILITY SCHEMAS
# ============================================================================

class HealthCheck(BaseModel):
    """Health check."""
    status: str
    service: str
    version: str
    database: bool
    ai_service: bool

class ErrorResponse(BaseModel):
    """Error response."""
    error: str
    detail: Optional[str] = None
    request_id: Optional[str] = None
