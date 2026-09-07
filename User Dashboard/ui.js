export function renderUser(user) {
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userCity = document.getElementById("userCity");

    userName.textContent = `Name: ${user.name}`;
    userEmail.textContent = `E-Mail: ${user.email}`;
    userCity.textContent = `City: ${user.address.city}`;
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

export function renderPosts(posts) {
    const postList = document.getElementById("postList");

    postList.innerHTML = "";

    if (posts.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Keine Beiträge gefunden";

        postList.appendChild(emptyMessage);
        return;
    }

    posts.forEach((post) => {
        const listItem = document.createElement("li");
        const title = document.createElement("h3");
        const body = document.createElement("p");

        title.textContent = post.title;
        body.textContent = post.body;

        listItem.appendChild(title);
        listItem.appendChild(body);

        postList.appendChild(listItem);

    });
}

export function clearUser() {
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userCity = document.getElementById("userCity");

    userName.textContent = "";
    userEmail.textContent = "";
    userCity.textContent = "";
}

export function clearPosts() {
    const postList = document.getElementById("postList");
    postList.innerHTML = "";
}