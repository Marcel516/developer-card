export async function fetchUser(userId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    
    if (!response.ok) {
        throw new Error("Benutzer konnte nicht geladen werden");
    }

    return response.json();
}

export async function fetchPosts(userId) {
    const params = new URLSearchParams({
        userId: userId
    });

    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?${params}`);

    if (!response.ok) {
        throw new Error("Daten konnten nicht geladen werden.");
    }

    return response.json();

}