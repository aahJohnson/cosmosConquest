console.log("DOM fully loaded and parsed");

// Global variable to store logged-in user data
let currentUser = null;

// Ensure all DOM elements are queried after DOM is fully loaded
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const showLoginForm = document.getElementById("showLoginForm");
const showRegisterForm = document.getElementById("showRegisterForm");
const content = document.getElementById("content");
const buildingsView = document.querySelector("#buildings-view");
const buildingsList = document.getElementById("buildings-list");
const troopsView = document.querySelector("#troops-view");

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
  renderBuildings();
}

// Troops page
function loadTroopsPage() {
  content.innerHTML = "";

  if (buildingsView) {
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
  mapContainer.classList.remove("hidden"); // Ensure the map is visible
  mapContainer.classList.add("visible");

  const mapElement = document.getElementById("map");
  mapElement.style.display = "grid"; // Show the map

  renderMap(spaceMap, offsetX, offsetY); // Render the map
}

document.getElementById("mapButton").addEventListener("click", () => {
  const mapContainer = document.getElementById("map-container");
  mapContainer.classList.toggle("visible");
  // Ensure the map retains grid display
  mapContainer.style.display = "grid";
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
    button.classList.remove("visible");
  });

  // Add 'active' class to the clicked button
  const activeButton = document.getElementById(buttonId);
  if (activeButton) {
    activeButton.classList.add("visible");
  }
}

// Handle category buttons
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

const buildings = [
  // Resource Management
  {
    name: "Refinery",
    category: "Resource Management",
    description: "Extracts and processes Minerals for construction and troops.",
    level: 0,
    maxLevel: 20,
    baseCost: { minerals: 200, energy: 50 },
    productionRate: (level) => level * 5, // 5 Minerals per level
  },
  {
    name: "Crystal Mine",
    category: "Resource Management",
    description: "Harvests Crystals from beneath the surface.",
    level: 0,
    maxLevel: 15,
    baseCost: { energy: 50, minerals: 100 },
    productionRate: (level) => level * 3, // 3 Crystals per level
  },
  {
    name: "Hydro Plant",
    category: "Resource Management",
    description: "Generates Hydrogen for advanced constructions.",
    level: 0,
    maxLevel: 15,
    baseCost: { energy: 50, minerals: 100 },
    productionRate: (level) => level * 4, // 4 Hydrogen per level
  },
  {
    name: "Mineral Depot",
    category: "Resource Management",
    description: "Stores excess Minerals for future use.",
    level: 0,
    maxLevel: 20,
    baseCost: { minerals: 100, energy: 50 },
    storageCapacity: (level) => level * 200, // Stores 200 Minerals per level
  },
  {
    name: "Crystal Storage",
    category: "Resource Management",
    description: "Secures Crystals for technological advancements.",
    level: 0,
    maxLevel: 15,
    baseCost: { minerals: 150, energy: 50 },
    storageCapacity: (level) => level * 150, // Stores 150 Crystals per level
  },
  {
    name: "Aqua Tank",
    category: "Resource Management",
    description: "Holds Hydrogen reserves for production and troops.",
    level: 0,
    maxLevel: 15,
    baseCost: { minerals: 100, energy: 50 },
    storageCapacity: (level) => level * 100, // Stores 100 Hydrogen per level
  },
  {
    name: "Solar Array",
    category: "Resource Management",
    description: "Generates Energy to maintain buildings and troops.",
    level: 0,
    maxLevel: 20,
    baseCost: { minerals: 50, energy: 100 },
    productionRate: (level) => level * 20, // 20 Energy per level
  },

  // Troop Handling
  {
    name: "Shipyard",
    category: "Troop Handling",
    description: "Constructs offensive ships for planetary conquest.",
    level: 0,
    maxLevel: 20,
    baseCost: { minerals: 500, energy: 200 },
    troopOutput: (level) => level * 2, // Produces 2 ships per level
  },
  {
    name: "Satellite Factory",
    category: "Troop Handling",
    description: "Manufactures defensive satellites to guard your planet.",
    level: 0,
    maxLevel: 20,
    baseCost: { energy: 300, minerals: 300 },
    defenseOutput: (level) => level * 1, // Produces 1 satellite per level
  },

  // Defense
  {
    name: "Shield Generator",
    category: "Defense",
    description: "Projects a shield to protect your resources from attacks.",
    level: 0,
    maxLevel: 15,
    baseCost: { minerals: 700, energy: 300 },
    defenseBoost: (level) => level * 2, // 2% damage reduction per level
  },
  {
    name: "Turret Network",
    category: "Defense",
    description: "Deploys stationary turrets for planetary defense.",
    level: 0,
    maxLevel: 15,
    baseCost: { minerals: 500, energy: 200 },
    defenseBoost: (level) => level * 3, // 3% damage boost per level
  },
  {
    name: "Sensor Tower",
    category: "Defense",
    description: "Detects incoming fleets and provides tactical data.",
    level: 0,
    maxLevel: 10,
    baseCost: { energy: 200, minerals: 100 },
    detectionRange: (level) => level * 50, // 50 units of range per level
  },

  // Research
  {
    name: "Plasma Extractor",
    category: "Research",
    description: "Generates Plasma for research and advanced upgrades.",
    level: 0,
    maxLevel: 10,
    baseCost: { hydrogen: 200, minerals: 100 },
    plasmaOutput: (level) => level * 2, // Generates 2 Plasma per level
  },
  {
    name: "Research Lab",
    category: "Research",
    description: "Develops new technologies to enhance your operations.",
    level: 0,
    maxLevel: 10,
    baseCost: { energy: 300, minerals: 200 },
    researchBonus: (level) => level * 5, // Placeholder for research effect
  },
];

// Initial render
renderBuildings();

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

buildingsView.addEventListener("click", (e) => {
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

function hideMap() {
  document.getElementById("map").style.display = "none"; // Hide map
  document.getElementById("content").style.display = "block"; // Show content
}

function clearViews() {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.add("hidden"); // Hide all other views
    view.classList.remove("visible");
  });

  // Ensure the map is initially hidden when clearing
  document.getElementById("map").style.display = "none";
  document.getElementById("content").style.display = "block";
}

function clearContent() {
  document.getElementById("content").innerHTML = ""; // Clear the content area
  const mapContainer = document.getElementById("map-container");
  mapContainer.classList.remove("visible");
  mapContainer.classList.add("hidden");
}

const roles = [
  {
    name: "Gas",
    description: "Strategists excelling in guerrilla tactics and hidden bases.",
    image: "media/planets/gasPlanet.webp",
  },
  {
    name: "Ice",
    description: "Strong on diplomacy and trade.",
    image: "media/planets/icePlanet.webp",
  },
  {
    name: "Volcanic",
    description:
      "Balanced approach to defense, resource gathering, and technology.",
    image: "media/planets/volcanicPlanet.webp",
  },
  {
    name: "Rocky",
    description: "High focus on energy production and troop strength.",
    image: "media/planets/rockyPlanet.webp",
  },
  {
    name: "Ocean",
    description: "Immense strength in defense and resource extraction.",
    image: "media/planets/oceanPlanet.webp",
  },
];

let currentRoleIndex = 0;

function updateRoleDisplay() {
  const role = roles[currentRoleIndex];
  const carouselContent = document.querySelector(".carousel-content");

  // Update role details
  document.getElementById("role-name").textContent = role.name;
  document.getElementById("role-description").textContent = role.description;

  // Clear existing carousel content
  carouselContent.innerHTML = "";

  // Populate the carousel with reordered roles
  const orderedRoles = [
    roles[(currentRoleIndex - 1 + roles.length) % roles.length], // Previous role
    roles[currentRoleIndex], // Current role
    roles[(currentRoleIndex + 1) % roles.length], // Next role
  ];

  orderedRoles.forEach((role, index) => {
    const roleCard = document.createElement("div");
    roleCard.classList.add("role-card");
    if (index === 1) {
      roleCard.classList.add("visible"); // Highlight the active role
    }

    const img = document.createElement("img");
    img.src = role.image;
    img.alt = role.name;

    roleCard.appendChild(img);
    carouselContent.appendChild(roleCard);
  });

  // Move the carousel visually
  carouselContent.style.transform = `translateX(-${150 + 10}px)`; // Adjust translation as needed
}

// Navigation logic
document.getElementById("prevRole").addEventListener("click", () => {
  currentRoleIndex = (currentRoleIndex - 1 + roles.length) % roles.length;
  updateRoleDisplay();
});

document.getElementById("nextRole").addEventListener("click", () => {
  currentRoleIndex = (currentRoleIndex + 1) % roles.length;
  updateRoleDisplay();
});

// Initialize the carousel on page load
updateRoleDisplay();
