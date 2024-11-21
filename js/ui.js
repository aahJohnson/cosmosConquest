// Global variable to store logged-in user data
let currentUser = null;

// Handle user registration form submission
document.getElementById("userForm").addEventListener("submit", async (e) => {
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
      if (
        data.error &&
        data.error.includes("Username or email already exists")
      ) {
        document.getElementById("result").textContent =
          "Username or email already exists. Please try again.";
      } else {
        document.getElementById("result").textContent =
          "An error occurred. Please try again.";
      }
    } else {
      document.getElementById(
        "result"
      ).textContent = `User created: ${data.username}`;
      document.getElementById("userForm").classList.add("hidden");

      setTimeout(() => {
        document.getElementById("userForm").style.display = "none";
        document.getElementById("loginForm").style.display = "block";
      }, 300);
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("result").textContent = "Failed to create user.";
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

    // Hide the login form and load the profile page
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

// Utility function to clear content and hide the map
function clearContent() {
  hideMap();
  document.getElementById("content").innerHTML = ""; // Clear the content area
}

// Utility function to hide the map
function hideMap() {
  document.getElementById("map").style.display = "none";
}

// Load the profile page with user data
function loadProfilePage() {
  clearContent(); // Clear previous content
  if (!currentUser) {
    console.error("No user is logged in.");
    return;
  }

  const profileContent = `
      <h2>Welcome, ${currentUser.username}</h2>
      <p><strong>Role:</strong> ${currentUser.role}</p>
      <p><strong>Building Progress:</strong> ${currentUser.building_progress}</p>
    `;
  document.getElementById("content").innerHTML = profileContent;
}

// Load the buildings page with placeholder data
function loadBuildingsPage() {
  clearContent(); // Clear previous content
  if (!currentUser) {
    console.error("No user is logged in.");
    return;
  }

  const buildingsContent = `
      <h2>Buildings Overview</h2>
      <p>Manage your buildings to grow your empire.</p>
      <p><strong>Building Progress:</strong> ${currentUser.building_progress}</p>
    `;
  document.getElementById("content").innerHTML = buildingsContent;
}

// Load the troops page with placeholder data
function loadTroopsPage() {
  clearContent(); // Clear previous content
  if (!currentUser) {
    console.error("No user is logged in.");
    return;
  }

  const troopsContent = `
      <h2>Your Troops</h2>
      <p>Train and deploy troops to conquer the galaxy.</p>
    `;
  document.getElementById("content").innerHTML = troopsContent;
}

// Load the map page
function loadMapPage() {
  clearContent(); // Clear previous content
  if (!currentUser) {
    console.error("No user is logged in.");
    return;
  }

  document.getElementById("map").style.display = "block"; // Show the map
  console.log(
    `Loading map for ${currentUser.username}, Role: ${currentUser.role}`
  );
}

// Event listeners for the sidebar buttons
document
  .querySelector("#profileButton")
  .addEventListener("click", loadProfilePage);
document
  .querySelector("#buildingsButton")
  .addEventListener("click", loadBuildingsPage);
document
  .querySelector("#troopsButton")
  .addEventListener("click", loadTroopsPage);
document.querySelector("#mapButton").addEventListener("click", loadMapPage);

// Toggle between forms
document.getElementById("showLogin").addEventListener("click", () => {
  document.getElementById("userForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
});

document.getElementById("showRegister").addEventListener("click", () => {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("userForm").style.display = "block";
});

function loadPage(pageId) {
  document.getElementById("content").innerHTML = "";
  document.getElementById("map").style.display =
    pageId === "map" ? "block" : "none";
}

document.querySelectorAll("#sidebar button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll("#sidebar button")
      .forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    loadPage(button.id.replace("Button", ""));
  });
});
