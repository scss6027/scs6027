// auth.js — handles login, logout, and session check
// Works purely on front-end (no server) using auth.json

const AUTH_JSON = "https://scss6027.github.io/scs6027/auth.json"; // path to your JSON
const SESSION_KEY = "consoleAuth"; // sessionStorage key

document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');

  // --- LOGIN ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[name="email"]').value.trim();
      const password = loginForm.querySelector('input[name="password"]').value;

      try {
        const res = await fetch(AUTH_JSON);
        if (!res.ok) throw new Error("Could not load auth.json");
        const data = await res.json();

        const user = data.users.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (user) {
          // success → set session token
          sessionStorage.setItem(SESSION_KEY, email);
          alert('Login successful!');
          window.location.href = "console-main.html"; // redirect to console
        } else {
          alert('Login failed: Invalid email or password');
        }
      } catch (err) {
        console.error(err);
        alert('Network or JSON error during login');
      }
    });
  }

  // --- LOGOUT ---
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      alert('Logged out successfully');
      window.location.href = "login.html"; // redirect to login
    });
  }

});

// --- FUNCTION: check session for console pages ---
function checkSession(redirectIfMissing = true) {
  const email = sessionStorage.getItem(SESSION_KEY);
  if (!email && redirectIfMissing) {
    window.location.href = "login.html";
    return false;
  }
  return true; // authorized
}
