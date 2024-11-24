export const buildings = [
  {
    id: "refinery",
    category: "resourceManagement",
    baseCost: { minerals: 200, energy: 50 },
    productionRate: (level) => level * 5, // 5 Minerals per level
    maxLevel: 20,
  },
  {
    id: "crystalMine",
    category: "resourceManagement",
    baseCost: { energy: 50, minerals: 100 },
    productionRate: (level) => level * 3, // 3 Crystals per level
    maxLevel: 15,
  },
  {
    id: "hydroPlant",
    category: "resourceManagement",
    baseCost: { energy: 50, minerals: 100 },
    productionRate: (level) => level * 4, // 4 Hydrogen per level
    maxLevel: 15,
  },
  {
    id: "mineralDepot",
    category: "resourceManagement",
    baseCost: { minerals: 100, energy: 50 },
    storageCapacity: (level) => level * 200, // Stores 200 Minerals per level
    maxLevel: 20,
  },
  {
    id: "crystalStorage",
    category: "resourceManagement",
    baseCost: { minerals: 150, energy: 50 },
    storageCapacity: (level) => level * 150, // Stores 150 Crystals per level
    maxLevel: 15,
  },
  {
    id: "aquaTank",
    category: "resourceManagement",
    baseCost: { minerals: 100, energy: 50 },
    storageCapacity: (level) => level * 100, // Stores 100 Hydrogen per level
    maxLevel: 15,
  },
  {
    id: "solarArray",
    category: "resourceManagement",
    baseCost: { minerals: 50, energy: 100 },
    productionRate: (level) => level * 20, // 20 Energy per level
    maxLevel: 20,
  },
  {
    id: "shipyard",
    category: "troopHandling",
    baseCost: { minerals: 500, energy: 200 },
    troopOutput: (level) => level * 2, // Produces 2 ships per level
    maxLevel: 20,
  },
  {
    id: "satelliteFactory",
    category: "troopHandling",
    baseCost: { energy: 300, minerals: 300 },
    defenseOutput: (level) => level * 1, // Produces 1 satellite per level
    maxLevel: 20,
  },
  {
    id: "shieldGenerator",
    category: "defense",
    baseCost: { minerals: 700, energy: 300 },
    defenseBoost: (level) => level * 2, // 2% damage reduction per level
    maxLevel: 15,
  },
  {
    id: "turretNetwork",
    category: "defense",
    baseCost: { minerals: 500, energy: 200 },
    defenseBoost: (level) => level * 3, // 3% damage boost per level
    maxLevel: 15,
  },
  {
    id: "sensorTower",
    category: "defense",
    baseCost: { energy: 200, minerals: 100 },
    detectionRange: (level) => level * 50, // 50 units of range per level
    maxLevel: 10,
  },
  {
    id: "plasmaExtractor",
    category: "research",
    baseCost: { hydrogen: 200, minerals: 100 },
    plasmaOutput: (level) => level * 2, // Generates 2 Plasma per level
    maxLevel: 10,
  },
  {
    id: "researchLab",
    category: "research",
    baseCost: { energy: 300, minerals: 200 },
    researchBonus: (level) => level * 5, // Placeholder for research effect
    maxLevel: 10,
  },
];
