const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./src/database');
const { User, Comment, Post } = require('./src/models');
const router = require('./src/routes');
const userRoutes = require('./src/user');
const authRoutes = require('./src/auth');

app.use(express.json());
app.use(cors());
app.use('/', router);
app.use(userRoutes);
app.use(authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));