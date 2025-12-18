from config import model
import json
import re

def generate_response(prompt: str) -> dict:
    response = model.generate_content(prompt)
    text = response.text.strip()
    
    json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if json_match:
        text = json_match.group(1)
    
    # Parse JSON string to Python dict
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")
        print(f"Raw text: {text}")
        raise ValueError(f"LLM did not return valid JSON: {e}")