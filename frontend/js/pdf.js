import { state } from "./state.js";
import { ui } from "./ui.js";

// saveResume is called from main.js via onclick binding
export function saveResume() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let y = 15; // Vertical Position

    // ==== NAME ====
    pdf.setFontSize(18);
    pdf.setFont(undefined, "bold");
    pdf.text(state.resumeData.fullName || "", 10, y);

    // ==== CONTACT ====
    y += 8;
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    pdf.text(`${state.resumeData.email || ""} | ${state.resumeData.phone || ""}`, 10, y);

    // Adding Horizontal separator lines
    y += 4;
    pdf.line(10, y, 200, y);

    // ==== CAREER OBJECTIVE ====
    y += 12;
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("Career Objective", 10, y);

    y += 6;
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    const objectiveLines = pdf.splitTextToSize(state.aiCareerObjective || "", 190);
    pdf.text(objectiveLines, 10, y);
    y += objectiveLines.length * 6 + 6;
    console.log("AI Objective:", state.aiCareerObjective);

    // ===== EXPERIENCE =====
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("PROFESSIONAL EXPERIENCE", 10, y);

    y += 8;
    pdf.setFontSize(11);
    pdf.setFont(undefined, "bold");
    pdf.text(state.resumeData.expRole || "", 10, y);

    y += 6;
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    pdf.text(
        `${state.resumeData.expCompany || ""}, ${state.resumeData.expCity || ""}`,
        10,
        y
    );

    y += 5;
    pdf.text(state.resumeData.expDuration || "", 10, y);

    // Responsibilities
    y += 6;
    pdf.text(`• Worked on software development and feature implementation`, 12, y);
    y += 6;
    pdf.text(`• Collaborated with team members to deliver quality solutions`, 12, y);

    // ==== SKILLS ====
    y += 14;
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("Skills", 10, y);

    y += 6;
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");

    if (state.resumeData.skills && state.resumeData.skills.length > 0) {
        state.resumeData.skills.forEach(skill => {
            pdf.text(`• ${skill}`, 12, y);
            y += 6;
        });
    }

    // ===== EDUCATION =====
    y += 8;
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("EDUCATION", 10, y);

    y += 8;
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");

    // Graduation
    pdf.text(
        `${state.resumeData.gradDegree || ""}
    ${state.resumeData.gradCollege || ""}
    ${state.resumeData.gradYears || ""} | CGPA: ${state.resumeData.gradCGPA || ""}`,
        12,
        y,
        { lineHeightFactor: 1.5 }
    );

    y += 22;

    // Class XII
    pdf.text(
        `Class XII (Higher Secondary)
    ${state.resumeData.class12School || ""}
    ${state.resumeData.class12Years || ""} | ${state.resumeData.class12Marks || ""}%`,
        12,
        y,
        { lineHeightFactor: 1.5 }
    );

    y += 22;

    // Class X
    pdf.text(
        `Class X (Secondary School)
    ${state.resumeData.class10School || ""}
    ${state.resumeData.class10Years || ""} | ${state.resumeData.class10Marks || ""}%`,
        12,
        y,
        { lineHeightFactor: 1.5 }
    );

    y += 14;

    // ===== PROJECTS =====
    y += 10;
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("PROJECTS", 10, y);

    // Project 1
    y += 8;
    pdf.setFontSize(11);
    pdf.setFont(undefined, "bold");
    pdf.text(state.resumeData.project1Name || "", 10, y);

    y += 6;
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");

    // Use pre-generated AI project description from chat.js
    const project1Desc = state.aiProjectDescriptions.project1 || "";
    const project1Lines = pdf.splitTextToSize(project1Desc, 190);
    pdf.text(project1Lines, 10, y);
    y += project1Lines.length * 6 + 6;
    console.log("Project1 Description:", project1Desc);

    // Second project (if exists)
    if (state.resumeData.project2Name) {
        y += 6;
        pdf.setFontSize(11);
        pdf.setFont(undefined, "bold");
        pdf.text(state.resumeData.project2Name, 10, y);

        y += 6;
        pdf.setFontSize(10);
        pdf.setFont(undefined, "normal");

        const project2Desc = state.aiProjectDescriptions.project2 || "";
        const project2Lines = pdf.splitTextToSize(project2Desc, 190);
        pdf.text(project2Lines, 10, y);
        y += project2Lines.length * 6 + 6;
        console.log("Project2 Description:", project2Desc);
    }

    pdf.save("resume.pdf");
}