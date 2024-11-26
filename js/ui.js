// Global variable to store logged-in user data
let currentUser;

// Load game data
let localization = null;
let buildings = [];
let units = [];
let currentRoleIndex = 0;

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const showLoginForm = document.getElementById("showLoginForm");
const showRegisterForm = document.getElementById("showRegisterForm");
const content = document.getElementById("content");
const buildingsView = document.querySelector("#buildings-view");
const buildingsList = document.getElementById("buildings-list");
const troopsView = document.querySelector("#troops-view");
const authBackground = document.querySelector("#authBackground");

// Initialize all game data
async function initializeGameData() {
  try {
    // Load localization.json
    const localizationResponse = await fetch("../data/localization.json");
    if (localizationResponse.ok) {
      localization = await localizationResponse.json();
      console.log("Localization loaded:", localization);
    } else {
      console.error("Failed to load localization file.");
    }

    // Dynamically import buildings and units
    const buildingsModule = await import("../data/buildings.js");
    const unitsModule = await import("../data/units.js");
    buildings = buildingsModule.buildings;
    units = unitsModule.units;

    console.log("Game data loaded:", { buildings, units });

    // Call updateRoleDisplay only after data is loaded
    updateRoleDisplay();
    renderBuildings(); // Initial render of buildings
  } catch (error) {
    console.error("Error loading game data:", error);
  }
}

// Get localized factions dynamically
function getLocalizedFactions() {
  if (!localization) {
    console.error("Localization data is not loaded.");
    return null;
  }

  // Dynamically get the first language key
  const language = Object.keys(localization)[0];
  if (!localization[language] || !localization[language].factions) {
    console.error("Localization or factions data is not properly loaded.");
    return null;
  }

  return localization[language].factions;
}

// Update role display
async function updateRoleDisplay() {
  const factions = getLocalizedFactions();
  if (!factions) return;

  const roleKeys = Object.keys(factions);
  if (!roleKeys.length) {
    console.error("No roles found in localization data.");
    return;
  }

  const currentRoleKey = roleKeys[currentRoleIndex];
  const currentRole = factions[currentRoleKey];
  const carouselContent = document.querySelector(".carousel-content");

  if (!carouselContent) {
    console.error("Carousel content element not found.");
    return;
  }

  // Update role details

  document.getElementById("role-description").textContent =
    currentRole.description;

  // Clear existing carousel content
  carouselContent.innerHTML = "";

  // Generate ordered roles for the carousel
  const orderedRoles = [
    factions[
      roleKeys[(currentRoleIndex - 1 + roleKeys.length) % roleKeys.length]
    ], // Previous role
    currentRole, // Current role
    factions[roleKeys[(currentRoleIndex + 1) % roleKeys.length]], // Next role
  ];

  // Add roles to the carousel
  orderedRoles.forEach((role, index) => {
    const roleCard = document.createElement("div");
    roleCard.classList.add("role-card");
    if (index === 1) {
      roleCard.classList.add("visible"); // Highlight the active role
    }

    const img = document.createElement("img");
    img.src = role.image || "../media/planet.webp"; // Fallback image
    img.alt = role.name;

    const roleName = document.createElement("p");
    roleName.textContent = role.name;

    if (index === 1) {
      roleName.style.fontSize = "1.2rem";
      roleName.style.color = "#a020f0";
      roleName.style.textShadow = "0 0 15px #a020f0";
    }

    roleCard.appendChild(img);
    roleCard.appendChild(roleName);
    carouselContent.appendChild(roleCard);
  });

  // Dynamically calculate the card width and spacing
  const cardWidth = 150; // Example card width
  const cardMargin = 10; // Example margin
  const totalCardWidth = cardWidth + cardMargin;

  // Adjust translation dynamically based on the card size
  carouselContent.style.transform = `translateX(-${totalCardWidth}px)`;
}

// Ensure carousel buttons handle navigation
document.getElementById("prevRole").addEventListener("click", () => {
  const factions = getLocalizedFactions();
  if (!factions) return;

  const roleKeys = Object.keys(factions);
  currentRoleIndex = (currentRoleIndex - 1 + roleKeys.length) % roleKeys.length;
  updateRoleDisplay();
});

document.getElementById("nextRole").addEventListener("click", () => {
  const factions = getLocalizedFactions();
  if (!factions) return;

  const roleKeys = Object.keys(factions);
  currentRoleIndex = (currentRoleIndex + 1) % roleKeys.length;
  updateRoleDisplay();
});

// Ensure all DOM elements are queried after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check for all required elements
  if (!registerForm) console.error("Error: registerForm not found in the DOM.");
  if (!loginForm) console.error("Error: loginForm not found in the DOM.");
  if (!showLoginForm)
    console.error("Error: showLoginForm button not found in the DOM.");
  if (!showRegisterForm)
    console.error("Error: showRegisterForm button not found in the DOM.");

  // Sidebar Navigation Logic
  document.getElementById("profileButton").addEventListener("click", () => {
    setActiveButton("profileButton");
    clearViews();
    loadProfilePage();
  });

  document.getElementById("buildingsButton").addEventListener("click", () => {
    setActiveButton("buildingsButton");
    clearViews();
    loadBuildingsPage();
  });

  document.getElementById("troopsButton").addEventListener("click", () => {
    setActiveButton("troopsButton");
    clearViews();
    loadTroopsPage();
  });

  document.getElementById("mapButton").addEventListener("click", () => {
    setActiveButton("mapButton");
    clearViews();
    loadMapPage();
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

        console.log("Response:" + response.status);

        if (!response.ok) {
          document.getElementById("registerResult").textContent =
            data.error || "Failed to create user.";
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

      console.log("here");

      const username = document.getElementById("loginUsername")?.value || "";
      const password = document.getElementById("loginPassword")?.value || "";

      console.log({ username, password });

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

        const data = await response.json(); // Store the user data globally
        currentUser = data;

        // Hide the login form and load the main UI
        setTimeout(() => {
          loginForm.style.display = "none";
          authBackground.style.display = "none";
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
      if (registerForm) registerForm.style.display = "none";
      if (loginForm) loginForm.style.display = "block";
    });

    showRegisterForm.addEventListener("click", () => {
      if (loginForm) loginForm.style.display = "none";
      if (registerForm) registerForm.style.display = "block";
    });
  }

  // Handle category buttons (if any)
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("visible"));
      btn.classList.add("visible");

      const category = btn.dataset.category;
      renderBuildings(category);
    });
  });

  // Initial render
  renderBuildings();
});

// Function to set the active sidebar button
function setActiveButton(buttonId) {
  // Remove 'active' class from all sidebar buttons
  document.querySelectorAll("#sidebar button").forEach((button) => {
    button.classList.remove("visible");
  });

  // Add 'active' class to the clicked button
  const activeButton = document.getElementById(buttonId);
  if (activeButton) {
    activeButton.classList.add("visible");
  }
}

// Function to clear all views
function clearViews() {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.add("hidden"); // Hide all other views
    view.classList.remove("visible");
  });

  // Ensure the map is initially hidden when clearing
  const mapElement = document.getElementById("map");
  if (mapElement) mapElement.style.display = "none";
  const contentElement = document.getElementById("content");
  if (contentElement) contentElement.style.display = "block";
}

// Function to clear content
function clearContent() {
  document.getElementById("content").innerHTML = ""; // Clear the content area
  const mapContainer = document.getElementById("map-container");
  if (mapContainer) {
    mapContainer.classList.remove("visible");
    mapContainer.classList.add("hidden");
  }
}

// Profile page
function loadProfilePage() {
  content.innerHTML = `
      <h2>Profile of ${currentUser.username}</h2>
      <p>Origin: ${currentUser.role}</p>
      <p>Moons: ${currentUser.building_progress}</p>
    `;
}

// Buildings page
function loadBuildingsPage() {
  content.innerHTML = "";

  if (buildingsView) {
    // Append the buildings-view element to the content container
    content.appendChild(buildingsView);

    // Ensure it's visible
    buildingsView.classList.remove("hidden");
    buildingsView.classList.add("active");

    // Call renderBuildings to populate the buildings list
    renderBuildings();
  } else {
    console.error("Buildings view not found!");
  }
}

// Function to render buildings
function renderBuildings(category = "Resource Management") {
  const filteredBuildings = buildings.filter((b) => b.category === category);

  buildingsList.innerHTML = ""; // Clear previous content

  filteredBuildings.forEach((building) => {
    const buildingDiv = document.createElement("div");
    buildingDiv.className = "building";
    buildingDiv.innerHTML = `
      <h3>${building.name}</h3>
      <p>${building.description}</p>
      <p>Level: ${building.level} / ${building.maxLevel}</p>
      <button data-name="${building.name}">Upgrade</button>
    `;
    buildingsList.appendChild(buildingDiv);
  });
}

// Event listener for building upgrades
buildingsView?.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && e.target.dataset.name) {
    const buildingName = e.target.dataset.name;
    const building = buildings.find((b) => b.name === buildingName);

    if (building.level < building.maxLevel) {
      building.level++;
      renderBuildings(building.category); // Re-render the category
    } else {
      alert(`${building.name} is already at max level.`);
    }
  }
});

// Troops page
function loadTroopsPage() {
  content.innerHTML = "";

  if (troopsView) {
    content.appendChild(troopsView);

    troopsView.classList.remove("hidden");
    troopsView.classList.add("active");
  } else {
    console.error("Troops view not found!");
  }
}

// Map page
function loadMapPage() {
  console.log("Loading map...");
  clearContent(); // Clear previous content
  if (!currentUser) {
    console.error("No user is logged in.");
    return;
  }

  const mapContainer = document.getElementById("map-container");
  if (mapContainer) {
    mapContainer.classList.remove("hidden"); // Ensure the map is visible
    mapContainer.classList.add("visible");

    const mapElement = document.getElementById("map");
    if (mapElement) mapElement.style.display = "grid"; // Show the map

    // Assuming renderMap is defined elsewhere
    // renderMap(spaceMap, offsetX, offsetY);
  } else {
    console.error("Map container not found!");
  }
}

// Initialize the game data on page load
initializeGameData();
