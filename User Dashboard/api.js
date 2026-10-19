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

function wait(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

async function apiRequestWithRetry(
    url,
    options,
    notFoundMessage,
    errorMessage
) {
    try {
        return await apiRequest(
            url,
            options,
            notFoundMessage,
            errorMessage
        );
    } catch (error) {

        const retryableErrors = [
            "Verbindung zum Server fehlgeschlagen",
            "Zeitüberschreitung - Server antwortet zu langsam",
            "Serverfehler – bitte später erneut versuchen"
        ];

        if (!retryableErrors.includes(error.message)) {
            throw error;
        }

        await wait(1000);

        return apiRequest(
            url,
            options,
            notFoundMessage,
            errorMessage
        );
    }
}

async function apiRequest(url, options, notFoundMessage, errorMessage) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, 5000);

    let response;

    try {
        response = await fetch(url, {
            ...options, 
            signal: controller.signal
        }); 

    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error(
                "Zeitüberschreitung - Server antwortet zu langsam"
            );
        }

        throw new Error("Verbindung zum Server fehlgeschlagen");
    } finally {
        clearTimeout(timeoutId);
    }

    checkResponse(response, notFoundMessage, errorMessage);

    if (response.status === 204) {
        return null;
    }

    try {
        return await response.json();
    } catch {
        throw new Error("Serverantwort konnte nicht verarbeitet werden");
    }
}


export async function fetchUser(userId) {
    return apiRequestWithRetry(
        `${API_URL}/users/${userId}`,
        undefined,
        "Benutzer wurde nicht gefunden",
        "Benutzer konnte nicht geladen werden"
    );

}

export async function fetchPosts(userId) {
    const params = new URLSearchParams({
        userId: userId
    });

    return apiRequestWithRetry(
        `${API_URL}/posts?${params}`,
        undefined,
        "Posts wurden nicht gefunden",
        "Posts konnten nicht geladen werden"
    );

}


export async function createPostRequest(userId, title, body) {
    return apiRequest(
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

}


export async function updatePostRequest(postId, title, body) {
    return apiRequest(
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

}


export async function deletePostRequest(postId) {
    return apiRequest(
        `${API_URL}/posts/${postId}`,
        {
            method: "DELETE"
        },
        "Post wurde nicht gefunden",
        "Post konnte nicht gelöscht werden"
    );

}