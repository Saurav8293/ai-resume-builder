const startBtn = document.getElementById('start-btn');
const chatContainer = document.getElementById('chat-container');
const userInput=document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const downloadBtn= document.getElementById('download-btn');
const dropdown = document.getElementById('dropdown');
const searchInput= document.getElementById('search-input');
const skillsButtonDiv= document.getElementById('skills-buttons');
const skillsSection= document.getElementById("skills-section");
const skillsDoneBtn= document.getElementById('skills-done-btn');

let resumeData = {};
const questions = [
    {key: "fullName", text: "what is your full name?"},
    {key: "email", text: "what is your email address?"},
    {key: "phone", text:"what is your phone number?"},
    {key: "qualification1", text: "Select your Class X percentage", type:"dropdown", options: ["50-60%", "60-70%", "70-80%", "80-90%", "90-100%"]},
    {key: "qualification2", text: "Select your Class XII percentage", type:"dropdown", options: ["50-60%", "60-70%", "70-80%", "80-90%", "90-100%"]},
    {key: "qualification3", text: "Select your Graduation marks in CGPA", type:"dropdown", options: ["5-6 CGPA", "6-7 CGPA", "7-8 CGPA", "8-9 CGPA", "9-10 CGPA"]},
    {key: "experience", text: "How much experience do you have", type:"dropdown", options: ["0-2 years", "3 years", "4 years", "more than 5 years"]},
    {key: "skills", text: "Select the Skills you have"},
    {key: "role", text: "You are looking for which role?"}
];
let currentQuestionIndex=0; // Which question we are currently asking, what question comes next, when the interview is finished

const allSkills=["C", "C++", "Java", "OOPs", "Data Structure", "HTML", "CSS", "JavaScript"];
let selectedSkills=[];

startBtn.addEventListener('click', startResumeBuilder);

function startResumeBuilder(){
    startBtn.style.display = "none" ;
    askNextQuestion();
}

function addMessage(sender, text){
    const message = document.createElement('p');
    message.textContent= `${sender}: ${text}`;
    chatContainer.appendChild(message);
}

sendBtn.addEventListener('click', handleUserResponse);

function handleUserResponse(){
    const answer = userInput.value;
    addMessage("User", answer);
    userInput.value="";
    resumeData[questions[currentQuestionIndex].key]= answer;
    currentQuestionIndex++;
    askNextQuestion();
}

function askNextQuestion(){
    if(questions.length <= currentQuestionIndex ){
        addMessage("AI", "Thank you! I have collected all your details. Generating your resume...")
        const resumeText=generateResumeText();
        // addMessage("AI", resumeText);
        userInput.style.display="none";
        sendBtn.style.display="none";
        downloadBtn.style.display="block";
        return;
    }
    const currentQ= questions[currentQuestionIndex];
    if(currentQ.type == "dropdown"){
        // Hide text input, show dropdown
        userInput.style.display = "none";
        sendBtn.style.display = "none";
        dropdown.style.display= "block";

        // clear previous dropdown options
        dropdown.innerHTML = "";

        // Add options dynamically
        currentQ.options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option;
            dropdown.appendChild(opt);
        });
    }else{
        // Normal text question
        dropdown.style.display = "none";
        userInput.style.display = "inline-block";
        sendBtn.style.display = "inline-block";
    }
    console.log("Tell me the value of currentQ.key? ", currentQ.key);
    console.log("The value of current question index?", currentQuestionIndex);
    if(currentQ.key === "skills"){
        console.log("Is it working");
        showUISkills();
    }
    addMessage("AI", questions[currentQuestionIndex].text);
}

function generateResumeText(){
    return `
==== Personal Details ====
Full Name: ${resumeData.fullName}
Email: ${resumeData.email}
Phone: ${resumeData.phone}

==== Qualifications ====
Class X: ${resumeData.qualification1}
Class XII: ${resumeData.qualification2}
Graduation: ${resumeData.qualification3}

==== Experience ====
Experience: ${resumeData.experience}

==== Skills ====
skills: ${resumeData.skills}

==== Desired Role ====
Role: ${resumeData.role}
`;
}


downloadBtn.addEventListener('click', saveResume);

function saveResume(){
    const {jsPDF} = window.jspdf; //window.jspdf is the jsPDF library already loaded from CDN (script tag). // This line is using destructuring to extract the jsPDF class from the library.
    const pdf=new jsPDF();

    const resumeText= generateResumeText();
    const lines = resumeText.split("\n")// .split("\n") cuts the resume into an array of lines.Because jsPDF text() can print an array of text lines automatically, each on a new line.

    pdf.text(lines, 10, 10);
    pdf.save("resume.pdf");
}

function generateCareerObjective() {
    return ` 
        Hi I am recenty graduated in I am actively looking for 
        ${resumeData.role} role as I have ${resumeData.experience} years of experience in this field
    `;
}


dropdown.addEventListener("change", function (){
    const answer = dropdown.value;

    // show selected answer in chat
    addMessage("User", answer);

    // store the answer
    resumeData[questions[currentQuestionIndex].key]= answer;

    // move to the next question
    currentQuestionIndex++; 

    // Ask the next question
    askNextQuestion();
});

function showUISkills(){
    userInput.style.display="none";
    dropdown.style.display="none";
    sendBtn.style.display="none";
    // searchBtn.style.display="inline-block";
    skillsSection.style.display="block";
    searchInput.style.display = "block";
    renderSkillButtons(allSkills);

}

skillsDoneBtn.addEventListener("click", () =>{
    // Save skills
    resumeData.skills=selectedSkills;
    // show in chat
    addMessage("User", selectedSkills.join(", "));
    // Hide skills UI
    skillsSection.style.display= "none";
    searchInput.style.display = "none";
    // move to the next question
    currentQuestionIndex++;
    askNextQuestion();
});

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    const filtered= allSkills.filter(skill =>
        skill.toLowerCase().includes(query)
    );
    renderSkillButtons(filtered);
});

function renderSkillButtons(skillsArray){
    skillsButtonDiv.innerHTML = "";

    skillsArray.forEach(skill =>{
        const btn = document.createElement("button");
        btn.textContent = skill;

        if( selectedSkills.includes(skill)){
            btn.classList.add("selected");
        }

        btn.addEventListener("click", () => {
            if (selectedSkills.includes(skill)){
                selectedSkills = selectedSkills.filter(s => s !== skill);
                btn.classList.remove("selected");
            }else{
                selectedSkills.push(skill);
                btn.classList.add("selected");
            }
        });

        skillsButtonDiv.appendChild(btn);
    } );
}