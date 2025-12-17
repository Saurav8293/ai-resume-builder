def build_request_prompt(context: dict) -> str:
    return f'''
You are an expert resume writer AI.

Generate resume content using the information provided below.

INPUT DATA:
- Target Role: {context["targetRole"]}
- Skills: {", ".join(context["skills"])}

PROFESSIONAL EXPERIENCE:
- Company Name: {context["companyName"]}
- Role: {context["companyRole"]}
- Duration: {context["companyDuration"]}

PROJECTS:
Project 1:
- Name: {context["project1Name"]}
- Technologies: {", ".join(context["project1Tech"])}

Project 2:
- Name: {context["project2Name"]}
- Technologies: {", ".join(context["project2Tech"])}

TASKS:
1. Generate ONE professional career objective (2–3 sentences).
2. Generate EXACTLY 2 professional experience bullet points.
3. Generate EXACTLY 2 bullet points for each project.

STRICT RULES:
- Output MUST be valid JSON only
- No explanations
- No headings outside JSON
- No markdown
- No emojis
- Bullet points must be short, impact-focused, ATS-friendly
- Each bullet must start with a strong action verb

OUTPUT FORMAT (STRICT):
{{
  "careerObjective": "string",
  "professionalExperience": [
    "point 1",
    "point 2"
  ],
  "projects": {{
    "project1": [
      "point 1",
      "point 2"
    ],
    "project2": [
      "point 1",
      "point 2"
    ]
  }}
}}
'''