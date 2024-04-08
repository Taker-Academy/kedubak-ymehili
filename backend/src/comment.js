const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User, Post, Comment } = require('./models');

router.post('/comment/:id', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const post = await Post.findById(req.params.id);
    const user = await User.findById(decoded.id);

    const comment = new Comment({
        createdAt: new Date(),
        id: new mongoose.Types.ObjectId(),
        firstName: user.firstName,
        content: req.body.content,
    });

    post.comments.push(comment);
    await post.save();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Authorization', 'Bearer ' + token);
    res.status(201).json({
        ok: true,
        message: 'Commentaire créé avec succès.',
        data: {
            firstName: comment.firstName,
            content: comment.content,
            createdAt: comment.createdAt,
        }
    });
});

module.exports = router;