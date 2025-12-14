from flask import Flask
from flask import request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("Gemini Key Loaded:", GEMINI_API_KEY is not None)
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
    data = request.json
    role = data.get("role")
    return f"Role Received: {role}"


if __name__ == "__main__":
    app.run(debug=True)