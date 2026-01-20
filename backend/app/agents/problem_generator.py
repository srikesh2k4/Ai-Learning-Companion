"""Problem Generator Agent using OpenAI ChatGPT."""
from pydantic import BaseModel
from typing import List, Optional
from tenacity import retry, stop_after_attempt, wait_exponential
import logging
import json
import re
from openai import AsyncOpenAI

from ..config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# Initialize OpenAI client
client = AsyncOpenAI(api_key=settings.openai_api_key)

class GeneratedProblem(BaseModel):
    """Generated problem structure."""
    problem_text: str
    hints: List[str]
    solution: str
    explanation: str

class ProblemGeneratorAgent:
    """Problem Generator Agent using ChatGPT."""
    
    def __init__(self):
        self.model = settings.openai_model
        self.system_prompt = self._get_system_prompt()
        logger.info(f"ProblemGeneratorAgent initialized with model: {self.model}")
    
    @staticmethod
    def _get_system_prompt() -> str:
        return """You are an expert at creating educational practice problems.

Your task is to generate practice problems in JSON format.

IMPORTANT: Your response must be ONLY valid JSON with this exact structure:
{
    "problem_text": "Clear problem statement here",
    "hints": ["Hint 1", "Hint 2", "Hint 3"],
    "solution": "Complete correct solution",
    "explanation": "Why this solution works"
}

Guidelines:
- Generate clear, well-structured practice problems
- Match difficulty level requested (easy/medium/hard)
- Provide 2-3 progressive hints
- Include complete solution with explanation
- Make problems engaging and relevant

RESPOND WITH ONLY JSON, NO OTHER TEXT."""
    
    def _parse_response(self, response: str) -> GeneratedProblem:
        """Parse the text response into GeneratedProblem."""
        try:
            # Try to find JSON in the response
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                data = json.loads(json_match.group())
                return GeneratedProblem(**data)
        except (json.JSONDecodeError, Exception) as e:
            logger.warning(f"Failed to parse JSON: {e}")
        
        # Fallback: create from text sections
        lines = response.strip().split('\n')
        problem_text = ""
        hints = []
        solution = ""
        explanation = ""
        
        current_section = None
        for line in lines:
            line_lower = line.lower().strip()
            if 'problem' in line_lower and ':' in line:
                current_section = 'problem'
                problem_text = line.split(':', 1)[-1].strip()
            elif 'hint' in line_lower:
                current_section = 'hints'
                hint_text = line.split(':', 1)[-1].strip() if ':' in line else line.strip()
                if hint_text:
                    hints.append(hint_text)
            elif 'solution' in line_lower and ':' in line:
                current_section = 'solution'
                solution = line.split(':', 1)[-1].strip()
            elif 'explanation' in line_lower and ':' in line:
                current_section = 'explanation'
                explanation = line.split(':', 1)[-1].strip()
            elif current_section:
                if current_section == 'problem':
                    problem_text += ' ' + line.strip()
                elif current_section == 'solution':
                    solution += ' ' + line.strip()
                elif current_section == 'explanation':
                    explanation += ' ' + line.strip()
        
        return GeneratedProblem(
            problem_text=problem_text or response[:200],
            hints=hints or ["Think about the basics", "Try breaking it down"],
            solution=solution or "See explanation",
            explanation=explanation or response
        )
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=2, max=30))
    async def generate(self, topic: str, difficulty: str) -> GeneratedProblem:
        """Generate practice problem using ChatGPT."""
        prompt = f"""Generate a {difficulty} difficulty practice problem about: {topic}

The problem should be appropriate for a student learning this topic.
Return ONLY a JSON object with: problem_text, hints (array), solution, explanation"""
        
        response = await client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        return self._parse_response(response.choices[0].message.content)

_problem_agent: Optional[ProblemGeneratorAgent] = None

def get_problem_generator() -> ProblemGeneratorAgent:
    global _problem_agent
    if _problem_agent is None:
        _problem_agent = ProblemGeneratorAgent()
    return _problem_agent
