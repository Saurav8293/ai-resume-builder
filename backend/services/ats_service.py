from ai.llm.gemini_client import GeminiClient
from ai.embeddings.embedding_service import EmbeddingService
import hashlib
from utils.text_utils import normalize_text

class ATSService:
    """
    ATS (Applicant Tracking System) Analyzer.

    Combines:
    - Semantic similarity (embeddings)
    - LLM-based keyword extraction
    - LLM-based improvement analysis
    """

    def __init__(self):
        self.llm = GeminiClient()
        self.embeddings = EmbeddingService()
        self._cache = {}


    def analyze(self, resume_text: str, job_description: str) -> dict:
    #  Normalize inputs
    resume_norm = normalize_text(resume_text)
    jd_norm = normalize_text(job_description)

    #  Cache key (stable + cheap)
    cache_key = hashlib.sha256(
        (resume_norm + jd_norm).encode("utf-8")
    ).hexdigest()

    #  Cache hit
    if cache_key in self._cache:
        return self._cache[cache_key]


    # Extract keywords from Job Description
    keywords = self._extract_keywords(job_description)

    #  Analyze resume vs JD
    analysis = self._analyze_match(
        resume_text,
        job_description,
        keywords
    )
    result = {
    "similarity_score": round(similarity_score * 100, 1),
    "keywords": keywords,
    "analysis": analysis
}

# Cache store
self._cache[cache_key] = result
return result

    return {
        "similarity_score": round(similarity_score * 100, 1),
        "keywords": keywords,
        "analysis": analysis
    }

    def _extract_keywords(self, job_description: str) -> dict:
    """
    Extract required and preferred skills from JD using LLM.
    """
            prompt = f"""
    Extract important keywords from the job description below.

    Return ONLY valid JSON in this format:
    {{
    "required": ["skill1", "skill2"],
    "preferred": ["skill3"],
    "keywords": ["term1", "term2"]
    }}

    Job Description:
    {job_description}
    """
                return self.llm.generate_json(prompt)

    def _analyze_match(
        self,
        resume_text: str,
        job_description: str,
        keywords: dict
    ) -> dict:
        """
        Analyze resume match quality and suggest improvements.
        """
                prompt = f"""
        Analyze the resume against the job description.

        Return ONLY valid JSON:
        {{
        "score": 0-100,
        "missing_skills": ["skill1", "skill2"],
        "improvements": [
            {{
            "section": "Skills / Experience / Projects",
            "suggestion": "Specific improvement suggestion"
            }}
        ]
        }}

        Resume:
        {resume_text[:1500]}

        Job Description:
        {job_description[:1500]}

        Required Skills:
        {keywords.get("required", [])}
        """
                return self.llm.generate_json(prompt)
