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


export async function fetchUser(userId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    
    checkResponse(response,
        "Benutzer wurde nicht gefunden",
        "Benutzer konnte nicht geladen werden"
    );

    return response.json();
}

export async function fetchPosts(userId) {
    const params = new URLSearchParams({
        userId: userId
    });

    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?${params}`);

    checkResponse(
        response,
        "Posts wurden nicht gefunden",
        "Posts konnten nicht geladen werden"
    );

    return response.json();

}


export async function createPostRequest(userId, title, body) {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
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
        }
    );

    checkResponse(
        response,
        "Post-Endpunkt wurde nicht gefunden",
        "Post konnte nicht erstellt werden"
    );

    return response.json();
}


export async function updatePostRequest(postId, title, body) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title,
                body
            })
        }
    );

    checkResponse(
        response,
        "Post wurde nicht gefunden",
        "Post konnte nicht bearbeitet werden"
    );

    return response.json();
}


export async function deletePostRequest(postId) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
            method: "DELETE"
        }
    );

    checkResponse(
        response,
        "Post wurde nicht gefunden",
        "Post konnte nicht gelöscht werden"
    );
}