import factions from "./factions.js";

// Initialize Game
function startGame() {
  const playerFaction = factions.mercury; // Example: Player chooses Mercury
  console.log(`You selected the ${playerFaction.name} faction!`);
  console.log("Your Units:", playerFaction.units);
}

// Battle Simulation Example
function battle(unit1, unit2) {
  const unit1Power = unit1.attack - unit2.defense;
  const unit2Power = unit2.attack - unit1.defense;

  if (unit1Power > unit2Power) {
    console.log(`${unit1.name} wins!`);
  } else if (unit2Power > unit1Power) {
    console.log(`${unit2.name} wins!`);
  } else {
    console.log("It's a draw!");
  }
}

// Start the game
startGame();
