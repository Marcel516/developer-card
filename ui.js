export function renderPosts(posts) {
    console.log(posts);
}

export function showError(message, errorElement) {
    errorElement.textContent = message;
}

export function clearError(errorElement) {
    errorElement.textContent = "";
}

export function setLoading(button, isLoading) {
    button.disabled = isLoading;
    button.textContent = isLoading ? "Lädt..." : "Posts laden";
}