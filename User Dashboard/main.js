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
    clearPosts,
    showStatus,
    clearStatus,
    showSections,
    hideSections
} from "./ui.js";

const userIdInput = document.getElementById("userIdInput");
const loadUserButton = document.getElementById("loadUserButton");

const postSearchInput = document.getElementById("postSearchInput");

const sortPostsSelect = document.getElementById("sortPostsSelect");

const favoritesOnlyCheckbox = document.getElementById("favoritesOnlyCheckbox");

let currentPosts = [];
let statusTimer;
let favoritePostIds = [];


async function loadUser() {
    postSearchInput.value = "";
    sortPostsSelect.value = "default";
    favoritesOnlyCheckbox.checked = false;

    const userId = userIdInput.value.trim();

    hideSections();
    clearStatus();
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

    showStatus("Benutzer wird geladen...");
    setUserLoading(loadUserButton, true);

    try {
        const user = await fetchUser(userIdNumber);
        renderUser(user);

        currentPosts = await fetchPosts(userIdNumber);
        renderPosts(
            currentPosts,
            favoritePostIds,
            (postId) => {
                toggleFavorite(postId);
                updatePosts();
            }
        );

        showStatus("Benutzer erfolgreich geladen.");

        clearTimeout(statusTimer);

        statusTimer = setTimeout(() => {
            clearStatus();
        }, 3000);

        showSections();

    } catch (error) {
        clearStatus();
        showUserError(error.message);
    } finally {
        setUserLoading(loadUserButton, false);
    }
}

loadFavorites();

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

    let filteredPosts = currentPosts.filter((post) => {
        return post.title.toLowerCase().includes(searchTerm);
    });

    if (favoritesOnlyCheckbox.checked) {
        filteredPosts = filteredPosts.filter((post) => {
            return favoritePostIds.includes(post.id);
        });
    }

    const sort = sortPostsSelect.value;
    const sortedPosts = [...filteredPosts];

    if (sort === "asc") {
        sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sort === "desc") {
        sortedPosts.sort((a, b) => b.title.localeCompare(a.title));
    }


    renderPosts(
        sortedPosts,
        favoritePostIds,
        (postId) => {
            toggleFavorite(postId);
            updatePosts();
        }
    );
}

favoritesOnlyCheckbox.addEventListener("change", updatePosts);


function loadFavorites() {
    const savedFavorites = localStorage.getItem("favoritePostIds");

    if(savedFavorites) {
        favoritePostIds = JSON.parse(savedFavorites);
    }
}

function saveFavorites() {
    localStorage.setItem(
        "favoritePostIds",
        JSON.stringify(favoritePostIds)
    );
}


function toggleFavorite(postId) {
    if (favoritePostIds.includes(postId)) {
        favoritePostIds = favoritePostIds.filter((id) => {
            return id !== postId;
        });
    } else {
        favoritePostIds.push(postId);
    }

    saveFavorites();
}