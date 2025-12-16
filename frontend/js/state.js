export const state = {
  resumeData: {},
  currentQuestionIndex: 0,
  aiCareerObjective: "",
  aiProjectDescriptions: {
    project1: "",
    project2: ""
  },
  selectedSkills: []
};

export const allSkills=["C", "C++", "Java", "OOPs", "Data Structure", "HTML", "CSS", "JavaScript"];



export const questions = [
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

