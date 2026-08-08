const contactButton = document.getElementById("contactButton");
const contactMessage = document.getElementById("contactMessage");

let messageVisible = false;

contactButton.addEventListener("click", showContactMessage);

function showContactMessage(){
    if (messageVisible === false) {
        contactMessage.textContent = "Du kannst mich über GitHub kontaktieren.";
        contactButton.textContent = "Schließen";
        messageVisible = true;
    } else {
        contactMessage.textContent = "";
        contactButton.textContent ="Kontakt";
        messageVisible = false;
    }  
}