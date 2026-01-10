import re

def normalize_text(text: str) -> str:
    """
    Normalize text for caching & embedding consistency.
    """
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def truncate_text(text: str, max_chars: int) -> str:
    """
    Truncate text safely to control LLM prompt size.
    """
    if not text:
        return ""
    return text[:max_chars]

# GenAI utility placeholder
def is_empty_text(text: str) -> bool:
    return not bool(text and text.strip())
