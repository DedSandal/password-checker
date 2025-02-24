const express = require('express');
const bodyParser = require('body-parser');
const commonPasswords = require('./const.js');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function calculatePasswordStrength(
    isCommon,
    hasRepetitions,
    hasLowercase,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
    isMinLength6,
    isMinLength12
) {
    if (isCommon || hasRepetitions || !isMinLength6) return "weak";
    if (hasLowercase && hasUppercase && hasNumber && hasSpecialChar) {
        return isMinLength12 ? "strong" : "medium";
    }
    return "weak";
}

function hasRepeatedSequences(password) {
    return /(.)\1{2,}/.test(password); // Checks for three or more repeated characters
}

function isCommonPassword(password) {
    return commonPasswords.has(password.toLowerCase());
}

app.post('/check-password', (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    const hasRepetitions = hasRepeatedSequences(password);
    const isCommon = isCommonPassword(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[$-/:-?{-~!"^_`\[\]]/.test(password);
    const isMinLength6 = password.length >= 6;
    const isMinLength8 = password.length >= 8;
    const isMinLength12 = password.length >= 12;
    const strength = calculatePasswordStrength(
        isCommon,
        hasRepetitions,
        hasLowercase,
        hasUppercase,
        hasNumber,
        hasSpecialChar,
        isMinLength6,
        isMinLength12,
    );

    res.json({
        strength,
        hasRepetitions,
        isCommonPassword: isCommon,
        hasLowercase,
        hasUppercase,
        hasNumber,
        hasSpecialChar,
        isMinLength8,
        isMinLength12
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
