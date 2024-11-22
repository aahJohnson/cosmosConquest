const MAP_SIZE = 1000; // Map size (1000x1000)
const SECTOR_SIZE = 12; // Sector size in pixels

const SECTOR_TYPES = ["empty", "asteroids", "nebula", "planet"]; // Sector types

// Store the generated map
let spaceMap = [];

// Track the current map offsets
let offsetX = 0;
let offsetY = 0;

// Generate the map once and store it
function generateMap(size) {
  const map = [];
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      const type =
        SECTOR_TYPES[Math.floor(Math.random() * SECTOR_TYPES.length)];
      row.push({ x, y, type });
    }
    map.push(row);
  }
  return map;
}

// Render the map once
function renderMap(map) {
  const mapElement = document.getElementById("map");
  mapElement.style.width = `${MAP_SIZE * SECTOR_SIZE}px`;
  mapElement.style.height = `${MAP_SIZE * SECTOR_SIZE}px`;

  // Clear any existing content
  mapElement.innerHTML = "";

  // Create sectors
  map.forEach((row) => {
    row.forEach((sector) => {
      const sectorDiv = document.createElement("div");
      sectorDiv.classList.add("sector", sector.type);
      sectorDiv.style.width = `${SECTOR_SIZE}px`;
      sectorDiv.style.height = `${SECTOR_SIZE}px`;
      sectorDiv.style.gridRowStart = sector.y + 1;
      sectorDiv.style.gridColumnStart = sector.x + 1;
      mapElement.appendChild(sectorDiv);
    });
  });
}

// Handle dragging to move the map
let isDragging = false;
let startX = 0;
let startY = 0;

const mapContainer = document.getElementById("map-container");

mapContainer.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  offsetX += dx;
  offsetY += dy;

  // Apply translation to map
  const mapElement = document.getElementById("map");
  mapElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

  startX = e.clientX;
  startY = e.clientY;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

// Zoom Logic
let currentZoom = 2; // Start at default zoom level

const ZOOM_LEVELS = {
  1: 50, // Zoomed-in
  2: 12, // Default zoom
  3: 6, // Zoomed-out
};

function zoomMap(direction) {
  if (direction === "in" && currentZoom > 1) {
    currentZoom--;
  } else if (direction === "out" && currentZoom < 3) {
    currentZoom++;
  }

  const newSectorSize = ZOOM_LEVELS[currentZoom];
  const mapElement = document.getElementById("map");

  mapElement.style.width = `${MAP_SIZE * newSectorSize}px`;
  mapElement.style.height = `${MAP_SIZE * newSectorSize}px`;

  const sectors = document.querySelectorAll(".sector");
  sectors.forEach((sector) => {
    sector.style.width = `${newSectorSize}px`;
    sector.style.height = `${newSectorSize}px`;
  });
}

// Add Event Listeners for Zoom Buttons
document
  .getElementById("zoom-in")
  .addEventListener("click", () => zoomMap("in"));
document
  .getElementById("zoom-out")
  .addEventListener("click", () => zoomMap("out"));

// Coordinate Box Logic
const coordinateBox = document.getElementById("coordinate-box");

function showCoordinates(e) {
  const mapRect = mapContainer.getBoundingClientRect();
  const mouseX = e.clientX - mapRect.left;
  const mouseY = e.clientY - mapRect.top;

  const sectorX = Math.floor((mouseX - offsetX) / SECTOR_SIZE);
  const sectorY = Math.floor((mouseY - offsetY) / SECTOR_SIZE);

  if (
    sectorX >= 0 &&
    sectorY >= 0 &&
    sectorX < MAP_SIZE &&
    sectorY < MAP_SIZE
  ) {
    coordinateBox.textContent = `Sector: (${sectorX}, ${sectorY})`;
    coordinateBox.style.display = "block";
  } else {
    coordinateBox.style.display = "none";
  }
}

function hideCoordinates() {
  coordinateBox.style.display = "none";
}

mapContainer.addEventListener("mousemove", showCoordinates);
mapContainer.addEventListener("mouseleave", hideCoordinates);

// Initialize the map
document.addEventListener("DOMContentLoaded", () => {
  spaceMap = generateMap(MAP_SIZE);
  renderMap(spaceMap);
});
