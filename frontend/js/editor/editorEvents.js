import { saveResume } from "../core/pdf.js";
import { state } from "../core/state.js"
import { renderPreview } from "./editorRender.js";

export function initEditorEvents() {
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

    document.getElementById("ats-btn").onclick = () => {
        document.getElementById("ats-modal").style.display = "flex";
    };

    document.getElementById("ats-close-btn").onclick = () => {
        document.getElementById("ats-modal").style.display = "none";
    };

    document.getElementById("ats-submit-btn").onclick = async () => {
    const jobDesc = document.getElementById("ats-job-desc").value.trim();

    if (!jobDesc) {
        alert("Please paste a job description");
        return;
    }

    // Get FULL resume text from preview
    const resumeText = document.getElementById("resume-preview").innerText;

    try {
        //  Call ATS backend
        const response = await fetch("http://localhost:5000/api/ats/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                resume: resumeText,
                jobDescription: jobDesc
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "ATS analysis failed");
        }

        //  Show minimal ATS result
        alert(
            `ATS Match Score: ${result.similarity_score}%\n\n` +
            `Missing Skills:\n- ${result.analysis.missing_skills.join("\n- ")}`
        );

    } catch (err) {
        console.error("ATS Error:", err);
        alert("Failed to analyze ATS compatibility");
    }
    };


}



