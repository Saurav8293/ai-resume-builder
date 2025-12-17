from config import model

def generate_response(prompt: str) -> str:
    response = model.generate_content(prompt)
    return response.text.strip()
