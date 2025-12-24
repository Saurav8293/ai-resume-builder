import {state} from "../core/state.js"
export function populateEditForm() {
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