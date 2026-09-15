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

export function renderPosts(posts, favoritePostIds, onToggleFavorite, onShowDetails) {
    const postList = document.getElementById("postList");

    updatePostCount(posts.length);

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
        const favoriteButton = document.createElement("button");
        const detailButton = document.createElement("button");
        detailButton.textContent = "Details anzeigen";

        title.textContent = post.title;
        body.textContent = post.body;
        favoriteButton.textContent = favoritePostIds.includes(post.id)
        ? "Favorit entfernen"
        : "Favorit";

        favoriteButton.addEventListener("click", () => {
            onToggleFavorite(post.id);
        });

        detailButton.addEventListener("click", () => {
            onShowDetails(post);
        });

        listItem.appendChild(title);
        listItem.appendChild(body);
        listItem.appendChild(favoriteButton);
        listItem.appendChild(detailButton);

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

export function updatePostCount(count) {
    const postCount = document.getElementById("postCount");
    postCount.textContent = `${count} Beiträge`;
}

export function showStatus(message) {
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.textContent = message;
}

export function clearStatus() {
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.textContent = "";
}

export function showSections() {
    const userSection = document.getElementById("userSection");
    const postsSection = document.getElementById("postsSection");

    userSection.hidden = false;
    postsSection.hidden = false;
}

export function hideSections() {
    const userSection = document.getElementById("userSection");
    const postsSection = document.getElementById("postsSection");

    userSection.hidden = true;
    postsSection.hidden = true;
}

export function showPostDetails(post) {
    const postDetailSection = document.getElementById("postDetailSection");
    const postDetailTitle = document.getElementById("postDetailTitle");
    const postDetailBody = document.getElementById("postDetailBody");

    postDetailTitle.textContent = post.title;
    postDetailBody.textContent = post.body;

    postDetailSection.hidden = false;
}

export function hidePostDetails() {
    const postDetailSection = document.getElementById("postDetailSection");

    postDetailSection.hidden = true;
}