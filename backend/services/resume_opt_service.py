from ai.llm.gemini_client import GeminiClient

class ResumeOptimizationService:
    """
    Uses ATS feedback to intelligently rewrite resume sections.
    """

    def __init__(self):
        self.llm = GeminiClient()


    def optimize(
        self,
        resume_text: str,
        job_description: str,
        ats_analysis: dict
    ) -> dict:
        """
        Optimize resume using ATS analysis feedback.
        """
        prompt = self._build_optimization_prompt(
            resume_text,
            job_description,
            ats_analysis
        )

        return self.llm.generate_json(prompt)
    def _build_optimization_prompt(
        self,
        resume_text: str,
        job_description: str,
        ats_analysis: dict
    ) -> str:
        """
        Build a controlled GenAI prompt for resume optimization.
        """
        missing_skills = ats_analysis.get("analysis", {}).get("missing_skills", [])
        improvements = ats_analysis.get("analysis", {}).get("improvements", [])

        return f"""
You are an expert ATS resume optimizer.

Your task:
- Improve the resume to better match the job description
- ONLY modify career objective, experience bullets, and project bullets
- DO NOT invent fake experience
- DO NOT add skills not implied by the resume
- Use ATS-friendly language and action verbs

Missing Skills:
{missing_skills}

Improvement Suggestions:
{improvements}

Job Description:
{job_description}

Original Resume:
{resume_text}

Return ONLY valid JSON in this exact format:
{{
  "careerObjective": "optimized career objective",
  "experience": [
    "optimized bullet 1",
    "optimized bullet 2"
  ],
  "projects": [
    "optimized project bullet 1",
    "optimized project bullet 2"
  ]
}}
"""
