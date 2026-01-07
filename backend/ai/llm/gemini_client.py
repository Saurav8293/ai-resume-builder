import google.generativeai as genai
import json
import re
import os
from typing import Iterator
from dotenv import load_dotenv
from .base_client import BaseLLMClient
load_dotenv()
class GeminiClient(BaseLLMClient):
    """
    Gemini LLM Client - talks to Google's Gemini AI.
    
    CONCEPTS:
    - Inheritance: GeminiClient(BaseLLMClient) means it follows base rules
    - __init__: Constructor, runs when you create the object
    - Environment variables: Secure way to store API keys
    - Retry logic: Try again if API fails (production pattern)
    """
    
    def __init__(self, model_name: str = "gemini-2.5-flash"):
        """Initialize the Gemini client with API key."""
        # Get API key from .env file
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found! Add it to .env file")
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_name)
        self.model_name = model_name
        print(f" GeminiClient ready: {model_name}")
    
    @with_retry
    def generate(self, prompt: str) -> str:
        response = self.model.generate_content(prompt)
        return response.text.strip()

    
    @with_retry
    def generate_json(self, prompt: str) -> dict:
        raw_text = self.generate(prompt)

        match = re.search(
            r'```(?:json)?\s*(\{.*?\})\s*```',
            raw_text,
            re.DOTALL
        )
        json_text = match.group(1) if match else raw_text

        return json.loads(json_text)

    
    def stream(self, prompt: str) -> Iterator[str]:
        """
        Stream response in real-time.
        
        CONCEPT: Generator function (uses yield)
        - yield = Return value but don't stop function
        - Caller gets values one at a time
        - Great for showing response as it generates
        """
        try:
            response = self.model.generate_content(prompt, stream=True)
            for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            print(f" Stream error: {e}")
            raise
# BONUS: Retry wrapper (production pattern)
def with_retry(func, max_attempts: int = 3):
    """
    Decorator to retry failed API calls.
    
    CONCEPT: Decorators wrap functions with extra behavior.
    APIs can fail temporarily - retry makes code robust.
    """
    def wrapper(*args, **kwargs):
        for attempt in range(max_attempts):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                if attempt == max_attempts - 1:
                    raise
                print(f"Retry {attempt + 1}/{max_attempts}...")
        return None
    return wrapper

def with_retry(func, max_attempts: int = 3):
    """
    Retry wrapper for LLM calls.
    Prevents transient Gemini failures from breaking the system.
    """
    def wrapper(*args, **kwargs):
        for attempt in range(max_attempts):
            try:
                return func(*args, **kwargs)
            except Exception:
                if attempt == max_attempts - 1:
                    raise
        return None
    return wrapper
