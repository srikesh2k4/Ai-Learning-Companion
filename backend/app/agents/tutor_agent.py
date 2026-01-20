"""AI Tutor Agent using OpenAI ChatGPT."""
from typing import Optional
from tenacity import retry, stop_after_attempt, wait_exponential
import logging
from openai import AsyncOpenAI

from ..config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# Initialize OpenAI client
client = AsyncOpenAI(api_key=settings.openai_api_key)

class TutorAgent:
    """AI Tutor Agent using ChatGPT."""
    
    def __init__(self):
        self.model = settings.openai_model
        self.system_prompt = self._get_system_prompt()
        logger.info(f"TutorAgent initialized with model: {self.model}")
    
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
        """Chat with tutor using ChatGPT."""
        messages = [
            {"role": "system", "content": self.system_prompt}
        ]
        
        if context:
            messages.append({"role": "user", "content": f"Context: {context}"})
        
        messages.append({"role": "user", "content": message})
        
        response = await client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=1000,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    
    async def get_response(self, message: str, history: list = None) -> str:
        """Get response from tutor with history support."""
        messages = [
            {"role": "system", "content": self.system_prompt}
        ]
        
        # Add history if provided
        if history:
            for msg in history[-10:]:  # Last 10 messages for context
                role = msg.get('role', 'user')
                content = msg.get('content', '')
                if role in ['user', 'assistant', 'system']:
                    messages.append({"role": role, "content": content})
        
        messages.append({"role": "user", "content": message})
        
        response = await client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=1000,
            temperature=0.7
        )
        
        return response.choices[0].message.content

_tutor_agent: Optional[TutorAgent] = None

def get_tutor_agent() -> TutorAgent:
    global _tutor_agent
    if _tutor_agent is None:
        _tutor_agent = TutorAgent()
    return _tutor_agent
