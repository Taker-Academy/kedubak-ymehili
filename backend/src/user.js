const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('./models');

router.get('/user/me', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (user) {
        return res.status(200).json({
            ok: true,
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } else {
        return res.status(400).json({ error: 'User not found.' });
    }
});

router.put('/user/edit', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.findById(decoded.id);
    if (user) {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.password = newPassword;
        await user.save();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Authorization', 'Bearer ' + token);
        res.status(200).json({
            ok: true,
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } else {
        return res.status(400).json({ error: 'User not found.' });
    }
});

module.exports = router;
