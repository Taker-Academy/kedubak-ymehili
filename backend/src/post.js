const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User, Comment, Post } = require('./models');

router.get('/post', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Mauvais token JWT.' });
        }

        const token = req.headers.authorization.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: 'Mauvais token JWT.' });
        }

        const posts = await Post.find({});
        if (posts.length > 0) {
            return res.status(200).json({
                ok: true,
                message: 'Liste des éléments récupérée avec succès.',
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
            return res.status(200).json({
                ok: true,
                message: 'No posts found.',
                data: []
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    }
});

router.post('/post', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ error: 'Mauvais token JWT.' });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
        return res.status(400).json({ error: 'Mauvaise requête, paramètres manquants ou invalides.' });
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
            message: 'Élément créé avec succès.',
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
    }
});

router.get('/post/me', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const posts = await Post.find({ userId: decoded.id });
        if (posts.length > 0) {
            return res.status(200).json({
                ok: true,
                message: 'Liste des éléments de l\'utilisateur récupérée avec succès.',
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
            return res.status(200).json({
                ok: true,
                message: 'No posts found.',
                data: []
            });
        }
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({error: 'Mauvais token JWT.'});
        } else {
            return res.status(500).json({error: 'Erreur interne du serveur.'});
        }
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Mauvais token JWT.' });
        }

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: 'Mauvais token JWT.' });
        }

        const post = await Post.findById(req.params.id);
        if (post) {
            return res.status(200).json({
                message: "Détails de l'élément récupérés avec succès.",
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
            return res.status(404).json({ error: 'Élément non trouvé.' });
        }
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Mauvaise requête, paramètres manquants ou invalides.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Mauvais token JWT.' });
        }
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

router.delete('/post/:id', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Mauvais token JWT.' });
        }

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: 'Mauvais token JWT.' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Élément non trouvé.' });
        }

        if (post.userId.toString() !== decoded.id) {
            return res.status(403).json({ error: "L'utilisateur n'est pas le propriétaire de l'élément." });
        }

        await Post.deleteOne({ _id: req.params.id });
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Authorization', 'Bearer ' + token);
        res.status(200).json({
            ok: true,
            message: 'Élément supprimé avec succès.',
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
    } catch (error) {
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

router.post('/post/vote/:id', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: "Mauvais token JWT." });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(422).json({ error: "ID invalide." });
        }

        if (user.lastUpVote && new Date() - user.lastUpVote < 60000) {
            return res.status(403).json({ error: "Vous ne pouvez voter que toutes les minutes." });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Élément non trouvé." });
        }

        if (post.upVotes.includes(decoded.id)) {
            return res.status(409).json({ error: "Vous avez déjà voté pour ce post." });
        }

        post.upVotes.push(decoded.id);
        await post.save();

        user.lastUpVote = new Date();
        await user.save();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Authorization', 'Bearer ' + token);
        res.status(200).json({
            "ok": true,
            "message": "Vote enregistré avec succès."
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

module.exports = router;
