import {
    fetchUser,
    fetchPosts
} from "./api.js";
import {
    renderUser,
    showUserError,
    clearUserError,
    setUserLoading,
    renderPosts,
    clearUser,
    clearPosts
} from "./ui.js";

const userIdInput = document.getElementById("userIdInput");
const loadUserButton = document.getElementById("loadUserButton");

const postSearchInput = document.getElementById("postSearchInput");

let currentPosts = [];


async function loadUser() {
    const userId = userIdInput.value.trim();

    clearUserError();
    clearUser();
    clearPosts();

    if(!userId) {
        showUserError("Bitte eine User-ID eingeben");
        return;
    }

    const userIdNumber = Number(userId);

    if (userIdNumber < 1 || userIdNumber > 10) {
        showUserError("Bitte eine User-ID zwischen 1 und 10 eingeben");
        return;
    }

    setUserLoading(loadUserButton, true);

    try {
        const user = await fetchUser(userIdNumber);
        renderUser(user);

        currentPosts = await fetchPosts(userIdNumber);
        renderPosts(currentPosts);

    } catch (error) {
        showUserError(error.message);
    } finally {
        setUserLoading(loadUserButton, false);
    }
}

loadUserButton.addEventListener("click", loadUser);

userIdInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        loadUser();
    }
});

function filterPosts() {
    const searchTerm = postSearchInput.value.trim().toLowerCase();

    const filteredPosts = currentPosts.filter((post) => {
        return post.title.toLowerCase().includes(searchTerm);
    });

    renderPosts(filteredPosts);
}

postSearchInput.addEventListener("input", filterPosts);