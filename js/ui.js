document.addEventListener("DOMContentLoaded", () => {
  // Global variable to store logged-in user data
  let currentUser = null;

  // Handle user registration form submission
  document
    .getElementById("registerForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;

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
          document.getElementById("result").textContent =
            data.error || "An error occurred. Please try again.";
        } else {
          document.getElementById(
            "result"
          ).textContent = `User created: ${data.username}`;
          document.getElementById("registerForm").classList.add("hidden");
          setTimeout(() => {
            document.getElementById("registerForm").style.display = "none";
            document.getElementById("loginForm").style.display = "block";
          }, 300);
        }
      } catch (error) {
        console.error("Error:", error);
        document.getElementById("result").textContent =
          "Failed to create user.";
      }
    });

  // Handle user login form submission
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        document.getElementById("loginResult").textContent =
          data.error || "Failed to log in.";
        return;
      }

      currentUser = data; // Store the user data globally
      document.getElementById(
        "loginResult"
      ).textContent = `Welcome, ${data.username}!`;

      // Hide the login form and load the main UI
      setTimeout(() => {
        document.getElementById("loginForm").style.display = "none";
        loadProfilePage(); // Automatically load the profile page after login
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("loginResult").textContent =
        "An unexpected error occurred.";
    }
  });

  // Navigation and Content Logic
  document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll(".nav-button");
    const views = document.querySelectorAll(".view");

    navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        navButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        views.forEach((view) => {
          view.classList.add("hidden");
          view.classList.remove("active");
        });

        const targetView = document.getElementById(
          `${button.dataset.section}-view`
        );
        if (targetView) {
          targetView.classList.remove("hidden");
          targetView.classList.add("active");
        }
      });
    });

    // Set default view
    document.querySelector(".nav-button[data-section='profile']").click();
  });

  // Populate Profile Page
  function loadProfilePage() {
    if (!currentUser) {
      console.error("No user is logged in.");
      return;
    }

    const profileView = document.getElementById("profile-view");
    profileView.innerHTML = `
    <h2>Welcome, ${currentUser.username}</h2>
    <p><strong>Role:</strong> ${currentUser.role}</p>
    <p><strong>Building Progress:</strong> ${currentUser.building_progress}</p>
  `;
  }

  // Populate Buildings Page
  function loadBuildingsPage() {
    const buildingsView = document.getElementById("buildings-view");
    buildingsView.innerHTML = `
    <h2>Buildings Overview</h2>
    <p>Manage your buildings to grow your empire.</p>
  `;
  }

  // Populate Troops Page
  function loadTroopsPage() {
    const troopsView = document.getElementById("troops-view");
    troopsView.innerHTML = `
    <h2>Your Troops</h2>
    <p>Train and deploy troops to conquer the galaxy.</p>
  `;
  }

  // Show/Hide Forms
  document.getElementById("showLogin").addEventListener("click", () => {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  });

  document.getElementById("showRegister").addEventListener("click", () => {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
  });

  // Toggle between Login and Register Forms
  document.getElementById("showLoginForm").addEventListener("click", (e) => {
    console.log("Login form toggle clicked");
    e.preventDefault();
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  });

  document.getElementById("showRegisterForm").addEventListener("click", (e) => {
    console.log("Register form toggle clicked");
    e.preventDefault();
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
  });
});
