require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test Database Connection
pool.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Connected to the PostgreSQL database");
  }
});

// Routes
app.get("/", (req, res) => {
  res.send("Backend for Cosmos Conquest is running!");
});

// Create a New User
app.post("/api/users", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if the username or email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Insert the new user
    const result = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, password, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Login User
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Validate password (in plain text for now)
    const user = result.rows[0];
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Return the user data
    res.status(200).json({
      id: user.id,
      username: user.username,
      role: user.role,
      building_progress: user.building_progress,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Failed to log in" });
  }
});

// Get User by ID
app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
