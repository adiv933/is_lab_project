const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

const transactionSchema = new mongoose.Schema({
    data: { type: String, required: true }, // Store encrypted transaction data as a string
});

// Define the user schema with public key and transactions
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    pin: { type: String, required: true },
    fullname: { type: String, required: true },
    type: { type: String, required: true },
    number: { type: Number, required: true, unique: true },
    balance: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
    publicKey: { type: String, required: true }, // Public key for encryption
    transactions: { type: [transactionSchema], default: [] },
});

const User = mongoose.model('User', userSchema);

// Register endpoint
app.post('/register', async (req, res) => {
    const { email, pin, fullname, type, number, balance } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPin = await bcrypt.hash(pin, 10);

        const newUser = new User({
            email,
            pin: hashedPin,
            fullname,
            type,
            number,
            balance,
            isAdmin: false,
            publicKey: process.env.PUBLIC_KEY,
            transactions: [],
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    console.log(`Login request made using Account number: ${req.body.number} and PIN: ${req.body.pin}`)
    const { number, pin } = req.body;

    try {
        const user = await User.findOne({ number });
        if (!user) {
            return res.status(400).json({ message: 'Invalid account number or PIN' });
        }

        const isPinValid = await bcrypt.compare(pin, user.pin);
        if (!isPinValid) {
            return res.status(400).json({ message: 'Invalid account number or PIN' });
        }

        res.status(200).json({
            message: 'Login successful',
            isAdmin: user.isAdmin,
            user: user,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Get all Users 
app.get('/all', async (req, res) => {
    try {
        const users = await User.find({}, '-pin'); // Exclude the PIN for security
        res.status(200).json({ message: 'Users fetched successfully', users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});
app.get('/', async (req, res) => {
    console.log(req)
    res.status(200).json({
        message: 'hello'
    });
});




// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
