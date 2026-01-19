"""AI Tutor Agent."""
from pydantic_ai import Agent
from typing import Optional
from tenacity import retry, stop_after_attempt, wait_exponential
import logging
import os

from ..config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

os.environ['OPENROUTER_API_KEY'] = settings.openrouter_api_key

class TutorAgent:
    """AI Tutor Agent."""
    
    def __init__(self):
        # Use OpenRouter model directly
        self.agent = Agent(
            'openrouter:nvidia/nemotron-3-nano-30b-a3b:free',
            system_prompt=self._get_system_prompt()
        )
        logger.info("TutorAgent initialized")
    
    @staticmethod
    def _get_system_prompt() -> str:
        return """You are an expert AI tutor and learning companion.

Your role:
- Explain concepts clearly with examples
- Break down complex topics into simple parts
- Encourage critical thinking with questions
- Provide practice problems when requested
- Give constructive, encouraging feedback
- Adapt explanations to student's level

Guidelines:
- Be patient, supportive, and encouraging
- Use analogies and real-world examples
- Ask follow-up questions to check understanding
- Celebrate progress and learning
- Keep responses under 300 words unless explaining complex topics
- Format code and math clearly"""
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=2, max=30))
    async def chat(self, message: str, context: Optional[str] = None) -> str:
        """Chat with tutor."""
        prompt = message
        if context:
            prompt = f"Context: {context}\n\nStudent: {message}"
        
        result = await self.agent.run(prompt)
        return result.output

_tutor_agent: Optional[TutorAgent] = None

def get_tutor_agent() -> TutorAgent:
    global _tutor_agent
    if _tutor_agent is None:
        _tutor_agent = TutorAgent()
    return _tutor_agent
