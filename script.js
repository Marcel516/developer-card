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



const savedSkills = localStorage.getItem("skills");

let skills;

if(savedSkills) {
    skills = JSON.parse(savedSkills);
} else {
    skills = ["HTML", "CSS", "JavaScript", "Bootstrap", "Git"];
}

const skillList = document.getElementById("skillsList");

function renderSkills(){
    skillList.innerHTML = "";

    for (const skill of skills) {
        const skillItem = document.createElement("li");

        skillItem.textContent = skill;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Löschen";

        deleteButton.addEventListener("click", function() {
            removeSkill(skill);
        })

        skillItem.appendChild(deleteButton);
        skillList.appendChild(skillItem);
        
    }
}

function removeSkill(skillName){
    skills = skills.filter(function (skill) {
        return skill !== skillName;
    });

    localStorage.setItem("skills", JSON.stringify(skills));

    renderSkills();
}

renderSkills();

const addSkillButton = document.getElementById("addSkillButton");

function addSkill(skillName) {
    if (!skills.includes(skillName)) {
        skills.push(skillName);

        localStorage.setItem("skills", JSON.stringify(skills));

        renderSkills();

        return true;
    } else {
        console.log(`${skillName} ist bereits vorhanden`);
        return false;
    }
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

        localStorage.setItem("skills", JSON.stringify(skills));

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