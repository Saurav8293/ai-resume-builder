from flask import Blueprint, request, jsonify
from services.resume_opt_service import ResumeOptimizationService
from services.ats_service import ATSService


optimize_bp = Blueprint("optimize", __name__)
optimizer = ResumeOptimizationService()
ats_service = ATSService()

@optimize_bp.route("/api/resume/optimize", methods=["POST"])
def optimize_resume():
    data = request.get_json()

    resume_text = data.get("resume", "")
    job_description = data.get("jobDescription", "")

    if not resume_text or not job_description:
        return jsonify({"error": "Resume and JD required"}), 400

    #  Run ATS again (fresh)
    ats_result = ats_service.analyze(resume_text, job_description)

    # Optimize resume using ATS feedback
    optimized = optimizer.optimize(
        resume_text,
        job_description,
        ats_result
    )

    return jsonify({
        "ats": ats_result,
        "optimized": optimized
    })
