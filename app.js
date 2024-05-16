// const express = require('express');
// const usersRoutes = require('./routes/user.js');
// const middlewareLogRequest = require('./middleware/logs');
// const bodyParser = require('body-parser');
// const db = require('./config/database'); // Mengimpor koneksi database

// const app = express();

// app.use(middlewareLogRequest);
// app.use(express.json());
// app.use(bodyParser.json());
// app.use('/api', usersRoutes);

// // app.get('/', (req, res) => {
// //     db.query('SELECT * FROM user', (err, results) => {
// //         if (err) {
// //             console.error('Database query error:', err);
// //             res.status(500).send('Database query error');
// //             return;
// //         }
// //         res.send(results);
// //     });
// // });

// module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Import routes
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const userRoutes = require('./routes/user');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/users', userRoutes);

// Default route (optional)
// app.get('/', (req, res) => {
//   res.send('Welcome to the API');
// });

module.exports = app;



