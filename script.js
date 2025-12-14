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
   // ----- Education: Class X -----
{ key: "class10School", text: "Enter your Class X school name" },
{ key: "class10Years", text: "Enter Class X study period (e.g., 2017-2018)" },
{ key: "class10Marks", text: "Enter Class X percentage" },

// ----- Education: Class XII -----
{ key: "class12School", text: "Enter your Class XII school/college name" },
{ key: "class12Years", text: "Enter Class XII study period (e.g., 2019-2020)" },
{ key: "class12Marks", text: "Enter Class XII percentage" },

// ----- Graduation -----
{ key: "gradCollege", text: "Enter your graduation college name" },
{ key: "gradDegree", text: "Enter your degree (e.g., B.Tech CSE)" },
{ key: "gradYears", text: "Enter graduation period (e.g., 2020-2024)" },
{ key: "gradCGPA", text: "Enter your graduation CGPA" },

   // ----- Experience -----
{ key: "expCompany", text: "Enter the company name you worked at" },
{ key: "expRole", text: "Enter your job role / designation" },
{ key: "expCity", text: "Enter the city where you worked" },
{ key: "expDuration", text: "Enter employment duration (e.g., Jan 2021 - Mar 2024)" },
    // ----- Projects -----
    { key: "project1Name", text: "Enter your first project name" },
    { key: "project1Tech", text: "Enter technologies used (comma separated)" },

    { key: "project2Name", text: "Enter your second project name" },
    { key: "project2Tech", text: "Enter technologies used (comma separated)" },

// ---- Skills ----
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
        // const resumeText=generateResumeText();
        // addMessage("AI", resumeText);
        userInput.style.display="none";
        sendBtn.style.display="none";
        downloadBtn.style.display="block";
        testCareerObjectiveEndpoint();
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

downloadBtn.addEventListener('click', saveResume);

function saveResume(){
    const {jsPDF} = window.jspdf; //window.jspdf is the jsPDF library already loaded from CDN (script tag). // This line is using destructuring to extract the jsPDF class from the library.
    const pdf=new jsPDF();

    let y=15; // Vertical Position

    // ==== NAME ====
    pdf.setFontSize(18);
    pdf.setFont(undefined, "bold");
    pdf.text(resumeData.fullName || "", 10, y);

    // ==== CONTACT ====
    y += 8;
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    pdf.text(`${resumeData.email || ""} | ${resumeData.phone || ""}`, 10, y);

    // Adding Horizontal seperator lines
    y += 4;
    pdf.line(10, y, 200, y);

    // ==== CAREER OBJECTIVE ====
    y += 12;
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("Career Objective", 10, y);

    y +=6;
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    pdf.text(generateCareerObjective(), 10, y, { maxWidth: 190, lineHeightFactor: 1.5});// lineHeightFactor will increases vertical spacing

 // ===== EXPERIENCE =====
    y += 14;
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("PROFESSIONAL EXPERIENCE", 10, y);

    y += 8;
    pdf.setFontSize(11);
    pdf.setFont(undefined, "bold");
    pdf.text(resumeData.expRole || "", 10, y);

    y += 6;
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    pdf.text(
    `${resumeData.expCompany || ""}, ${resumeData.expCity || ""}`,
    10,
    y
    );

    y += 5;
    pdf.text(resumeData.expDuration || "", 10, y);

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
    
    resumeData.skills.forEach(skill =>{
        pdf.text(`. ${skill}`, 12, y);
        y += 6;
    });
   

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
    `${resumeData.gradDegree}
    ${resumeData.gradCollege}
    ${resumeData.gradYears} | CGPA: ${resumeData.gradCGPA}`,
    12,
    y,
    { lineHeightFactor: 1.5 }
    );

    y += 22;

    // Class XII
    pdf.text(
    `Class XII (Higher Secondary)
    ${resumeData.class12School}
    ${resumeData.class12Years} | ${resumeData.class12Marks}%`,
    12,
    y,
    { lineHeightFactor: 1.5 }
    );

    y += 22;

    // Class X
    pdf.text(
    `Class X (Secondary School)
    ${resumeData.class10School}
    ${resumeData.class10Years} | ${resumeData.class10Marks}%`,
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

    y += 8;
    pdf.setFontSize(11);
    pdf.setFont(undefined, "bold");
    pdf.text(resumeData.project1Name || "", 10, y);

    y += 6;
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");

    const project1Points = generateProjectDescription(
        resumeData.project1Name,
        resumeData.project1Tech
    );

    project1Points.forEach(point => {
        pdf.text(point, 12, y);
        y += 6;
    });

    // Second project (if exists)
    if (resumeData.project2Name) {
        y += 6;
        pdf.setFontSize(11);
        pdf.setFont(undefined, "bold");
        pdf.text(resumeData.project2Name, 10, y);

        y += 6;
        pdf.setFontSize(10);
        pdf.setFont(undefined, "normal");

        const project2Points = generateProjectDescription(
            resumeData.project2Name,
            resumeData.project2Tech
        );

        project2Points.forEach(point => {
            pdf.text(point, 12, y);
            y += 6;
        });
    }


    pdf.save("resume.pdf");
}

function generateCareerObjective() {
    const role = resumeData.role || "";
    const skills = (resumeData.skills || []).slice(0,3).join(", ");
    const duration = resumeData.expDuration || "";

    const isFresher = duration.toLowerCase().includes("fresher") || duration.includes("0");

    if (isFresher) {
        return `Motivated and enthusiastic candidate with strong skills in ${skills}, seeking an entry-level ${role} role to apply technical knowledge and grow professionally in a dynamic organization.`;
    } else {
        return `Results-driven ${role} with professional experience at ${resumeData.expCompany}, specializing in ${skills}, and aiming to contribute to high-impact projects and scalable solutions.`;
    }
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

function generateProjectDescription(projectName, techStack) {
    return [
        `• Developed ${projectName} using ${techStack}`,
        `• Designed and implemented core features with focus on performance and usability`,
        `• Applied best practices in coding and system design`
    ];
}


// async function testBackendConnection() {
//     try{
//         const response = await fetch("http://localhost:5000/test-api");
//         const data = await response.json();
//         addMessage("AI", "Backend says: " + data.message);
//     } catch (error){
//         addMessage("AI", "Backend connection failed");
//         console.error(error);
//     }
// }

async function testCareerObjectiveEndpoint(){
    try{
        const response = await fetch("http://localhost:5000/generate-career-objective",
            { 
                method : ["POST"],
                headers : {
                    "content-type" : "apllication/json"
                },
                body : JSON.stringify({
                    role: resumeData.role
                })
            
            });
        const text = await response.text();
        addMessage("AI","Backend Respose: "+ text)
    } catch(error){
        addMessage("AI", "Failed to reach backend");
        console.error(error)
    }
}