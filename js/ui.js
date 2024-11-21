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

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("profileButton").addEventListener("click", () => {
    setActiveButton("profileButton");
    clearViews(); // Clear other views
    loadProfilePage();
  });

  document.getElementById("buildingsButton").addEventListener("click", () => {
    setActiveButton("buildingsButton");
    clearViews(); // Clear other views
    loadBuildingsPage();
  });

  document.getElementById("troopsButton").addEventListener("click", () => {
    setActiveButton("troopsButton");
    clearViews(); // Clear other views
    loadTroopsPage();
  });

  document.getElementById("mapButton").addEventListener("click", () => {
    setActiveButton("mapButton");
    clearViews(); // Clear other views
    loadMapPage(); // Explicitly load the map view
  });
});

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

function setActiveButton(buttonId) {
  // Remove 'active' class from all sidebar buttons
  document.querySelectorAll("#sidebar button").forEach((button) => {
    button.classList.remove("active");
  });

  // Add 'active' class to the clicked button
  const activeButton = document.getElementById(buttonId);
  if (activeButton) {
    activeButton.classList.add("active");
  }
}

// Load Pages
function loadProfilePage() {
  const content = document.getElementById("content");
  content.innerHTML = `
      <h2>Profile</h2>
      <p>Welcome, ${currentUser.username}!</p>
      <p>Role: ${currentUser.role}</p>
      <p>Building Progress: ${currentUser.building_progress}</p>
    `;
}

function loadBuildingsPage() {
  const content = document.getElementById("content");
  content.innerHTML = `
      <h2>Buildings</h2>
      <p>Manage your buildings here.</p>
      <!-- Add building management logic -->
    `;
}

function loadTroopsPage() {
  const content = document.getElementById("content");
  content.innerHTML = `
      <h2>Troops</h2>
      <p>Manage your troops here.</p>
      <!-- Add troop management logic -->
    `;
}

function loadMapPage() {
  // Clear other content
  document.getElementById("content").style.display = "none";
  document.getElementById("map").style.display = "block"; // Show map

  console.log("Map view loaded");
}

function hideMap() {
  document.getElementById("map").style.display = "none"; // Hide map
  document.getElementById("content").style.display = "block"; // Show content
}

function clearViews() {
  console.log("Clearing views");
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.add("hidden"); // Hide all other views
    view.classList.remove("active");
  });

  // Ensure the map is initially hidden when clearing
  document.getElementById("map").style.display = "none";
  document.getElementById("content").style.display = "block";
}
