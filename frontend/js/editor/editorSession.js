import { populateEditForm } from "./editorForm.js";
import { renderPreview } from "./editorRender.js";
import { state } from "../core/state.js"

export function loadResume() {
    restoreResumeFromSession();
    
    if (!state.baselineResume || !state.resumeData) {
        alert("No Resume found! Please start from chat");
        window.location.href = "/frontend/index.html";
        return;
    }

    populateEditForm();
    renderPreview(state.baselineResume);
}

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