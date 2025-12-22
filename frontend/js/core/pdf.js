import { state } from "./state.js";

export function saveResume() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12;  // Reduced from 15
    const maxWidth = pageWidth - (margin * 2);
    const bottomMargin = 12;
    
    let y = margin;
    
    // Check if we need a new page
    function checkSpace(needed) {
        if (y + needed > pageHeight - bottomMargin) {
            pdf.addPage();
            y = margin;
            return true;
        }
        return false;
    }
    
    // Add text with wrapping
    function addText(text, fontSize = 10, fontStyle = "normal", indent = 0) {
        if (!text) return;
        
        pdf.setFontSize(fontSize);
        pdf.setFont(undefined, fontStyle);
        
        const lines = pdf.splitTextToSize(text, maxWidth - indent);
        const lineHeight = fontSize * 0.4;  // Tighter line height
        
        for (let line of lines) {
            checkSpace(lineHeight + 2);
            pdf.text(line, margin + indent, y);
            y += lineHeight;
        }
    }
    
    function addSpace(amount) {
        y += amount;
    }
    
    // Add section heading
    function addSectionHeading(heading) {
        checkSpace(12);
        addSpace(5);
        
        pdf.setFontSize(11);
        pdf.setFont(undefined, "bold");
        pdf.text(heading.toUpperCase(), margin, y);
        y += 5;
        
        pdf.setLineWidth(0.3);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 4;
    }
    
    // ===== HEADER =====
    pdf.setFontSize(22);
    pdf.setFont(undefined, "bold");
    pdf.text(state.resumeData.fullName || "YOUR NAME", margin, y);
    y += 7;
    
    pdf.setFontSize(9);
    pdf.setFont(undefined, "normal");
    pdf.text(`${state.resumeData.email || ""} | ${state.resumeData.phone || ""}`, margin, y);
    y += 4;
    
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 2;
    
    // ===== CAREER OBJECTIVE =====
    if (state.aiCareerObjective) {
        addSectionHeading("Career Objective");
        addText(state.aiCareerObjective, 9.5);
        addSpace(5);
    }
    
    // ===== PROFESSIONAL EXPERIENCE =====
    if (state.resumeData.expRole) {
        addSectionHeading("Professional Experience");
        
        checkSpace(18);
        addText(state.resumeData.expRole, 10, "bold");
        addSpace(3);
        
        pdf.setFontSize(9);
        pdf.setFont(undefined, "italic");
        const companyLine = `${state.resumeData.expCompany || ""}, ${state.resumeData.expCity || ""}`;
        pdf.text(companyLine, margin, y);
        
        const duration = state.resumeData.expDuration || "";
        const durWidth = pdf.getTextWidth(duration);
        pdf.text(duration, pageWidth - margin - durWidth, y);
        y += 6;
        
        if (state.aiResponsibilities) {
            addText(state.aiResponsibilities, 9.5);
        }
        addSpace(5);
    }
    
    // ===== EDUCATION =====
    addSectionHeading("Education");
    
    function addEducationEntry(degree, school, years, marks) {
        if (!degree && !school) return;
        
        checkSpace(20);
        
        if (degree) {
            addText(degree, 10, "bold");
            addSpace(2);
        }
        
        if (school) {
            addText(school, 9.5);
            addSpace(2);
        }
        
        if (years || marks) {
            pdf.setFontSize(9);
            pdf.setFont(undefined, "italic");
            pdf.text(years || "", margin, y);
            
            const marksWidth = pdf.getTextWidth(marks || "");
            pdf.text(marks || "", pageWidth - margin - marksWidth, y);
            y += 6;
        }
    }
    
    // Graduation
    addEducationEntry(
        state.resumeData.gradDegree,
        state.resumeData.gradCollege,
        state.resumeData.gradYears,
        `CGPA: ${state.resumeData.gradCGPA || ""}`
    );
    
    // Class XII
    addEducationEntry(
        "Class XII (Higher Secondary)",
        state.resumeData.class12School,
        state.resumeData.class12Years,
        `${state.resumeData.class12Marks}%`
    );
    
    // Class X
    addEducationEntry(
        "Class X (Secondary School)",
        state.resumeData.class10School,
        state.resumeData.class10Years,
        `${state.resumeData.class10Marks}%`
    );
    
    addSpace(2);
    
    // ===== SKILLS =====
    if (state.resumeData.skills && state.resumeData.skills.length > 0) {
        addSectionHeading("Skills");
        const skillsText = state.resumeData.skills.join("  •  ");
        addText(skillsText, 9.5);
        addSpace(5);
    }
    
    // ===== PROJECTS =====
    if (state.resumeData.project1Name || state.resumeData.project2Name) {
        addSectionHeading("Projects");
        
        // Project 1
        if (state.resumeData.project1Name) {
            checkSpace(12);
            addText(state.resumeData.project1Name, 10, "bold");
            addSpace(3);
            
            if (state.aiProjectDescriptions.project1) {
                addText(state.aiProjectDescriptions.project1, 9.5);
            }
            addSpace(6);
        }
        
        // Project 2
        if (state.resumeData.project2Name) {
            checkSpace(12);
            addText(state.resumeData.project2Name, 10, "bold");
            addSpace(3);
            
            if (state.aiProjectDescriptions.project2) {
                addText(state.aiProjectDescriptions.project2, 9.5);
            }
        }
    }
    
    // Footer (only if multiple pages)
    const totalPages = pdf.internal.getNumberOfPages();
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(150);
            pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 7, { align: "center" });
        }
    }
    
    pdf.save("resume.pdf");
}