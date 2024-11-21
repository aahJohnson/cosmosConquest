const MAP_SIZE = 1000; // Map size (1000x1000)
let BASE_SECTOR_SIZE = 12; // Default sector size (zoom level 2)

// Zoom levels
const ZOOM_LEVELS = {
  1: 50, // Zoomed-in
  2: 12, // Default zoom
  3: 6, // Zoomed-out
};
let currentZoom = 2; // Start at default zoom level

const SECTOR_TYPES = ["empty", "asteroids", "nebula"];

// Generate Map
function createMap(size) {
  const map = [];
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      const type =
        SECTOR_TYPES[Math.floor(Math.random() * SECTOR_TYPES.length)];
      row.push({
        x,
        y,
        type,
      });
    }
    map.push(row);
  }
  return map;
}

// Wrap Coordinate to Ensure Looping
function wrapCoordinate(coord, max) {
  return (coord + max) % max;
}

// Render Map to Fill Screen
function renderMap(map, offsetX = 0, offsetY = 0) {
  const mapContainer = document.getElementById("map");
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Calculate number of visible sectors
  const sectorsX = Math.ceil(screenWidth / BASE_SECTOR_SIZE);
  const sectorsY = Math.ceil(screenHeight / BASE_SECTOR_SIZE);

  // Clear previous content
  mapContainer.innerHTML = "";
  mapContainer.style.gridTemplateColumns = `repeat(${sectorsX}, ${BASE_SECTOR_SIZE}px)`;
  mapContainer.style.gridTemplateRows = `repeat(${sectorsY}, ${BASE_SECTOR_SIZE}px)`;

  // Dynamically adjust grid gap based on zoom level
  mapContainer.style.gridGap = BASE_SECTOR_SIZE >= 50 ? "0" : "2px";

  // Render visible sectors
  for (let y = 0; y < sectorsY; y++) {
    for (let x = 0; x < sectorsX; x++) {
      const wrappedX = wrapCoordinate(x + offsetX, MAP_SIZE);
      const wrappedY = wrapCoordinate(y + offsetY, MAP_SIZE);

      const tile = map[wrappedY][wrappedX];
      const sectorDiv = document.createElement("div");
      sectorDiv.classList.add("sector", tile.type);
      sectorDiv.style.width = `${BASE_SECTOR_SIZE}px`;
      sectorDiv.style.height = `${BASE_SECTOR_SIZE}px`;
      mapContainer.appendChild(sectorDiv);
    }
  }
}

// Initialize Map
const spaceMap = createMap(MAP_SIZE);

// Dragging Variables
let isDragging = false;
let startX, startY;
let offsetX = 0,
  offsetY = 0;
let dragOffsetX = 0,
  dragOffsetY = 0;

const mapContainer = document.getElementById("map");

// Event Listeners for Dragging
mapContainer.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  dragOffsetX = offsetX;
  dragOffsetY = offsetY;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  // Calculate how much the mouse has moved
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  // Update the offsets to move at the same speed as the mouse
  offsetX = wrapCoordinate(
    dragOffsetX - Math.floor(dx / BASE_SECTOR_SIZE),
    MAP_SIZE
  );
  offsetY = wrapCoordinate(
    dragOffsetY - Math.floor(dy / BASE_SECTOR_SIZE),
    MAP_SIZE
  );

  renderMap(spaceMap, offsetX, offsetY);
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

// Ensure Map Resizes with Screen
window.addEventListener("resize", () => renderMap(spaceMap, offsetX, offsetY));

// Zoom Logic
function zoomMap(direction) {
  // Adjust the zoom level
  if (direction === "in" && currentZoom > 1) {
    currentZoom--;
  } else if (direction === "out" && currentZoom < 3) {
    currentZoom++;
  }

  // Update the sector size based on the zoom level
  BASE_SECTOR_SIZE = ZOOM_LEVELS[currentZoom];

  // Re-render the map with the new zoom level
  renderMap(spaceMap, offsetX, offsetY);
}

// Add Event Listeners for Zoom Buttons
document
  .getElementById("zoom-in")
  .addEventListener("click", () => zoomMap("in"));
document
  .getElementById("zoom-out")
  .addEventListener("click", () => zoomMap("out"));

// Render Initial Map
renderMap(spaceMap);

// Coordinate Box Logic
const coordinateBox = document.getElementById("coordinate-box");

function showCoordinates(e) {
  const mapRect = mapContainer.getBoundingClientRect();
  const mouseX = e.clientX - mapRect.left;
  const mouseY = e.clientY - mapRect.top;

  // Calculate the hovered sector's coordinates
  const sectorX = Math.floor(mouseX / BASE_SECTOR_SIZE);
  const sectorY = Math.floor(mouseY / BASE_SECTOR_SIZE);

  if (
    sectorX >= 0 &&
    sectorY >= 0 &&
    sectorX < MAP_SIZE &&
    sectorY < MAP_SIZE
  ) {
    const wrappedX = wrapCoordinate(sectorX + offsetX, MAP_SIZE);
    const wrappedY = wrapCoordinate(sectorY + offsetY, MAP_SIZE);

    // Update the coordinate box text and make it visible
    coordinateBox.textContent = `Coords: (${wrappedX}, ${wrappedY})`;
    coordinateBox.style.display = "block";
  } else {
    coordinateBox.style.display = "none"; // Hide if outside map bounds
  }
}

function hideCoordinates() {
  coordinateBox.style.display = "none";
}

// Attach event listeners for mouse tracking
mapContainer.addEventListener("mousemove", showCoordinates);
mapContainer.addEventListener("mouseleave", hideCoordinates);

// Integration with Sidebar
document.getElementById("mapButton").addEventListener("click", () => {
  document.getElementById("map-container").classList.add("visible");
  renderMap(spaceMap, offsetX, offsetY); // Re-render map when toggling view
});
