import { ui } from "./ui.js";
import { initChat } from "./chat.js";
import { saveResume } from "./pdf.js";

initChat();

ui.downloadBtn.onclick = saveResume;