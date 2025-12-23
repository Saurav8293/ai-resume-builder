import { saveResume } from "../core/pdf.js";
import { state } from "../core/state.js"
import { renderPreview } from "./editorRender.js";

function restoreResumeFromSession() {
    const saved = sessionStorage.getItem("baselineResume");

    if (saved) {
        state.baselineResume = JSON.parse(saved);
        console.log("Resume restored from sessionStorage");
    }
}

function loadResume() {
    restoreResumeFromSession();
    console.log("Kya hai bhai isme????",state.baselineResume);
    if (!state.baselineResume) {
        alert("No Resume found! Please Start from chat");
        window.location.href = "/frontend/index.html";
        return;
    }

    renderPreview(state.baselineResume);
}

document.getElementById("download-btn").onclick = () => {
    saveResume();
};

loadResume()