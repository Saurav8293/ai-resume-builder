from flask import Flask
from flask import request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

import google.generativeai as genai

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend is running!"

@app.route("/test-api", methods=["GET"])
def test_api():
    return {
        "status": "success",
        "message": "Frontend successfully connected to backend"
    }

@app.route("/generate-career-objective", methods=["POST"])
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


@app.route("/generate-project-description", methods = ["POST"])
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

@app.route("/gemini-test", methods= ["GET"])
def gemini_test():
    response = model.generate_content("Say Hello in one sentence like a professional AI assistant")
    return response.text

if __name__ == "__main__":
    app.run(debug=True)