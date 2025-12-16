
export const ui = {
    startBtn: document.getElementById('start-btn'),
    chatContainer: document.getElementById('chat-container'),
    userInput: document.getElementById('user-input'),
    sendBtn: document.getElementById('send-btn'),
    downloadBtn: document.getElementById('download-btn'),
    dropdown: document.getElementById('dropdown'),
    searchInput: document.getElementById('search-input'),
    skillsButtonDiv: document.getElementById('skills-buttons'),
    skillsSection: document.getElementById("skills-section"),
    skillsDoneBtn: document.getElementById('skills-done-btn'),
    aiLoader: document.getElementById('ai-loader'),
};
ui.downloadBtn.disabled = true;

export function addMessage(sender, text) {
    const message = document.createElement('p');
    message.textContent = `${sender}: ${text}`;
    ui.chatContainer.appendChild(message);
}

// NOTE: Dropdown listener is in chat.js to avoid duplicate handlers

export function showLoader(show) {
    ui.aiLoader.style.display = show ? "flex" : "none";
}