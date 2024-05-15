require('dotenv').config()

const PORT = process.env.PORT || 5000;
const express = require('express');
const usersRoutes = require('./routes/user.js');
const middlewareLogRequest = require('./middleware/logs');
const app = express();
const bodyParser = require('body-parser');
const db = require('./config/database'); 

app.use(middlewareLogRequest);
app.use(express.json());
app.use(bodyParser.json());
app.use('/api', usersRoutes);

app.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM user');
        res.send(results);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.listen(PORT, () => {
    console.log(`Server berhasil running di port ${PORT}`);
})

// require('dotenv').config();

// const PORT = process.env.PORT || 5000;
// const http = require('http');
// const app = require('./app');

// const server = http.createServer(app);

// server.listen(PORT, () => {
//     console.log(`Server berhasil running di port ${PORT}`);
// });

