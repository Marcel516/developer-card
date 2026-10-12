const API_URL = "https://jsonplaceholder.typicode.com";


function checkResponse(response, notFoundMessage, errorMessage) {
    if (response.status === 404) {
        throw new Error(notFoundMessage);
    }

    if (response.status >= 500) {
        throw new Error("Serverfehler – bitte später erneut versuchen");
    }

    if (!response.ok) {
        throw new Error(
            `${errorMessage} (HTTP ${response.status})`
        );
    }
}

async function apiRequest(url, options, notFoundMessage, errorMessage) {
    const response = await fetch(url, options);

    checkResponse(response, notFoundMessage, errorMessage);

    return response;
}


export async function fetchUser(userId) {
    const response = await apiRequest(
        `${API_URL}/users/${userId}`,
        undefined,
        "Benutzer wurde nicht gefunden",
        "Benutzer konnte nicht geladen werden"
    );

    return response.json();
}

export async function fetchPosts(userId) {
    const params = new URLSearchParams({
        userId: userId
    });

    const response = await apiRequest(
        `${API_URL}/posts?${params}`,
        undefined,
        "Posts wurden nicht gefunden",
        "Posts konnten nicht geladen werden"
    );

    return response.json();
}


export async function createPostRequest(userId, title, body) {
    const response = await apiRequest(
        `${API_URL}/posts`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                userId,
                title,
                body
            })
        },
        "Post-Endpunkt wurde nicht gefunden",
        "Post konnte nicht erstellt werden"
    );

    return response.json();
}


export async function updatePostRequest(postId, title, body) {
    const response = await apiRequest(
        `${API_URL}/posts/${postId}`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title,
                body
            })
        },
        "Post wurde nicht gefunden",
        "Post konnte nicht bearbeitet werden"
    );

    return response.json();
}


export async function deletePostRequest(postId) {
    await apiRequest(
        `${API_URL}/posts/${postId}`,
        {
            method: "DELETE"
        },
        "Post wurde nicht gefunden",
        "Post konnte nicht gelöscht werden"
    );

    
}