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

# Simple length helper (future GenAI usage)
def text_length(text: str) -> int:
    return len(text) if text else 0

# Normalize newlines for consistent GenAI text handling
def normalize_newlines(text: str) -> str:
    return text.replace("\r\n", "\n").replace("\r", "\n") if text else ""

# Safe text preview helper (for logs / debugging)
def preview_text(text: str, max_chars: int = 100) -> str:
    if not text:
        return ""
    return text[:max_chars]

# Whitespace cleanup helper (future GenAI use)
def collapse_spaces(text: str) -> str:
    return " ".join(text.split()) if text else ""

def exceeds_limit(text: str, limit: int) -> bool:
    return bool(text) and len(text) > limit

def to_single_line(text: str) -> str:
    return text.replace("\n", " ") if text else ""

# Returns True if string contains any digits
def has_numbers(text: str) -> bool:
    return any(ch.isdigit() for ch in text) if text else False

# Count words in a text (useful for debugging)
def word_count(text: str) -> int:
    return len(text.split()) if text else 0

# Ensure text ends with a newline (useful for logs/files)
def ensure_trailing_newline(text: str) -> str:
    if not text:
        return ""
    return text if text.endswith("\n") else text + "\n"

# Reverse text (debug helper, not used anywhere)
def reverse_text(text: str) -> str:
    return text[::-1] if text else ""

# Convert text to lowercase safely
def to_lower(text: str) -> str:
    return text.lower() if text else ""

