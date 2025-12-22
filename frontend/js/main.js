import { ui } from "./chat/ui.js";
import { initChat } from "./chat/chat.js";
import { saveResume } from "./core/pdf.js";

initChat();

ui.downloadBtn.onclick = saveResume;