let localization;

async function loadLocalization() {
  const response = await fetch("../data/localization.json");
  if (response.ok) {
    localization = await response.json();
    console.log("game.js localization loaded:", localization);
  } else {
    console.error("Failed to load localization file.");
  }
}

loadLocalization();
