import localization from "../data/localization.json";

export function getLocalizedText(language, category, key) {
  return localization[language]?.[category]?.[key] || key;
}
