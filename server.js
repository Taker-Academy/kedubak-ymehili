const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./backend/database');
const { User, Comment, Post } = require('./backend/models');
const router = require('./backend/routes');
const userRoutes = require('./backend/user');
const authRoutes = require('./backend/auth');

app.use(express.json());
app.use(cors());
app.use('/', router);
app.use(userRoutes);
app.use(authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));