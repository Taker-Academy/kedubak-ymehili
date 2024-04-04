const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./database');
const { User, Comment, Post } = require('./models');
const router = require('./routes');
const userRoutes = require('./user');
const authRoutes = require('./auth');

app.use(express.json());
app.use(cors());
app.use('/', router);
app.use(userRoutes);
app.use(authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));