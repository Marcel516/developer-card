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

const sortPostsSelect = document.getElementById("sortPostsSelect");

let currentPosts = [];


async function loadUser() {
    postSearchInput.value = "";
    sortPostsSelect.value = "default";

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


postSearchInput.addEventListener("input", updatePosts);
sortPostsSelect.addEventListener("change", updatePosts);

function updatePosts() {
    const searchTerm = postSearchInput.value.trim().toLowerCase();

    const filteredPosts = currentPosts.filter((post) => {
        return post.title.toLowerCase().includes(searchTerm);
    });

    const sort = sortPostsSelect.value;
    const sortedPosts = [...filteredPosts];

    if (sort === "asc") {
        sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sort === "desc") {
        sortedPosts.sort((a, b) => b.title.localeCompare(a.title));
    }


    renderPosts(sortedPosts);

}