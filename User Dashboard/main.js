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

        const posts = await fetchPosts(userIdNumber);
        renderPosts(posts);

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