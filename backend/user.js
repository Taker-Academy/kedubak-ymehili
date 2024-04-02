const express = require('express');
const router = express.Router();
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

module.exports = router;