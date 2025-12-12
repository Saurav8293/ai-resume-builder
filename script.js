const startBtn = document.getElementById('start-btn');
const chatContainer = document.getElementById('chat-container');
const userInput=document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
let resumeData = {};
const questions = [
    {key: "fullName", text: "what is your full name?"},
    {key: "email", text: "what is your email address?"},
    {key: "phone", text:"what is your phone number?"}
];
let currentQuestionIndex=0; // Which question we are currently asking, what question comes next, when the interview is finished

startBtn.addEventListener('click', startResumeBuilder);

function startResumeBuilder(){
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
    if (currentQuestionIndex < questions.length){
        addMessage("AI", questions[currentQuestionIndex].text);
    }else{
        addMessage("AI", "Thank you! I have collected all your details. Generating your resume...")
    }
}

function generateResumeText(){
    return `
    Full Name: ${resumeData.fullName}
    Email: ${resumeData.email}
    Phone: ${resumeData.phone}
    `;
}
