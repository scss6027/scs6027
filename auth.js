// auth.js — login, logout, and registration for static site

const AUTH_JSON = "https://scss6027.github.io/scs6027/auth.json"; // pre-defined users
const SESSION_KEY = "consoleAuth";
const LOCAL_USERS_KEY = "localUsers"; // key for locally created users

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const logoutBtn = document.getElementById('logout-btn');

  // --- LOGIN ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[name="email"]').value.trim();
      const password = loginForm.querySelector('input[name="password"]').value;

      try {
        // Load pre-defined JSON users
        const res = await fetch(AUTH_JSON);
        const data = await res.json();
        const jsonUsers = data.users;

        // Load locally registered users
        const localUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');

        // Combine both
        const allUsers = [...jsonUsers, ...localUsers];

        const user = allUsers.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (user) {
          sessionStorage.setItem(SESSION_KEY, email);
          alert('Login successful!');
          window.location.href = "console-main.html";
        } else {
          alert('Login failed: Invalid email or password');
        }
      } catch (err) {
        console.error(err);
        alert('Login failed: could not load user data');
      }
    });
  }

  // --- REGISTER NEW USER (local only) ---
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = registerForm.querySelector('input[name="email"]').value.trim();
      const password = registerForm.querySelector('input[name="password"]').value;

      if (!email || !password) {
        alert("Please fill in both fields");
        return;
      }

      // Load local users
      const localUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');

      // Check if already exists (JSON users + local users)
      fetch(AUTH_JSON)
        .then(res => res.json())
        .then(data => {
          const jsonUsers = data.users;
          const allUsers = [...jsonUsers, ...localUsers];

          if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            alert("This email is already registered");
            return;
          }

          // Add to localStorage
          localUsers.push({ email, password });
          localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));
          alert("Registration successful! You can now log in.");
          registerForm.reset();
        })
        .catch(err => {
          console.error(err);
          alert("Failed to register: could not check users");
        });
    });
  }

  // --- LOGOUT ---
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      alert("Logged out successfully");
      window.location.href = "login.html";
    });
  }

});

// --- SESSION CHECK FOR CONSOLE PAGES ---
function checkSession(redirectIfMissing = true) {
  const email = sessionStorage.getItem(SESSION_KEY);
  if (!email && redirectIfMissing) {
    window.location.href = "login.html";
    return false;
  }
  return true; // authorized
}
