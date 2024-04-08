const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Post } = require('./models');

router.get('/user/me', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ ok: false, error: 'Mauvais token JWT.' });
        }

        const user = await User.findById(decoded.id);
        return res.status(200).json({
            ok: true,
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            message: 'Utilisateur récupéré avec succès.',
        });
    } catch (err) {
        return res.status(500).json({ ok: false, error: 'Erreur interne du serveur.' });
    }
});

router.put('/user/edit', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ ok: false, error: 'Mauvais token JWT.' });
        }

        const token = req.headers.authorization.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ ok: false, error: 'Mauvais token JWT.' });
        }

        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(422).json({ ok: false, error: 'Échec de validation des paramètres.' });
        }

        const newPassword = await bcrypt.hash(password, 10);
        const user = await User.findById(decoded.id);
        if (user) {
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.password = newPassword;
            user.lastUpVote = new Date() - 60000;
            await user.save();
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Authorization', 'Bearer ' + token);
            res.status(200).json({
                ok: true,
                message: 'Informations de l\'utilisateur mises à jour avec succès.',
                data: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            });
        } else {
            return res.status(404).json({ ok: false, error: 'User not found.' });
        }
    } catch (err) {
        return res.status(500).json({ ok: false, error: 'Erreur interne du serveur.' });
    }
});

router.delete('/user/remove', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ ok: false, message: 'Utilisateur non trouvé.' });
        }

        await Post.deleteMany({ userId: decoded.id });

        await User.deleteOne({ _id: decoded.id });
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Authorization', 'Bearer ' + token);
        res.status(200).json({
            ok: true,
            message: 'Compte utilisateur supprimé avec succès.',
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                removed: true,
            },
        });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ ok: false, message: 'Mauvais token JWT.' });
        }
        return res.status(500).json({ ok: false, message: 'Erreur interne du serveur.' });
    }
});

module.exports = router;
