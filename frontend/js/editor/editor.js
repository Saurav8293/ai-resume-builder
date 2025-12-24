import { saveResume } from "../core/pdf.js";
import { state } from "../core/state.js"
import { renderPreview } from "./editorRender.js";

function restoreResumeFromSession() {
    const savedResumeData = sessionStorage.getItem("resumeData");
    const savedBaseline = sessionStorage.getItem("baselineResume");
    const savedAIContent = sessionStorage.getItem("aiContent");

    if (savedResumeData) {
        state.resumeData = JSON.parse(savedResumeData);
        console.log("resumeData restored:", state.resumeData);
    }

    if (savedBaseline) {
        state.baselineResume = JSON.parse(savedBaseline);
        console.log("baselineResume restored:", state.baselineResume);
    }

    if (savedAIContent) {
        const ai = JSON.parse(savedAIContent);
        state.aiCareerObjective = ai.aiCareerObjective;
        state.aiResponsibilities = ai.aiResponsibilities;
        state.aiProjectDescriptions = ai.aiProjectDescriptions;
        console.log("AI content restored");
    }
}

function populateEditForm() {
    // Fill all edit fields with current data
    document.getElementById("edit-fullName").value = state.resumeData.fullName || "";
    document.getElementById("edit-email").value = state.resumeData.email || "";
    document.getElementById("edit-phone").value = state.resumeData.phone || "";
    document.getElementById("edit-expRole").value = state.resumeData.expRole || "";
    document.getElementById("edit-expCompany").value = state.resumeData.expCompany || "";
    document.getElementById("edit-expCity").value = state.resumeData.expCity || "";
    document.getElementById("edit-expDuration").value = state.resumeData.expDuration || "";
    document.getElementById("edit-gradCollege").value = state.resumeData.gradCollege || "";
    document.getElementById("edit-gradDegree").value = state.resumeData.gradDegree || "";
    document.getElementById("edit-gradYears").value = state.resumeData.gradYears || "";
    document.getElementById("edit-gradCGPA").value = state.resumeData.gradCGPA || "";
    document.getElementById("edit-project1Name").value = state.resumeData.project1Name || "";
    document.getElementById("edit-project2Name").value = state.resumeData.project2Name || "";
    document.getElementById("edit-skills").value = (state.resumeData.skills || []).join(", ");
}

function loadResume() {
    restoreResumeFromSession();
    
    if (!state.baselineResume || !state.resumeData) {
        alert("No Resume found! Please start from chat");
        window.location.href = "/frontend/index.html";
        return;
    }

    populateEditForm();
    renderPreview(state.baselineResume);
}

// Update preview when user edits
document.getElementById("update-preview-btn").onclick = () => {
    // Update state with edited values
    state.resumeData.fullName = document.getElementById("edit-fullName").value;
    state.resumeData.email = document.getElementById("edit-email").value;
    state.resumeData.phone = document.getElementById("edit-phone").value;
    state.resumeData.expRole = document.getElementById("edit-expRole").value;
    state.resumeData.expCompany = document.getElementById("edit-expCompany").value;
    state.resumeData.expCity = document.getElementById("edit-expCity").value;
    state.resumeData.expDuration = document.getElementById("edit-expDuration").value;
    state.resumeData.gradCollege = document.getElementById("edit-gradCollege").value;
    state.resumeData.gradDegree = document.getElementById("edit-gradDegree").value;
    state.resumeData.gradYears = document.getElementById("edit-gradYears").value;
    state.resumeData.gradCGPA = document.getElementById("edit-gradCGPA").value;
    state.resumeData.project1Name = document.getElementById("edit-project1Name").value;
    state.resumeData.project2Name = document.getElementById("edit-project2Name").value;
    state.resumeData.skills = document.getElementById("edit-skills").value
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

    // Save updated data
    sessionStorage.setItem("resumeData", JSON.stringify(state.resumeData));
    
    // Re-render preview
    renderPreview(state.baselineResume);
    
    alert("✓ Preview updated!");
};

document.getElementById("download-btn").onclick = () => {
    saveResume();
};

loadResume()