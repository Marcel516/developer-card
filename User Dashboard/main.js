import { fetchUser } from "./api.js";
import { 
    renderUser,
    showUserError,
    clearUserError,
    setUserLoading
} from "./ui.js";

const userIdInput = document.getElementById("userIdInput");
const loadUserButton = document.getElementById("loadUserButton");


async function loadUser() {
    const userId = userIdInput.value.trim();

    clearUserError();

    if(!userId) {
        showUserError("Bitte eine User-ID eingeben");
        return;
    }

    setUserLoading(loadUserButton, true);

    try {
        const user = await fetchUser(userId);

        renderUser(user);
    } catch (error) {
        showUserError(error.message);
    } finally {
        setUserLoading(loadUserButton, false);
    }
}

loadUserButton.addEventListener("click", loadUser);