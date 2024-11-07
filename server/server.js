const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  fullname: { type: String, required: true },
  type: { type: String, required: true },
  number: { type: Number, required: true, unique: true },
  balance: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  transactions: { type: Array, default: [] },
});

const User = mongoose.model("User", userSchema);

// Register endpoint
app.post("/register", async (req, res) => {
  const { email, pin, fullname, type, number, balance } = req.body;
  //   console.log("req.body", req.body);

  // Validate input data
  if (
    !email ||
    !pin ||
    !fullname ||
    !type ||
    !number ||
    balance === undefined
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the PIN with bcrypt
    let hashedPin;
    try {
      hashedPin = await bcrypt.hash(pin, 10);
    } catch (hashError) {
      return res
        .status(500)
        .json({ message: "Error hashing PIN", error: hashError.message });
    }

    // Create a new user
    const newUser = new User({
      email,
      pin: hashedPin,
      fullname,
      type,
      number,
      balance,
      isAdmin: false,
      transactions: [],
    });

    // Save the new user to the database
    try {
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (saveError) {
      res.status(500).json({
        message: "Error saving user to the database",
        error: saveError.message,
      });
    }
  } catch (error) {
    // General error handler for unexpected issues
    res
      .status(500)
      .json({ message: "An unexpected error occurred", error: error.message });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { number, pin } = req.body;
  //   console.log("req.body", req.body);

  try {
    const user = await User.findOne({ number });
    if (!user) {
      return res.status(400).json({ message: "Invalid account number or PIN" });
    }
    // console.log("user", user);

    const isPinValid = await bcrypt.compare(pin, user.pin);
    if (!isPinValid) {
      return res.status(400).json({ message: "Invalid account number or PIN" });
    }

    res.status(200).json({
      message: "Login successful",
      isAdmin: user.isAdmin,
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

//get all users
app.get("/users", async (req, res) => {
  try {
    ``;
    // Fetch all users from the database
    const users = await User.find({});

    // If no users found, return an empty array
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Send the list of users as a JSON response
    res.status(200).json(users);
  } catch (error) {
    // Handle any errors during the retrieval
    res
      .status(500)
      .json({ message: "Error retrieving users", error: error.message });
  }
});

// Get User endpoint
app.get("/user", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDetails = {
      fullname: user.fullname,
      type: user.type,
      number: user.number,
      balance: user.balance,
      transactions: user.transactions,
    };

    res.status(200).json(userDetails);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
