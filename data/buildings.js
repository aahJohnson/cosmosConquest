export const buildings = [
  {
    id: "refinery",
    name: "Mineral Extractor",
    category: "resourceManagement",
    description: "Extracts and processes Minerals for construction and troops",
    image: "../media/buildings/refinery.webp",
    baseCost: { minerals: 200, energy: 50 },
    productionRate: (level) => level * 5, // 5 Minerals per level
    maxLevel: 20,
  },
  {
    id: "crystalMine",
    name: "Crystal Mine",
    category: "resourceManagement",
    description: "Harvests Crystals from beneath the surface",
    image: "../media/buildings/crystalMine.webp",
    baseCost: { energy: 50, minerals: 100 },
    productionRate: (level) => level * 3, // 3 Crystals per level
    maxLevel: 15,
  },
  {
    id: "hydroPlant",
    name: "Hydro Plant",
    category: "resourceManagement",
    description: "Generates Hydrogen for advanced constructions",
    image: "../media/buildings/hydroPlant.webp",
    baseCost: { energy: 50, minerals: 100 },
    productionRate: (level) => level * 4, // 4 Hydrogen per level
    maxLevel: 15,
  },
  {
    id: "mineralDepot",
    name: "Mineral Depot",
    category: "resourceManagement",
    description: "Stores excess Minerals for future use",
    image: "../media/buildings/mineralDepot.webp",
    baseCost: { minerals: 100, energy: 50 },
    storageCapacity: (level) => level * 200, // Stores 200 Minerals per level
    maxLevel: 20,
  },
  {
    id: "crystalStorage",
    name: "Crystal Storage",
    category: "resourceManagement",
    description: "Secures Crystals for technological advancements",
    image: "../media/buildings/crystalStorage.webp",
    baseCost: { minerals: 150, energy: 50 },
    storageCapacity: (level) => level * 150, // Stores 150 Crystals per level
    maxLevel: 15,
  },
  {
    id: "aquaTank",
    name: "Aqua Tank",
    category: "resourceManagement",
    description: "Holds Hydrogen reserves for production and troops",
    image: "../media/buildings/aquaTank.webp",
    baseCost: { minerals: 100, energy: 50 },
    storageCapacity: (level) => level * 100, // Stores 100 Hydrogen per level
    maxLevel: 15,
  },
  {
    id: "solarArray",
    name: "Solar Array",
    category: "resourceManagement",
    description: "Generates Energy to maintain buildings and troops",
    image: "../media/buildings/solarArray.webp",
    baseCost: { minerals: 50, energy: 100 },
    productionRate: (level) => level * 20, // 20 Energy per level
    maxLevel: 20,
  },
  {
    id: "shipyard",
    name: "Shipyard",
    category: "troopHandling",
    description: "Constructs offensive ships for planetary conquest",
    image: "../media/buildings/shipyard.webp",
    baseCost: { minerals: 500, energy: 200 },
    troopOutput: (level) => level * 2, // Produces 2 ships per level
    maxLevel: 20,
  },
  {
    id: "satelliteFactory",
    name: "Satellite Factory",
    category: "troopHandling",
    description: "Manufactures defensive satellites to guard your planet",
    image: "../media/buildings/satelliteFactory.webp",
    baseCost: { energy: 300, minerals: 300 },
    defenseOutput: (level) => level * 1, // Produces 1 satellite per level
    maxLevel: 20,
  },
  {
    id: "shieldGenerator",
    name: "Shield Generator",
    category: "defense",
    description: "Projects a shield to protect your resources from attacks",
    image: "../media/buildings/shieldGenerator.webp",
    baseCost: { minerals: 700, energy: 300 },
    defenseBoost: (level) => level * 2, // 2% damage reduction per level
    maxLevel: 15,
  },
  {
    id: "turretNetwork",
    name: "Turret Network",
    category: "defense",
    description: "Deploys stationary turrets for planetary defense",
    image: "../media/buildings/turretNetwork.webp",
    baseCost: { minerals: 500, energy: 200 },
    defenseBoost: (level) => level * 3, // 3% damage boost per level
    maxLevel: 15,
  },
  {
    id: "sensorTower",
    name: "Sensor Tower",
    category: "defense",
    description: "Detects incoming fleets and provides tactical data",
    image: "../media/buildings/sensorTower.webp",
    baseCost: { energy: 200, minerals: 100 },
    detectionRange: (level) => level * 50, // 50 units of range per level
    maxLevel: 10,
  },
  {
    id: "plasmaExtractor",
    name: "Plasma Extractor",
    category: "research",
    description: "Generates Plasma for research and advanced upgrades",
    image: "../media/buildings/plasmaExtractor.webp",
    baseCost: { hydrogen: 200, minerals: 100 },
    plasmaOutput: (level) => level * 2, // Generates 2 Plasma per level
    maxLevel: 10,
  },
  {
    id: "researchLab",
    name: "Research Lab",
    category: "research",
    description: "Develops new technologies to enhance your operations",
    image: "../media/buildings/researchLab.webp",
    baseCost: { energy: 300, minerals: 200 },
    researchBonus: (level) => level * 5, // Placeholder for research effect
    maxLevel: 10,
  },
];
