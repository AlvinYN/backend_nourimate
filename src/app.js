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
