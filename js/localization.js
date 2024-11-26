async function applyLocalization(language = "en") {
  try {
    const response = await fetch(`../data/localization.json`);
    if (!response.ok) {
      throw new Error(
        `Failed to load localization file: ${response.statusText}`
      );
    }

    const localizationData = await response.json();
    const localizedContent = localizationData[language];

    if (!localizedContent) {
      console.error(`Localization data for language "${language}" not found.`);
      return;
    }

    // Apply text content
    document.querySelectorAll("[data-localize]").forEach((element) => {
      const key = element.getAttribute("data-localize");
      if (localizedContent[key]) {
        element.textContent = localizedContent[key];
      } else {
        console.warn(`No localization found for key "${key}".`);
      }
    });

    // Apply placeholders
    document
      .querySelectorAll("[data-localize-placeholder]")
      .forEach((element) => {
        const key = element.getAttribute("data-localize-placeholder");
        if (localizedContent[key]) {
          element.setAttribute("placeholder", localizedContent[key]);
        } else {
          console.warn(`No localization found for placeholder key "${key}".`);
        }
      });
  } catch (error) {
    console.error("Error applying localization:", error);
  }
}

// Automatically apply localization on page load
document.addEventListener("DOMContentLoaded", () => applyLocalization());
