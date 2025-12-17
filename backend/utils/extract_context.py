
def extract_resume_context(data: dict) -> dict:
    return {
    "companyName" : data.get("expCompany",""),
    "companyRole" : data.get("expRole",""),
    "companyDuration" : data.get("expDuration",""),
    "project1Name" : data.get("project1Name",""),
    "project1Tech" : data.get("project1Tech",[]),
    "project2Name" : data.get("project2Name", ""),
    "project2Tech" : data.get("project2Tech", []),
    "skills" : data.get("skills", []),
    "targetRole" : data.get("role", "")
}


    