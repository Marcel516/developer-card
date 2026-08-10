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

addSkillButton.addEventListener("click", function () {
    const skillItem = document.createElement("li");

    skillItem.textContent = "React";

    skills.push("React");

    skillList.appendChild(skillItem);
});

