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
    if (!answer)
        return;
    addMessage("You", answer);

    const key = questions[state.currentQuestionIndex].key;
    state.resumeData[key] = answer;

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