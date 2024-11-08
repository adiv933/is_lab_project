// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const rateLimit = require('express-rate-limit');
// dotenv.config();
// const app = express();

// let count = 0;

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     message: 'Too Many Requests',
//     headers: true,
// });

// app.use(limiter);

// app.use(cors());
// app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser.json());

// const MONGO_URI = process.env.MONGO_URI;
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// mongoose.connect(MONGO_URI)
//     .then(() => console.log('MongoDB connected'))
//     .catch((error) => console.error('MongoDB connection error:', error));

// const transactionSchema = new mongoose.Schema({
//     data: { type: String, required: true },
// });

// // Define the user schema with public key and transactions
// const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     pin: { type: String, required: true },
//     fullname: { type: String, required: true },
//     type: { type: String, required: true },
//     number: { type: Number, required: true, unique: true },
//     balance: { type: Number, default: 0 },
//     isAdmin: { type: Boolean, default: false },
//     publicKey: { type: String, required: true }, // Public key 
//     transactions: { type: [transactionSchema], default: [] },
// });

// const User = mongoose.model('User', userSchema);

// // Register endpoint
// app.post('/register', async (req, res) => {
//     const { email, pin, fullname, type, number, balance } = req.body;

//     try {
//         const userExists = await User.findOne({ email });
//         if (userExists) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         const hashedPin = await bcrypt.hash(pin, 10);

//         const newUser = new User({
//             email,
//             pin: hashedPin,
//             fullname,
//             type,
//             number,
//             balance,
//             isAdmin: false,
//             publicKey: process.env.PUBLIC_KEY,
//             transactions: [],
//         });

//         await newUser.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error registering user', error: error.message });
//     }
// });

// // Login endpoint
// app.post('/login', async (req, res) => {
//     console.log(`Login request made using Account number: ${req.body.number} and PIN: ${req.body.pin}`)
//     const { number, pin } = req.body;

//     try {
//         const user = await User.findOne({ number });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid account number or PIN' });
//         }

//         const isPinValid = await bcrypt.compare(pin, user.pin);
//         if (!isPinValid) {
//             return res.status(400).json({ message: 'Invalid account number or PIN' });
//         }

//         res.status(200).json({
//             message: 'Login successful',
//             isAdmin: user.isAdmin,
//             user: user,
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error logging in', error: error.message });
//     }
// });

// // Get all Users 
// app.get('/all', async (req, res) => {
//     try {
//         const users = await User.find({}, '-pin'); // Exclude the PIN for security
//         res.status(200).json({ message: 'Users fetched successfully', users });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching users', error: error.message });
//     }
// });
// app.get('/', async (req, res) => {
//     count++
//     const ip = req.headers['x-real-ip'] || req.connection.remoteAddress
//     console.log(`${count} : Request from IP Address: ${ip}`)
//     res.status(200).json({
//         message: 'hello'
//     });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();
let count = 0;

// Rate Limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: 'Too Many Requests, try again after 1 minute',
    headers: true,
});

app.use(limiter);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    data: { type: String, required: true },
});

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    pin: { type: String, required: true },
    fullname: { type: String, required: true },
    type: { type: String, required: true },
    number: { type: Number, required: true, unique: true },
    balance: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
    publicKey: { type: String, required: true },
    transactions: { type: [String], default: [] },
    otp: { type: String }, // Store OTP temporarily
    otpExpiry: { type: Date }, // OTP expiration
});

const User = mongoose.model('User', userSchema);

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// OTP Generation Function
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

// Send OTP Email Function
const sendOTPEmail = async (email, otp) => {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP email sent successfully.");
    } catch (error) {
        console.error("Error sending OTP email:", error);
    }
};

// Login Endpoint
app.post('/login', async (req, res) => {
    const { number, pin } = req.body;

    console.log(`Login request made using Account number: ${number} and PIN: ${pin}`)

    try {
        const user = await User.findOne({ number });
        if (!user) {
            // return res.status(400).json({ message: 'Invalid account number or PIN' });
            return res.status(400).json({ message: 'Invalid' });
        }

        const isPinValid = await bcrypt.compare(pin, user.pin);
        if (!isPinValid) {
            // return res.status(400).json({ message: 'Invalid account number or PIN' });
            return res.status(400).json({ message: 'Invalid' });

        }


        if (user && user.email === "admin@admin.com") {
            res.status(200).json({
                message: 'Admin login. Redirecting to main website.',
                isAdmin: user.isAdmin,
                user: user,
            });
            return;
        }

        console.log("pin valid")

        // Generate OTP and set expiration time
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

        console.log("OTP: ", otp)

        // Update user with OTP and expiry
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        console.log('user otp saved')

        // Send OTP to user's email     
        await sendOTPEmail(user.email, otp);

        res.status(200).json({ message: 'OTP sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

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
            publicKey: process.env.AES_SECRET_KEY,
            transactions: [],
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});


// OTP Verification Endpoint
app.post('/verify-otp', async (req, res) => {
    const { number, otp } = req.body;

    try {
        const user = await User.findOne({ number });
        if (!user || !user.otp || !user.otpExpiry) {
            // return res.status(400).json({ message: 'OTP not found or expired. Please log in again.' });
            return res.status(400).json({ message: 'Invalid' });

        }

        // Check if OTP is expired
        if (Date.now() > user.otpExpiry.getTime()) {
            user.otp = null; // Clear expired OTP
            await user.save();
            // return res.status(400).json({ message: 'OTP expired. Please log in again.' });
            return res.status(400).json({ message: 'Invalid' });

        }

        // Verify OTP
        if (user.otp !== otp) {
            // return res.status(400).json({
            //     message: 'Invalid OTP. Please try again.',
            // });
            return res.status(400).json({ message: 'Invalid' });

        }

        // Clear OTP after successful verification
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({
            message: 'OTP verified successfully. Redirecting to main website.',
            isAdmin: user.isAdmin,
            user: user,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
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

// Fund Transfer Endpoint
app.post('/transfer-funds', async (req, res) => {
    const { senderNumber, receiverNumber, amount } = req.body;

    try {
        // Validate positive transfer amount
        if (amount <= 0) return res.status(400).json({ message: 'Invalid transfer amount' });

        // Fetch Sender and Receiver
        const sender = await User.findOne({ number: senderNumber });
        const receiver = await User.findOne({ number: receiverNumber });

        // Ensure users exist and sender has sufficient balance
        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }
        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Perform Transfer
        sender.balance -= amount;
        receiver.balance += amount;

        // Log Transactions
        const date = new Date();

        const senderDetails = `Transfer Rs.${amount} to ${receiver.fullname} #${receiver.number} : ${date}`
        const receiverDetails = `Transfer Rs.${amount} from ${sender.fullname} #${sender.number} : ${date}`

        sender.transactions.push(senderDetails)
        receiver.transactions.push(receiverDetails)

        // Save updated user data
        await sender.save();
        await receiver.save();

        res.status(200).json({ message: 'Transfer successful', sender, receiver });
    } catch (error) {
        res.status(500).json({ message: 'Transfer failed', error: error.message });
    }
});


// Root Endpoint
app.get('/', async (req, res) => {
    count++
    const ip = req.headers['x-real-ip'] || req.connection.remoteAddress
    console.log(`${count} : Request from IP Address: ${ip}`)
    res.status(200).json({
        message: 'hello'
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
