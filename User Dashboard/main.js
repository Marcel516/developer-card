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
    hideSections,
    showPostDetails,
    hidePostDetails,
} from "./ui.js";
import {
    savePosts,
    loadSavedPosts,
    removeSavedPosts,
    saveFavorites,
    loadFavorites
} from "./storage.js";

const userIdInput = document.getElementById("userIdInput");
const loadUserButton = document.getElementById("loadUserButton");
const postSearchInput = document.getElementById("postSearchInput");
const sortPostsSelect = document.getElementById("sortPostsSelect");
const favoritesOnlyCheckbox = document.getElementById("favoritesOnlyCheckbox");
const prevPageButton = document.getElementById("prevPageButton");
const nextPageButton = document.getElementById("nextPageButton");
const pageInfo = document.getElementById("pageInfo");
const closePostDetailButton = document.getElementById("closePostDetailButton");
const editPostSection = document.getElementById("editPostSection");
const editPostTitle = document.getElementById("editPostTitle");
const editPostBody = document.getElementById("editPostBody");
const savePostButton = document.getElementById("savePostButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const newPostTitle = document.getElementById("newPostTitle");
const newPostBody = document.getElementById("newPostBody");
const createPostButton = document.getElementById("createPostButton");
const resetPostsButton = document.getElementById("resetPostsButton");

let currentPosts = [];
let statusTimer;
let favoritePostIds = loadFavorites();
let currentPage = 1;
let editingPostId = null;
let currentUserId = null;

const postsPerPage = 3;


async function loadUser() {
    postSearchInput.value = "";
    sortPostsSelect.value = "default";
    favoritesOnlyCheckbox.checked = false;

    const userId = userIdInput.value.trim();

    currentPage = 1;

    hideSections();
    clearStatus();
    clearUserError();
    clearUser();
    clearPosts();
    hidePostDetails();

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

        currentUserId = userIdNumber;

        const savedPosts = loadSavedPosts(userIdNumber);

        if (savedPosts) {
            currentPosts = savedPosts;
        } else {
            currentPosts = await fetchPosts(userIdNumber);
            savePosts(currentUserId, currentPosts);
        }

        updatePosts();

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


loadUserButton.addEventListener("click", loadUser);

userIdInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        loadUser();
    }
});


postSearchInput.addEventListener("input", () => {
    currentPage = 1;
    updatePosts();
});

sortPostsSelect.addEventListener("change", () => {
    currentPage = 1;
    updatePosts();
});

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

    const paginatedPosts = getPaginatedPosts(sortedPosts);

    updatePagination(sortedPosts.length);

    renderPosts(
        paginatedPosts,
        favoritePostIds,
        (postId) => {
            toggleFavorite(postId);
            updatePosts();
        },
        (post) => {
            showPostDetails(post);
        },
        (postId) => {
            startEditPost(postId);
        },
        (postId) => {
            deletePost(postId);
        }
    );
}

closePostDetailButton.addEventListener("click", hidePostDetails);

prevPageButton.addEventListener("click", () => {
    currentPage--;
    hidePostDetails();
    updatePosts();
});

nextPageButton.addEventListener("click", () => {
    currentPage++;
    hidePostDetails();
    updatePosts();
})

favoritesOnlyCheckbox.addEventListener("change", () => {
    currentPage = 1;
    updatePosts();
});

function toggleFavorite(postId) {
    if (favoritePostIds.includes(postId)) {
        favoritePostIds = favoritePostIds.filter((id) => {
            return id !== postId;
        });
    } else {
        favoritePostIds.push(postId);
    }

    saveFavorites(favoritePostIds);
}

function getPaginatedPosts(posts) {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    return posts.slice(startIndex, endIndex);
}

function updatePagination(totalPosts) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    if (totalPages === 0) {
        pageInfo.textContent = "Keine Seiten";
        prevPageButton.disabled = true;
        nextPageButton.disabled = true;
        return;
    }

    pageInfo.textContent = `Seite ${currentPage} von ${totalPages}`;

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;

}


function startEditPost(postId) {
    const post = currentPosts.find((post) => post.id === postId);

    editingPostId = post.id;

    editPostTitle.value = post.title;
    editPostBody.value = post.body;

    editPostSection.hidden = false;
}


function saveEditedPost() {
    const post = currentPosts.find((post) => post.id === editingPostId);

    if (!post) {
        return;
    }

    post.title = editPostTitle.value.trim();
    post.body = editPostBody.value.trim();

    savePosts(currentUserId, currentPosts);

    editPostSection.hidden = true;
    editingPostId = null;

    updatePosts();
}

savePostButton.addEventListener("click", saveEditedPost);

cancelEditButton.addEventListener("click", () => {

    editPostSection.hidden = true;
    editingPostId = null;
});


function deletePost(postId) {
    const confirmed = confirm("Post wirklich löschen?")

    if(!confirmed) {
        return;
    }

    currentPosts = currentPosts.filter((post) => {
        return post.id !== postId;
    });

    favoritePostIds = favoritePostIds.filter((id) => {
        return id !== postId;
    });

    saveFavorites(favoritePostIds);

    const totalPages = Math.ceil(currentPosts.length / postsPerPage);

    if (currentPage > totalPages && currentPage > 1) {
        currentPage--;
    }

    savePosts(currentUserId, currentPosts);

    updatePosts();

}

function createPost() {
    const title = newPostTitle.value.trim();
    const body = newPostBody.value.trim();
    const errorMessage = document.getElementById("createPostError");

    errorMessage.textContent = "";

    if (!title || !body) {
        errorMessage.textContent = "Titel und Text bitte ausfüllen";
        return;
    }

    const newId = Date.now();

    const newPost = {
        id: newId,
        title,
        body
    };

    currentPosts.push(newPost);

    savePosts(currentUserId, currentPosts);

    newPostTitle.value = "";
    newPostBody.value = "";

    currentPage = 1;

    updatePosts();

}

createPostButton.addEventListener("click", createPost);

async function resetPosts() {
    if (currentUserId === null) {
        return;
    }

    removeSavedPosts(currentUserId);

    currentPosts = await fetchPosts(currentUserId);

    savePosts(currentUserId, currentPosts);

    currentPage = 1;

    updatePosts();
}

resetPostsButton.addEventListener("click", resetPosts);