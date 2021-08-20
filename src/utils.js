const crypto = require("crypto");

const generateToken = (size = 20) => crypto.randomBytes(size).toString('hex');
exports.generateToken = generateToken;