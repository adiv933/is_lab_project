const crypto = require('crypto');
require('dotenv').config();

// Generate a public/private key pair
const publicKey = process.env.PUBLIC_KEY
const privateKey = process.env.PRIVATE_KEY

// Function to encrypt data using the public key
function encryptData(publicKey, data) {
    const buffer = Buffer.from(data, 'utf-8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
}

// Function to decrypt data using the private key
function decryptData(privateKey, encryptedData) {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf-8');
}

// Sample data to encrypt
const sampleData = "This is a message";

// Encrypt the sample data
const encryptedData = encryptData(publicKey, sampleData);
console.log("\nEncrypted Data:", encryptedData + "\n");

// Decrypt the encrypted data
const decryptedData = decryptData(privateKey, encryptedData);
console.log("Decrypted Data:", decryptedData);
