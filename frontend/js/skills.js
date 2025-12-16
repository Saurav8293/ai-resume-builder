import { askQuestion } from "./chat.js";
import { allSkills, state } from "./state.js";
import { addMessage, ui } from "./ui.js";

export function showUISkills(){
    ui.userInput.style.display="none";
    ui.dropdown.style.display="none";
    ui.sendBtn.style.display="none";
    // searchBtn.style.display="inline-block";
    ui.skillsSection.style.display="block";
    ui.searchInput.style.display = "block";
    renderSkillButtons(allSkills);

}

ui.skillsDoneBtn.addEventListener("click", () =>{
    // Save skills
    state.resumeData.skills=state.selectedSkills;
    // show in chat
    addMessage("User", state.selectedSkills.join(", "));
    // Hide skills UI
    ui.skillsSection.style.display= "none";
    ui.searchInput.style.display = "none";
    // move to the next question
    state.currentQuestionIndex++;
    askQuestion();
});

ui.searchInput.addEventListener("input", () => {
    const query = ui.searchInput.value.toLowerCase();

    const filtered= allSkills.filter(skill =>
        skill.toLowerCase().includes(query)
    );
    renderSkillButtons(filtered);
});

function renderSkillButtons(skillsArray){
    ui.skillsButtonDiv.innerHTML = "";

    skillsArray.forEach(skill =>{
        const btn = document.createElement("button");
        btn.textContent = skill;

        if( state.selectedSkills.includes(skill)){
            btn.classList.add("selected");
        }

        btn.addEventListener("click", () => {
            if (state.selectedSkills.includes(skill)){
                state.selectedSkills = state.selectedSkills.filter(s => s !== skill);
                btn.classList.remove("selected");
            }else{
                state.selectedSkills.push(skill);
                btn.classList.add("selected");
            }
        });

        ui.skillsButtonDiv.appendChild(btn);
    } );
}
