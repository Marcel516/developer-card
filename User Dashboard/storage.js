export function savePosts(userId, posts) {
    if (userId === null) {
        return;
    }

    localStorage.setItem(
        `posts_user_${userId}`,
        JSON.stringify(posts)
    );
}

export function loadSavedPosts(userId) {
    const savedPosts = localStorage.getItem(`posts_user_${userId}`);

    if (savedPosts) {
        return JSON.parse(savedPosts);
    }

    return null;
}

export function removeSavedPosts(userId) {
    localStorage.removeItem(`posts_user_${userId}`);
}

export function saveFavorites(favoritePostIds) {
    localStorage.setItem(
        "favoritePostIds",
        JSON.stringify(favoritePostIds)
    );
}

export function loadFavorites() {
    const savedFavorites = localStorage.getItem("favoritePostIds");

    if (savedFavorites) {
        return JSON.parse(savedFavorites);
    }

    return [];
}