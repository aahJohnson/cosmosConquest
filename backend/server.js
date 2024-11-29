require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL; // From your Supabase settings
const supabaseKey = process.env.SUPABASE_KEY; // Anon or service key
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase URL:", process.env.SUPABASE_URL);
console.log("Supabase Key:", process.env.SUPABASE_KEY);

// Routes
app.get("/", (req, res) => {
  res.send("Backend for OuterSide is running!");
});

// Create a New User
app.post("/api/users", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if the username or email already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .or(`username.eq.${username},email.eq.${email}`);

    if (fetchError) throw fetchError;
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Insert the new user
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, email, password, planet_type: role }]);

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Login User
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user by username
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !user || user.password !== password) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Return the user data
    res.status(200).json({
      id: user.id,
      username: user.username,
      planet_type: user.planet_type,
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
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Update Resources (Optional Logic for Future Use)
app.put("/api/users/:id/resources", async (req, res) => {
  const userId = req.params.id;
  const { minerals, crystals, hydrogen, plasma, energy } = req.body;

  try {
    const { data, error } = await supabase
      .from("resources")
      .update({ minerals, crystals, hydrogen, plasma, energy })
      .eq("user_id", userId);

    if (error) throw error;

    res.json(data[0]);
  } catch (err) {
    console.error("Error updating resources:", err);
    res.status(500).json({ error: "Failed to update resources" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
