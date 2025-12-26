from abc import ABC, abstractmethod
from typing import Iterator
class BaseLLMClient(ABC):
    """
    Abstract Base Class for all LLM clients.
    
    WHY: This creates a "contract" - any LLM client (Gemini, OpenAI, Claude)
    must implement these methods. Makes switching providers easy!
    
    CONCEPTS:
    - ABC = Abstract Base Class (can't create objects directly)
    - @abstractmethod = Must be implemented by child classes
    - Type hints (str, dict, Iterator) = Tell Python what types to expect
    """
    
    @abstractmethod
    def generate(self, prompt: str) -> str:
        """
        Send prompt to LLM, get text response.
        
        Args:
            prompt: Text to send to the AI
        Returns:
            AI's response as string
        """
        pass
    
    @abstractmethod
    def generate_json(self, prompt: str) -> dict:
        """
        Send prompt to LLM, get JSON response.
        
        Args:
            prompt: Text to send (should ask for JSON output)
        Returns:
            Parsed JSON as Python dictionary
        """
        pass
    
    @abstractmethod
    def stream(self, prompt: str) -> Iterator[str]:
        """
        Stream response chunk by chunk.
        
        Args:
            prompt: Text to send to the AI
        Yields:
            Pieces of the response as they arrive
        """
        pass