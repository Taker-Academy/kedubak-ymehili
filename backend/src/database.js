const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoUri = process.env.MONGODB_URI;
console.log(mongoUri);
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(console.error.bind(console, 'MongoDB connection error:'));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB Atlas');
});

module.exports = db;