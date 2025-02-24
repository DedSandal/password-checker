const express = require('express');
const bodyParser = require('body-parser');
const commonPasswords = require('./const.js');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

function calculatePasswordStrength(password) {
    let passwordStrength = 'weak';

    if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[$-/:-?{-~!"^_`\[\]]/.test(password)) {
        if (password.length >= 12) {
            passwordStrength = 'strong';
        } else if (password.length >= 8) {
            passwordStrength = 'medium';
        }
    }

    return passwordStrength;
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

    const strength = calculatePasswordStrength(password);
    const hasRepetitions = hasRepeatedSequences(password);
    const isCommon = isCommonPassword(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[$-/:-?{-~!"^_`\[\]]/.test(password);
    const isMinLength8 = password.length >= 8;
    const isMinLength12 = password.length >= 12;

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
