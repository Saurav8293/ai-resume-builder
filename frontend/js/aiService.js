// aiService.js
import { API_ENDPOINTS } from "./config.js";

const BASE_URL = "https://ai-resume-builder-z3ct.onrender.com";

export async function generateRequestToServer(payload) {
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.GENERATE_RESUME_SECTIONS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    // Check if response is OK (status 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Server error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    
    // Check if result exists
    if (!data.result) {
      throw new Error("Invalid response format: missing 'result' field");
    }
    
    return data.result;
    
  } catch (error) {
    console.error("API request failed:", error);
    throw error; // Re-throw so calling code can handle it
  }
}

// export async function generateCareerObjective(payload) {
//   const response = await fetch(`${BASE_URL}/generate-career-objective`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(payload)
//   });

//   const data = await response.json();
//   return data.objective;
// }

// export async function generateResponsibilities(payload){
//     const response = await fetch(`${BASE_URL}/generate-responsibilities`, {
//         method: "POST",
//         headers: {
//             "Content-type": "application/json"
//         },
//         body: JSON.stringify(payload)
//     });

//     const data = await response.json();
//     return data.responsibilities;
// }

// export async function generateProjectDescription(payload) {
//   const response = await fetch(`${BASE_URL}/generate-project-description`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(payload)
//   });

//   const data = await response.json();
//   return data.description;
// }

