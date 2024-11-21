const factions = {
  mercury: {
    name: "Mercury",
    description: "Speed and Precision",
    units: [
      { name: "Solar Glider", speed: 10, attack: 5, defense: 2 },
      { name: "Photon Blaster", speed: 7, attack: 8, defense: 3 },
      { name: "Mercurial Predator", speed: 9, attack: 6, defense: 4 },
    ],
  },
  venus: {
    name: "Venus",
    description: "Toxicity and Control",
    units: [
      { name: "Acid Drone", speed: 5, attack: 6, defense: 2 },
      { name: "Cloudcaster", speed: 4, attack: 7, defense: 4 },
      { name: "Venusian Behemoth", speed: 3, attack: 10, defense: 8 },
    ],
  },
  earth: {
    name: "Earth",
    description: "Balance and Resilience",
    units: [
      { name: "Terran Infantry", speed: 6, attack: 6, defense: 6 },
      { name: "Orbital Defender", speed: 5, attack: 7, defense: 8 },
      { name: "Earth Titan", speed: 3, attack: 9, defense: 10 },
    ],
  },
  mars: {
    name: "Mars",
    description: "Offense and Industry",
    units: [
      { name: "Sand Raider", speed: 8, attack: 7, defense: 4 },
      { name: "Forge Walker", speed: 4, attack: 8, defense: 7 },
      { name: "Mars Colossus", speed: 2, attack: 10, defense: 9 },
    ],
  },
  jupiter: {
    name: "Jupiter",
    description: "Massive and Overwhelming",
    units: [
      { name: "Graviton Soldier", speed: 4, attack: 7, defense: 9 },
      { name: "Thundercruiser", speed: 5, attack: 10, defense: 6 },
      { name: "Jovian Leviathan", speed: 2, attack: 12, defense: 12 },
    ],
  },
  saturn: {
    name: "Saturn",
    description: "Stealth and Illusion",
    units: [
      { name: "Shadow Operative", speed: 7, attack: 6, defense: 3 },
      { name: "Hologram Drone", speed: 6, attack: 5, defense: 2 },
      { name: "Ring Warden", speed: 5, attack: 8, defense: 9 },
    ],
  },
  uranus: {
    name: "Uranus",
    description: "Cold and Defensive",
    units: [
      { name: "Frost Guard", speed: 4, attack: 5, defense: 10 },
      { name: "Cryo Cannon", speed: 3, attack: 8, defense: 7 },
      { name: "Uranian Sentinel", speed: 2, attack: 9, defense: 12 },
    ],
  },
  neptune: {
    name: "Neptune",
    description: "Mystical and Subtle",
    units: [
      { name: "Stormcaller", speed: 6, attack: 7, defense: 4 },
      { name: "Tidewalker", speed: 5, attack: 6, defense: 7 },
      { name: "Neptunian Oracle", speed: 4, attack: 8, defense: 5 },
    ],
  },
  pluto: {
    name: "Pluto",
    description: "Outsiders and Chaotic",
    units: [
      { name: "Voidling", speed: 9, attack: 6, defense: 2 },
      { name: "Entropy Engine", speed: 5, attack: 8, defense: 6 },
      { name: "Plutonian Reaver", speed: 4, attack: 10, defense: 7 },
    ],
  },
};

export default factions;
