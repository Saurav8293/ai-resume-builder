import { ui, addMessage, showLoader } from "./ui.js";
import { state, questions, allResumeData } from "./state.js";
import { generateRequestToServer } from "./aiService.js";
import { showUISkills } from "./skills.js";

export function initChat() {
    ui.startBtn.onclick = start;
    ui.sendBtn.onclick = handleAnswer;
    ui.dropdown.addEventListener("change", handleDropdownChange);
}

function start() {
    console.log("Clicked");
    ui.startBtn.style.display = "none";
    askQuestion();
}

function handleAnswer() {
    const answer = ui.userInput.value.trim();
    const currentQ = questions[state.currentQuestionIndex];

    // Validation logic
    const validation = validateInput(answer, currentQ.key)
    if (!validation.isValid) {
            addMessage("AI", `${validation.message}`);
            return; // Don't proceed if invalid
        }
    
    addMessage("You", answer);
    
    const key = currentQ.key;
    
    // Special handling for comma-separated inputs
    if (key === "project1Tech" || key === "project2Tech") {
        state.resumeData[key] = answer.split(",").map(s => s.trim()).filter(Boolean);
    } else {
        state.resumeData[key] = answer;
    }

    ui.userInput.value = "";
    state.currentQuestionIndex++;
    askQuestion();
}
export async function askQuestion() {
    if (questions.length <= state.currentQuestionIndex) {
        addMessage("AI", "Thank you! I have collected all your details.")
        showLoader(true);
        ui.userInput.style.display = "none";
        ui.sendBtn.style.display = "none";

        state.responseFromServer = await generateRequestToServer(
            allResumeData()
        );
        console.log("what is present in responseFromServer?=> ", state.responseFromServer);
        state.aiCareerObjective = state.responseFromServer.careerObjective;
        state.aiResponsibilities = Array.isArray(state.responseFromServer.professionalExperience)
            ? state.responseFromServer.professionalExperience.map(point => `• ${point}`).join('\n')
            : state.responseFromServer.professionalExperience || "";
        
        const projects = state.responseFromServer.projects || {};
        
        // Convert project arrays to strings
        state.aiProjectDescriptions.project1 = Array.isArray(projects.project1)
            ? projects.project1.map(point => `• ${point}`).join('\n')
            : projects.project1 || "";
            
        state.aiProjectDescriptions.project2 = Array.isArray(projects.project2)
            ? projects.project2.map(point => `• ${point}`).join('\n')
            : projects.project2 || "";
        console.log("Converted project1:", state.aiProjectDescriptions.project1);
        console.log("Converted project2:", state.aiProjectDescriptions.project2);
        showLoader(false);
        addMessage("AI", "Resume ready! Click the button below to download.");

        // Show download button and hide input controls
        ui.downloadBtn.style.display = "inline-block";
        ui.downloadBtn.disabled = false;
        ui.userInput.style.display = "none";
        ui.sendBtn.style.display = "none";
        return;
    }
    const currentQ = questions[state.currentQuestionIndex];
    if (currentQ.type == "dropdown") {
        // Hide text input, show dropdown
        ui.userInput.style.display = "none";
        ui.sendBtn.style.display = "none";
        ui.dropdown.style.display = "block";

        // clear previous dropdown options
        ui.dropdown.innerHTML = "";

        // Add options dynamically
        currentQ.options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option;
            ui.dropdown.appendChild(opt);
        });
    } else {
        // Normal text question
        ui.dropdown.style.display = "none";
        ui.userInput.style.display = "inline-block";
        ui.sendBtn.style.display = "inline-block";
    }
    if (currentQ.key === "skills") {
        console.log("Is it working");
        showUISkills();
    }
    addMessage("AI", currentQ.text);
}

function handleDropdownChange() {
    const answer = ui.dropdown.value;

    addMessage("You", answer);

    const key = questions[state.currentQuestionIndex].key;
    state.resumeData[key] = answer;

    state.currentQuestionIndex++;

    askQuestion();
}

// Validation function banao
function validateInput(value, key) {
    // Empty check
    if (!value || value.length === 0) {
        return { isValid: false, message: "Please enter a value, it cannot be empty!" };
    }
    
    // Email validation
    if (key === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return { isValid: false, message: "Please enter a valid email address (e.g., name@example.com)" };
        }
    }
    
    // Phone validation
    if (key === "phone") {
        const phoneRegex = /^[6-9]\d{9}$/; // Indian 10-digit mobile
        if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
            return { isValid: false, message: "Please enter a valid 10-digit phone number" };
        }
    }
    
    // Name validation
    if (key === "fullName") {
        if (value.length < 3) {
            return { isValid: false, message: "Name should be at least 3 characters long" };
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            return { isValid: false, message: "Name should contain only letters and spaces" };
        }
    }
    
    // Percentage validation
    if (key === "class10Marks" || key === "class12Marks") {
        const marks = parseFloat(value);
        if (isNaN(marks) || marks < 0 || marks > 100) {
            return { isValid: false, message: "Please enter a valid percentage between 0 and 100" };
        }
    }
    
    // CGPA validation
    if (key === "gradCGPA") {
        const cgpa = parseFloat(value);
        if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
            return { isValid: false, message: "Please enter a valid CGPA between 0 and 10" };
        }
    }
    
    // Year validation (e.g-  "2020-2024")
    if (key.includes("Years") || key.includes("Duration")) {
        if (value.length < 4) {
            return { isValid: false, message: "Please enter a valid duration (e.g., 2020-2024)" };
        }
    }
    
    return { isValid: true };
}