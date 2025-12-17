from utils.extract_context import extract_resume_context
from prompts.main_prompt import build_request_prompt
from services.llm_service import generate_response

def generate_resume_context(all_data: dict) -> str:
    context = extract_resume_context(all_data)
    prompt = build_request_prompt(context)
    return generate_response(prompt)