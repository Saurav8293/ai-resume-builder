import { saveResume } from "../core/pdf.js";
import { state } from "../core/state.js"
export function renderPreview(baselineAIContent) {

    const ai = state.activeVersion === "optimized" && state.optimizedResume ? state.optimizedResume : baselineAIContent;

    if (!ai) {
        console.error("No AI Resume data found");
        return;
    }

    const fullResume = {
        header: {
            name: state.resumeData.fullName,
            email: state.resumeData.email,
            phone: state.resumeData.phone
        },

        careerObjective: ai.careerObjective,

        experience: {
            role: state.resumeData.expRole,
            company: state.resumeData.expCompany,
            city: state.resumeData.expCity,
            duration: state.resumeData.expDuration,
            bullets: ai.professionalExperience || []
        },

        education: [
            {
                title: "Graduation",
                institute: state.resumeData.gradCollege,
                degree: state.resumeData.gradDegree,
                years: state.resumeData.gradYears,
                score: state.resumeData.gradCGPA
            },
            {
                title: "Class XII",
                institute: state.resumeData.class12School,
                years: state.resumeData.class12Years,
                score: state.resumeData.class12Marks
            },
            {
                title: "Class X",
                institute: state.resumeData.class10School,
                years: state.resumeData.class10Years,
                score: state.resumeData.class10Marks
            }
        ],

        projects: [
            {
                name: state.resumeData.project1Name,
                bullets: ai.projects?.project1 || []
            },
            {
                name: state.resumeData.project2Name,
                bullets: ai.projects?.project2 || []
            }
        ],

        skills: state.resumeData.skills || []

    };
    renderToDOM(fullResume);
}

function renderToDOM(resume) {
    const container = document.getElementById("resume-preview");

    container.innerHTML = `
        <h1>${resume.header.name}</h1>
        <p>${resume.header.email} | ${resume.header.phone} </p>

        <hr/>

        <h2>Career Objective</h2>
        <p>${resume.careerObjective}</p>

        <h2>Professional Experience</h2>
        <h3>${resume.experience.role}</h3>
        <p>
            ${resume.experience.company}, ${resume.experience.city}
            <span style="float:right">${resume.experience.duration}</span>
        </p>
        <ul>
            ${resume.experience.bullets && resume.experience.bullets.length > 0 
                ? resume.experience.bullets.map(b => `<li>${b}</li>`).join("") 
                : '<li>No responsibilities available</li>'
            }
        </ul>

        <h2>Education</h2>
        ${resume.education.map(e => `
            <p>
                <strong>${e.title}:</strong> ${e.institute}<br/>
                ${e.degree || ""} ${e.years}
                <span style="float:right">${e.score}</span>
            </p>
            
            `).join("")
        }

        <h2>Projects</h2>
        ${resume.projects.map(p => `
        <h3>${p.name}</h3>
        <ul>
            ${p.bullets && p.bullets.length > 0 
                ? p.bullets.map(b => `<li>${b}</li>`).join("") 
                : '<li>No description available</li>'
            }
        </ul>
        `).join("")}

    <h2>Skills</h2>
    <p>${resume.skills.join(" • ")}</p>
  `;
}


