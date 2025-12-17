from flask import Blueprint, request, jsonify
from utils.extract_context import extract_resume_context 
from prompts.test_prompt import gemini_test_prompt
from services.testing_service import generate_prompt
from services.resume_service import generate_resume_context

resume_bp = Blueprint("resume", __name__)

@resume_bp.route("/test-api", methods=["GET"])
def test_api():
    return {
        "status": "success",
        "message": "Frontend successfully connected to backend"
    }

@resume_bp.route("/generate-career-objective", methods=["POST"])
def generate_career_objective():
    data = request.get_json()
    role = data.get("role", "")
    skills = data.get("skills", [])
    experience = data.get("duration", "")

    prompt = f"""
Write ONE single professional resume career objective.

Role: {role}
Skills: {", ".join(skills)}
Experience: {experience}

Rules:
- ONLY one paragraph
- 2 to 3 sentences
- No headings
- No options
- No bullet points
- No extra explanations
- ATS friendly
"""


    response = model.generate_content(prompt)
    objective = response.text
    return jsonify({
        "objective": objective
    })

@resume_bp.route("/generate-responsibilities", methods= ["POST"])
def generate_responsibilities():
    data = request.get_json()
    prevCompanyName=data.get("expCompany", "")
    role= data.get("expRole", "")
    expDuration= data.get("expDuration", "")
    
    prompt = f"""
    Generate professional resume responsibilities for work experience.

    Company: {prevCompanyName}
    Role: {role}
    Experience Duration: {expDuration}

    Rules:
    - Exactly 3 bullet points
    - Each bullet MUST start with a strong action verb
    - Focus on real-world responsibilities, not projects
    - Mention collaboration, development, problem-solving, or optimization
    - ATS friendly
    - No headings
    - No explanations
    - No emojis
    - No numbering (only bullet points using •)
    """

    
    response=model.generate_content(prompt)
    responsibilities= response.text
    return jsonify({
        "responsibilities" : responsibilities
    })

@resume_bp.route("/generate-project-description", methods = ["POST"])
def generate_project_description():
    data = request.get_json()
    projectName = data.get("projectName", "")
    techSkills = data.get("projectTech", [])
    
    prompt = f"""
Generate professional resume project bullet points.

Project Name: {projectName}
Technologies: {", ".join(techSkills)}

Rules:
- Exactly 2 bullet points
- Each bullet starts with an action verb
- Focus on impact and skills
- ATS friendly
- No headings
- No explanations    
"""

    response = model.generate_content(prompt)
    description = response.text
    return jsonify({
        "description": description  
    })
    
    
    
@resume_bp.route("/api/resume/generate-sections", methods= ["POST"])
def generate_request_to_LLM():
    all_data = request.get_json()
    result= generate_resume_context(all_data)
    return jsonify({
        "result": result
    })

@resume_bp.route("/gemini-test", methods= ["GET"])
def gemini_test():
    result = generate_prompt()
    return result
