// aiService.js
const BASE_URL = "http://localhost:5000";

export async function generateCareerObjective(payload) {
  const response = await fetch(`${BASE_URL}/generate-career-objective`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return data.objective;
}

export async function generateResponsibilities(payload){
    const response = await fetch(`${BASE_URL}/generate-responsibilities`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data.responsibilities;
}

export async function generateProjectDescription(payload) {
  const response = await fetch(`${BASE_URL}/generate-project-description`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return data.description;
}

