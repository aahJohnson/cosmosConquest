document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  // Global variable to store logged-in user data
  let currentUser = null;

  // Ensure all DOM elements are queried after DOM is fully loaded
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const showLoginForm = document.getElementById("showLoginForm");
  const showRegisterForm = document.getElementById("showRegisterForm");

  // Check for all required elements
  if (!registerForm) console.error("Error: registerForm not found in the DOM.");
  if (!loginForm) console.error("Error: loginForm not found in the DOM.");
  if (!showLoginForm)
    console.error("Error: showLoginForm button not found in the DOM.");
  if (!showRegisterForm)
    console.error("Error: showRegisterForm button not found in the DOM.");

  // Handle user registration form submission
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("registerUsername")?.value || "";
      const email = document.getElementById("registerEmail")?.value || "";
      const password = document.getElementById("registerPassword")?.value || "";
      const role = document.getElementById("registerRole")?.value || "";

      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, role }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (
            data.error &&
            data.error.includes("Username or email already exists")
          ) {
            document.getElementById("registerResult").textContent =
              "Username or email already exists. Please try again.";
          } else {
            document.getElementById("registerResult").textContent =
              "An error occurred. Please try again.";
          }
        } else {
          document.getElementById(
            "registerResult"
          ).textContent = `User created: ${data.username}`;
          registerForm.classList.add("hidden");

          setTimeout(() => {
            registerForm.style.display = "none";
            if (loginForm) loginForm.style.display = "block";
          }, 300);
        }
      } catch (error) {
        console.error("Error:", error);
        document.getElementById("registerResult").textContent =
          "Failed to create user.";
      }
    });
  }

  // Handle user login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("loginUsername")?.value || "";
      const password = document.getElementById("loginPassword")?.value || "";

      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          document.getElementById("loginResult").textContent =
            errorData.error || "Failed to log in.";
          return;
        }

        const data = await response.json();
        currentUser = data; // Store the user data globally
        document.getElementById(
          "loginResult"
        ).textContent = `Welcome, ${data.username}!`;

        // Hide the login form and load the main UI
        setTimeout(() => {
          loginForm.style.display = "none";
          loadProfilePage(); // Automatically load the profile page after login
        }, 500);
      } catch (error) {
        console.error("Error:", error);
        document.getElementById("loginResult").textContent =
          "An unexpected error occurred.";
      }
    });
  }

  // Toggle between Login and Register Forms
  if (showLoginForm && showRegisterForm) {
    showLoginForm.addEventListener("click", () => {
      console.log("Login form toggle clicked");
      if (registerForm) registerForm.style.display = "none";
      if (loginForm) loginForm.style.display = "block";
    });

    showRegisterForm.addEventListener("click", () => {
      console.log("Register form toggle clicked");
      if (loginForm) loginForm.style.display = "none";
      if (registerForm) registerForm.style.display = "block";
    });
  }

  // Load Profile Page
  function loadProfilePage() {
    if (!currentUser) {
      console.error("No user is logged in.");
      return;
    }

    // Update profile tab content with user data
    const profileContent = `
      <h2>Welcome, ${currentUser.username}</h2>
      <p><strong>Role:</strong> ${currentUser.role}</p>
      <p><strong>Building Progress:</strong> ${currentUser.building_progress}</p>
    `;
    document.getElementById("content").innerHTML = profileContent;
  }
});
