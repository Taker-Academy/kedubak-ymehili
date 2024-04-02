const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    _id: mongoose.Schema.Types.ObjectId,
});

const commentSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    content: { type: String, required: true },
});

const postSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [commentSchema],
    upVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const User = mongoose.model('User', userSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = { User, Comment, Post };