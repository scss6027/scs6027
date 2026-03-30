/**
 * SCSS6027 PROJECT 4 AUTH ENGINE
 * Handles JSON Admins, JSON Users, and Local Registrations
 */

const SESSION_KEY = "consoleAuth";
const LOCAL_USERS_KEY = "localUsers";

// This function is called by the login form
async function handleLogin(email, password, authData) {
    const loginStatus = document.getElementById('loginStatus');

    try {
        // 1. Combine JSON users (from auth.json) and Local users (from localStorage)
        const jsonUsers = authData.users || [];
        const localUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
        const allUsers = [...jsonUsers, ...localUsers];

        // 2. ADMIN CHECK: Is this email in the authorized admins list?
        const isAdmin = authData.admins.map(e => e.toLowerCase()).includes(email.toLowerCase());

        if (!isAdmin) {
            return { success: false, message: "UNAUTHORIZED_IDENTITY: Not in Admin Whitelist." };
        }

        // 3. PASSWORD CHECK: Verify credentials
        const user = allUsers.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (user) {
            sessionStorage.setItem(SESSION_KEY, email);
            return { success: true };
        } else {
            return { success: false, message: "INVALID_CREDENTIALS: Check Password." };
        }
    } catch (err) {
        console.error(err);
        return { success: false, message: "SYSTEM_ERROR: Logic Failure." };
    }
}

// Session Check for Protected Pages
function checkSession() {
    const email = sessionStorage.getItem(SESSION_KEY);
    if (!email) {
        window.location.href = "login.html";
    }
}

// Logout Function
function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
}
