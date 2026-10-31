const API_URL = "https://jsonplaceholder.typicode.com";


function checkResponse(response, notFoundMessage, errorMessage) {
    if (response.status === 404) {
        throw new ApiError(
            notFoundMessage,
            false,
            response.status
        );
    }

    if (response.status >= 500) {
        throw new ApiError(
            "Serverfehler – bitte später erneut versuchen",
            true,
            response.status
        );
    }

    if (!response.ok) {
        throw new ApiError(
            `${errorMessage} (HTTP ${response.status})`,
            false,
            response.status
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
    errorMessage,
    maxRetries = 2
) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        
        try {
            return await apiRequest(
                url,
                options,
                notFoundMessage,
                errorMessage
            );
        } catch (error) {
            if (!error.retryable) {
                throw error;
            }

            if (attempt === maxRetries) {
                throw error;
            }

            const delay = Math.min(
                1000 * (2 ** attempt),
                8000
            );

            const jitter = Math.floor(Math.random() * 500);

            await wait(delay + jitter);
        }
    }
}


class ApiError extends Error {
    constructor(message, retryable = false, status = null) {
        super(message);

        this.name = "ApiError";
        this.retryable = retryable;
        this.status = status;
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
            throw new ApiError(
                "Zeitüberschreitung - Server antwortet zu langsam",
                true
            );
        }

        throw new ApiError(
            "Verbindung zum Server fehlgeschlagen",
            true
        );
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
        "Benutzer konnte nicht geladen werden",
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
        "Posts konnten nicht geladen werden",
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