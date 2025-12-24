import { initEditorEvents } from "./editorEvents.js";
import { loadResume } from "./editorSession.js";


export function initEditor() {
    loadResume();
    initEditorEvents()
}


initEditor();
