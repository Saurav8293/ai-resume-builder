from prompts.test_prompt import gemini_test_prompt
from services.llm_service import generate_response
    
def generate_prompt() -> str:
    prompt =gemini_test_prompt()
    return generate_response(prompt)