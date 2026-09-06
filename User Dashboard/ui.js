export function renderUser(user) {
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userCity = document.getElementById("userCity");

    userName.textContent = `Name: ${user.name}`;
    userEmail.textContent = `E-Mail: ${user.Email}`;
    userCity.textContent = `City: ${user.adress.city}`;
}

export function showUserError(message) {
    const userError = document.getElementById("userError");
    userError.textContent = message;
}

export function clearUserError() {
    const userError = document.getElementById("userError");
    userError.textContent = "";
}

export function setUserLoading(button, isLoading) {
    button.disabled = isLoading;
    button.textContent = isLoading ? "Lädt..." : "Benutzer laden";
}
