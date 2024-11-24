import { getLocalizedText } from "./utils.js";
import { buildings } from "../data/buildings.js";
import { units } from "../data/units.js";

const currentLanguage = "en"; // Change dynamically based on user preference

buildings.forEach((building) => {
  const name = getLocalizedText(currentLanguage, "buildings", building.name);
  const description = getLocalizedText(
    currentLanguage,
    "buildings",
    building.description
  );
  console.log(`Building: ${name} - ${description}`);
});

units.forEach((unit) => {
  const name = getLocalizedText(currentLanguage, "units", unit.name);
  const description = getLocalizedText(
    currentLanguage,
    "units",
    unit.description
  );
  console.log(`Unit: ${name} - ${description}`);
});
