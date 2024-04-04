const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User, Comment, Post } = require('./models');

router.get('/post', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const posts = await Post.find({});
    if (posts.length > 0) {
        return res.status(200).json({
            ok: true,
            data: posts.map(post => ({
                createdAt: post.createdAt,
                userId: post.userId,
                firstName: post.firstName,
                title: post.title,
                content: post.content,
                comments: post.comments,
                upVotes: post.upVotes,
                _id: post._id
            }))
        });
    } else {
        return res.status(400).json({ error: 'No posts found' });
    }
});

router.post('/post', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!decoded) {
        return res.status(400).json({ error: 'Invalid token.' });
    }

    const post = new Post({
        createdAt: new Date(),
        userId: user._id,
        firstName: user.firstName,
        title: req.body.title,
        content: req.body.content,
        comments: [],
        upVotes: [],
        _id: new mongoose.Types.ObjectId(),
    });

    try {
        await post.save();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Authorization', 'Bearer ' + token);

        res.status(201).json({
            ok: true,
            data: {
                createdAt: post.createdAt,
                userId: post.userId,
                title: post.title,
                content: post.content,
                comments: post.comments,
                upVotes: post.upVotes,
                _id: post._id
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('Post created:', post);
    }
});

router.get('/post/me', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    user = await User.findById(decoded.id);

    const posts = await Post.find({ userId: decoded.id });
    if (posts.length > 0) {
        return res.status(200).json({
            ok: true,
            data: posts.map(post => ({
                createdAt: post.createdAt,
                userId: post.userId,
                firstName: post.firstName,
                title: post.title,
                content: post.content,
                comments: post.comments,
                upVotes: post.upVotes,
                _id: post._id
            }))
        });
    } else {
        return res.status(400).json({ error: 'No posts found for this user.' });
    }
});

router.get('/post/:id', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(400).json({ error: 'Invalid token.' });
    }

    const post = await Post.findById(req.params.id);
    if (post) {
        return res.status(200).json({
            ok: true,
            data: {
                createdAt: post.createdAt,
                userId: post.userId,
                title: post.title,
                content: post.content,
                comments: post.comments,
                upVotes: post.upVotes,
                _id: post._id
            }
        });
    } else {
        return res.status(400).json({ error: 'No post found' });
    }
});

router.delete('/post/:id', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(400).json({ error: 'Invalid token.' });
    }

    const post = await Post.findById(req.params.id);
    if (post) {
        await post.remove();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Authorization', 'Bearer ' + token);
        res.status(200).json({
            ok: true,
            data: {
                createdAt: post.createdAt,
                userId: post.userId,
                firstName: post.firstName,
                title: post.title,
                content: post.content,
                comments: post.comments,
                upVotes: post.upVotes,
                _id: post._id,
                removed: true
            }
        });
    } else {
        return res.status(400).json({ error: 'No post found' });
    }
});



module.exports = router;
