import { state } from "./state.js";

export function saveResume() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - (margin * 2);
    const bottomMargin = 20; // Reserve space at bottom
    
    let y = margin;
    
    // Helper: Calculate text height
    function getTextHeight(text, fontSize, indent = 0) {
        if (!text) return 0;
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth - indent);
        return lines.length * fontSize * 0.45;
    }
    
    // Helper: Check if content fits on current page
    function canFitOnPage(requiredHeight) {
        return (y + requiredHeight) <= (pageHeight - bottomMargin);
    }
    
    // Helper: Add new page if needed
    function checkPageBreak(requiredHeight) {
        if (!canFitOnPage(requiredHeight)) {
            pdf.addPage();
            y = margin;
            return true;
        }
        return false;
    }
    
    // Helper: Add text
    function addText(text, fontSize = 10, fontStyle = "normal", indent = 0) {
        if (!text) return;
        
        pdf.setFontSize(fontSize);
        pdf.setFont(undefined, fontStyle);
        
        const lines = pdf.splitTextToSize(text, maxWidth - indent);
        const lineHeight = fontSize * 0.45;
        
        pdf.text(lines, margin + indent, y);
        y += lines.length * lineHeight;
    }
    
    function addSpace(amount = 5) {
        y += amount;
    }
    
    // Helper: Add section with heading (keeps heading + content together)
    function addSection(heading, contentHeight, renderContent) {
        const headingHeight = 15; // Heading + underline + spacing
        const totalHeight = headingHeight + contentHeight;
        
        // If section doesn't fit, move to next page
        checkPageBreak(totalHeight);
        
        // Add section heading
        addSpace(8);
        pdf.setFontSize(12);
        pdf.setFont(undefined, "bold");
        pdf.text(heading.toUpperCase(), margin, y);
        y += 6;
        
        pdf.setLineWidth(0.5);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 8;
        
        // Render section content
        renderContent();
    }
    
    // ===== HEADER =====
    pdf.setFontSize(20);
    pdf.setFont(undefined, "bold");
    pdf.text(state.resumeData.fullName || "YOUR NAME", margin, y);
    y += 8;
    
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    const contactInfo = `${state.resumeData.email || ""} | ${state.resumeData.phone || ""}`;
    pdf.text(contactInfo, margin, y);
    y += 4;
    
    pdf.line(margin, y, pageWidth - margin, y);
    y += 2;
    
    // ===== CAREER OBJECTIVE =====
    const objectiveHeight = getTextHeight(state.aiCareerObjective, 10) + 20;
    addSection("Career Objective", objectiveHeight, () => {
        addText(state.aiCareerObjective, 10, "normal");
    });
    
    // ===== PROFESSIONAL EXPERIENCE =====
    const expContentHeight = 
        12 + // Role
        8 +  // Company & duration
        getTextHeight(state.aiResponsibilities, 10) + 
        10;
    
    addSection("Professional Experience", expContentHeight, () => {
        addText(state.resumeData.expRole, 11, "bold");
        addSpace(4);
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, "italic");
        pdf.text(`${state.resumeData.expCompany || ""}, ${state.resumeData.expCity || ""}`, margin, y);
        
        const durationText = state.resumeData.expDuration || "";
        const durationWidth = pdf.getTextWidth(durationText);
        pdf.text(durationText, pageWidth - margin - durationWidth, y);
        y += 7;
        
        if (state.aiResponsibilities) {
            addText(state.aiResponsibilities, 10, "normal");
        }
    });
    
    // ===== EDUCATION =====
    const educationHeight = 
        (12 + 6 + 8) * 3; // 3 education entries (degree, school, years)
    
    addSection("Education", educationHeight, () => {
        // Graduation
        addText(state.resumeData.gradDegree, 11, "bold");
        addSpace(3);
        addText(state.resumeData.gradCollege, 10, "normal");
        addSpace(3);
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, "italic");
        pdf.text(state.resumeData.gradYears || "", margin, y);
        
        const cgpaText = `CGPA: ${state.resumeData.gradCGPA || ""}`;
        const cgpaWidth = pdf.getTextWidth(cgpaText);
        pdf.text(cgpaText, pageWidth - margin - cgpaWidth, y);
        y += 10;
        
        // Class XII
        addText("Class XII (Higher Secondary)", 10, "bold");
        addSpace(3);
        addText(state.resumeData.class12School, 10, "normal");
        addSpace(3);
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, "italic");
        pdf.text(state.resumeData.class12Years || "", margin, y);
        
        const marks12Text = `${state.resumeData.class12Marks || ""}%`;
        const marks12Width = pdf.getTextWidth(marks12Text);
        pdf.text(marks12Text, pageWidth - margin - marks12Width, y);
        y += 10;
        
        // Class X
        addText("Class X (Secondary School)", 10, "bold");
        addSpace(3);
        addText(state.resumeData.class10School, 10, "normal");
        addSpace(3);
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, "italic");
        pdf.text(state.resumeData.class10Years || "", margin, y);
        
        const marks10Text = `${state.resumeData.class10Marks || ""}%`;
        const marks10Width = pdf.getTextWidth(marks10Text);
        pdf.text(marks10Text, pageWidth - margin - marks10Width, y);
        y += 6;
    });
    
    // ===== SKILLS =====
    const skillsText = state.resumeData.skills?.join("  •  ") || "";
    const skillsHeight = getTextHeight(skillsText, 10) + 10;
    
    addSection("Skills", skillsHeight, () => {
        if (state.resumeData.skills && state.resumeData.skills.length > 0) {
            addText(skillsText, 10, "normal");
        }
    });
    
    // ===== PROJECTS =====
    const project1Height = 
        12 + // Project name
        getTextHeight(state.aiProjectDescriptions.project1, 10) + 
        15;
    
    const project2Height = state.resumeData.project2Name ? 
        12 + getTextHeight(state.aiProjectDescriptions.project2, 10) + 15 : 0;
    
    const totalProjectsHeight = project1Height + project2Height;
    
    addSection("Projects", totalProjectsHeight, () => {
        // Project 1
        addText(state.resumeData.project1Name, 11, "bold");
        addSpace(5);
        
        if (state.aiProjectDescriptions.project1) {
            addText(state.aiProjectDescriptions.project1, 10, "normal");
        }
        
        // Project 2 (if exists)
        if (state.resumeData.project2Name) {
            addSpace(10);
            addText(state.resumeData.project2Name, 11, "bold");
            addSpace(5);
            
            if (state.aiProjectDescriptions.project2) {
                addText(state.aiProjectDescriptions.project2, 10, "normal");
            }
        }
    });
    
    // Footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    }
    
    pdf.save("resume.pdf");
}