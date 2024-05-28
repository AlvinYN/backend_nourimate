const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Import routes
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const userRoutes = require('./routes/user');
const detailRoutes = require('./routes/details');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/details', detailRoutes);

module.exports = app;



