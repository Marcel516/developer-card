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



const skills = ["HTML", "CSS", "JavaScript", "Bootstrap"];

skills.push("Git");

const skillList = document.getElementById("skillsList");

for (const skill of skills) {
    const skillItem = document.createElement("li");

    skillItem.textContent = skill;

    skillList.appendChild(skillItem);
}

const addSkillButton = document.getElementById("addSkillButton");

function addSkill(skillName) {
    if (!skills.includes(skillName)) {
        const skillItem = document.createElement("li");

        skillItem.textContent = skillName;

        skills.push(skillName);

        skillList.appendChild(skillItem);
    } else {
        console.log(`${skillName} ist bereits vorhanden`);
    }
}

addSkillButton.addEventListener("click", function () {
    const newSkill = skillInput.value.trim();

    if(newSkill !== "") {
        addSkill(newSkill);
        skillInput.value = "";
    }
    
});


const skillInput = document.getElementById("skillInput");

skillInput.addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        const newSkill = skillInput.value.trim();

        if(newSkill !== "") {
            addSkill(newSkill);
            skillInput.value = "";
        }
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
        projectItem.textContent = (`${project.title} - fertig`);
    }else {
        projectItem.textContent = (`${project.title} - noch nicht fertig`);
    }

    projectList.appendChild(projectItem);

}

