"""Utility functions."""
import re
import secrets
import string
from typing import Optional


def generate_random_string(length: int = 32) -> str:
    """Generate a random string."""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def sanitize_string(text: str) -> str:
    """Sanitize a string by removing special characters."""
    return re.sub(r'[^\w\s-]', '', text).strip()


def truncate_string(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """Truncate a string to a maximum length."""
    if len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)] + suffix


def format_error_message(error: Exception) -> str:
    """Format an error message for display."""
    return f"{type(error).__name__}: {str(error)}"


def parse_topics(topics_str: Optional[str]) -> list:
    """Parse comma-separated topics string into a list."""
    if not topics_str:
        return []
    return [topic.strip() for topic in topics_str.split(',') if topic.strip()]
