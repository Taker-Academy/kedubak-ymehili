const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./models');

router.post('/auth/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            error:
                'A user with this email already exists.'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        createdAt: new Date(),
        _id: new mongoose.Types.ObjectId(),
        email,
        firstName,
        lastName,
        password: hashedPassword,
    });

    try {
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Authorization', 'Bearer ' + token);

        res.status(201).json({
            ok: true,
            data: {
                token,
                user: {
                    email,
                    firstName,
                    lastName,
                },
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login route
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && (await bcrypt.compare(password, existingUser.password))) {
        firstName = existingUser.firstName;
        lastName = existingUser.lastName;
    } else {
        return res.status(400).json({
            error: 'Invalid email or password.',
        });
    }

    try {
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Authorization', 'Bearer ' + token);

        res.status(200).json({
            ok: true,
            data: {
                token,
                user: {
                    email,
                    firstName,
                    lastName,
                },
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;