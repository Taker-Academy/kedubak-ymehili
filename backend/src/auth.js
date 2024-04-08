const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require('./models');

router.post('/auth/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ ok: false, error: 'Mauvaise requête, paramètres manquants ou invalides.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(401).json({ ok: false, error: 'Mauvais identifiants.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        createdAt: new Date(),
        email,
        firstName,
        lastName,
        password: hashedPassword,
        lastUpVote: new Date() - 60000,
        _id: new mongoose.Types.ObjectId()
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
            message: 'Utilisateur créé avec succès.',
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
        console.log(error);
        res.status(500).json({ ok: false, error: 'Erreur interne du serveur.' });
    }
});

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ ok: false, error: 'Mauvaise requête, paramètres manquants ou invalides.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && (await bcrypt.compare(password, existingUser.password))) {
        firstName = existingUser.firstName;
        lastName = existingUser.lastName;
    } else {
        return res.status(401).json({ ok: false, error: 'Mauvais identifiants.', });
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
            message: 'Connexion réussie.'
        });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Erreur interne du serveur.' });
    }
});

module.exports = router;