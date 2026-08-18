const contactButton = document.getElementById("contactButton");
const contactMessage = document.getElementById("contactMessage");

let messageVisible = false;

contactButton.addEventListener("click", showContactMessage);

function showContactMessage(){
    if (!messageVisible) {
        contactMessage.textContent = "Du kannst mich über GitHub kontaktieren.";
        contactButton.textContent = "Schließen";
    } else {
        contactMessage.textContent = "";
        contactButton.textContent ="Kontakt";
    }  

    messageVisible = !messageVisible;
}


let skills = loadSkills();


const skillList = document.getElementById("skillsList");

function renderSkills(){
    skillList.innerHTML = "";

    for (const skill of skills) {
        const skillItem = createSkillItem(skill);

        skillList.appendChild(skillItem);
    }
}

function createSkillItem(skill) {
    const skillItem = document.createElement("li");

    const deleteButton = document.createElement("button");

    skillItem.textContent = skill;
    deleteButton.textContent = "Löschen";

    deleteButton.addEventListener("click", function(){
        removeSkill(skill);
    })

    skillItem.appendChild(deleteButton);

    return skillItem;
}

function removeSkill(skillName){
    skills = skills.filter(function (skill) {
        return skill !== skillName;
    });

    saveSkills();
    renderSkills();
}

renderSkills();

const addSkillButton = document.getElementById("addSkillButton");

function addSkill(skillName) {
    const skillExist = skills.some(function (skill){
        return skill.toLowerCase() === skillName.toLowerCase();
    });

    if (skillExist) {
        console.log(`${skillName} ist bereits vorhanden`);
        return false;
    } 

    skills.push(skillName);

    saveSkills();
    renderSkills();

    return true;
}


function saveSkills() {
    localStorage.setItem("skills", JSON.stringify(skills));
}


function loadSkills() {
    const savedSkills = localStorage.getItem("skills");

    if (savedSkills) {
        return JSON.parse(savedSkills);
    }

    return ["HTML", "CSS", "JavaScript", "Bootstrap", "Git"];
}


const skillInput = document.getElementById("skillInput");
const skillForm = document.getElementById("skillForm");
const skillError = document.getElementById("skillError");
const skillSuccess = document.getElementById("skillSuccess");

skillForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newSkill = skillInput.value.trim();


    if (newSkill === ""){
        skillError.textContent = "Bitte gib einen Skill ein.";
        skillSuccess.textContent = "";
        return;
    }

    if (newSkill.length < 2) {
        skillError.textContent = "Der Skill muss mindestens 2 Zeichen lang sein.";
        skillSuccess.textContent = "";
        return;
    }

    const wasAdded = addSkill(newSkill);

    if (wasAdded) {
        skillSuccess.textContent = `${newSkill} wurde erfolgreich hinzugefügt.`; 
        setTimeout(function () {
            skillSuccess.textContent = "";
        }, 3000);
        skillError.textContent = "";

        skillInput.value ="";
    } else {
        skillError.textContent = `${newSkill} ist bereits vorhanden.`;
        skillSuccess.textContent = "";
    }

});


const clearSkillsButton = document.getElementById("clearSkillsButton");

clearSkillsButton.addEventListener("click",function () {
    const confirmed = confirm("Möchtest du wirklich alle Skills löschen?");

    if(confirmed) {
        skills = [];

        saveSkills();
        renderSkills();
    }

});


const projects = [
    {
        title: "HTML",
        finished: true
    },
    {
        title: "CSS",
        finished: true
    },
    {
        title: "REACT",
        finished: false
    }
];

const projectList = document.getElementById("projectList");

for (const project of projects) {
    const projectItem = document.createElement("li");

    if(project.finished){
        projectItem.textContent = `${project.title} - fertig`;

        projectItem.classList.add("finished");
    }else {
        projectItem.textContent = `${project.title} - noch nicht fertig`;

        projectItem.classList.add("unfinished");
    }
    
    projectItem.addEventListener("click", function() {
        projectItem.classList.toggle("selected");

        if(projectItem.classList.contains("selected")) {
            console.log(`${project.title} ist ausgewählt`);
        } else {
            console.log(`${project.title} ist nicht mehr ausgewählt`);
        }
    });

    projectItem.addEventListener("click", function () {
        project.finished = !project.finished;

        if(project.finished) {
            projectItem.textContent = `${project.title} - fertig`;
            projectItem.classList.add("finished");
            projectItem.classList.remove("unfinished");
        } else {
            projectItem.textContent = `${project.title} - noch nicht fertig`;
            projectItem.classList.add("unfinished");
            projectItem.classList.remove("finished");
        }
    });

    projectList.appendChild(projectItem);
}




const testSkills = ["HTML", "CSS", "JavaScript", "React"];

/*const result = testSkills.map((skill) => {
    const upperSkill = skill.toUpperCase();
    return `Skill: ${upperSkill}`;
}); console.log(result);
*/



const longSkills = testSkills.filter(
    (skill) => skill.length > 4
); console.log(longSkills);



const result = testSkills.map(
    skill => `Skill: ${skill}`
); console.log(result);
