from flask import Blueprint, request, jsonify
from services.ats_service import ATSService

ats_bp = Blueprint("ats", __name__)
ats_service = ATSService()

@ats_bp.route("/api/ats/analyze", methods=["POST"])
def analyze_ats():
    """
    Analyze resume against job description using GenAI ATS.
    """
    data = request.get_json()

    resume_text = data.get("resume", "")
    job_description = data.get("jobDescription", "")

    if not resume_text or not job_description:
        return jsonify({
            "error": "Both resume text and job description are required"
        }), 400

    try:
        result = ats_service.analyze(resume_text, job_description)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "error": "ATS analysis failed",
            "details": str(e)
        }), 500
