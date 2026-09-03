import { fetchPosts } from "./api.js";

import {
    renderPosts,
    showError,
    clearError,
    setLoading
} from "./ui.js";

const postError = document.getElementById("postError");
const loadPostsButton = document.getElementById("loadPostsButton");

async function loadPosts() {
    clearError(postError);
    setLoading(loadPostsButton, true);

    try {
        const posts = await fetchPosts(1);

        renderPosts(posts);

    } catch (error) {
        showError(error.message, postError);

    } finally {
        setLoading(loadPostsButton, false);
    }
}

loadPosts();