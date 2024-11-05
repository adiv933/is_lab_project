const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const dataFile = './data.json';

const readData = () => {
    if (fs.existsSync(dataFile)) {
        const data = fs.readFileSync(dataFile);
        return JSON.parse(data);
    }
    return [];
};

const writeData = (data) => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

app.post('/register', async (req, res) => {
    // console.log('req.body inside register: ', req.body)
    const { email, pin, fullname, type, number, balance } = req.body;
    const users = readData();

    const userExists = users.find((user) => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    const newUser = {
        email,
        pin: hashedPin,
        fullname,
        type,
        number,
        balance,
        isAdmin: false,
        transactions: [],
    };

    users.push(newUser);
    writeData(users);

    res.status(201).json({ message: 'User registered successfully' });
});


app.post('/login', async (req, res) => {
    const { number, pin } = req.body;
    // console.log(req.body)
    const users = readData();

    const user = users.find((user) => user.number === number);
    if (!user) {
        return res.status(400).json({ message: 'Invalid account number or PIN' });
    }

    let isPinValid = await bcrypt.compare(pin, user.pin);
    // isPinValid = pin === user.pin
    if (!isPinValid) {
        return res.status(400).json({ message: 'Invalid account number or PIN' });
    }

    res.status(200).json({
        message: 'Login successful',
        isAdmin: user.isAdmin,
        user: user
    });
});


app.get('/user', (req, res) => {
    const { email } = req.query;
    const users = readData();

    const user = users.find((user) => user.email === email);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const userDetails = {
        fullname: user.fullname,
        type: user.type,
        number: user.number,
        balance: user.balance,
        transactions: user.transactions,
    };

    res.status(200).json(userDetails);
});

// app.get("/", (req, res) => {
//     res.json({ "msg": "help" })
// })

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
