const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { storeTokens } = require('./tokenService');

router.post('/', (req, res) => {
  const { email, password } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: true, message: 'Failed to connect to database' });
    } else {
      const query = 'SELECT * FROM users WHERE email = ?';
      connection.query(query, [email], (err, results) => {
        connection.release();
        if (err) {
          res.status(500).json({ error: true, message: 'Failed to execute query' });
        } else if (results.length === 0) {
          res.status(401).json({ error: true, message: 'Invalid email or password' });
        } else {
          const user = results[0];
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              res.status(500).json({ error: true, message: 'Failed to compare passwords' });
            } else if (!isMatch) {
              res.status(401).json({ error: true, message: 'Invalid email or password' });
            } else {
              const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
              const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

              const accessToken = jwt.sign(
                { id: user.userId },
                accessTokenSecret,
                { expiresIn: '15m' }
              );
              const refreshToken = jwt.sign(
                { id: user.userId },
                refreshTokenSecret,
                { expiresIn: '7d' }
              );

              const accessTokenExpiry = new Date();
              accessTokenExpiry.setMinutes(accessTokenExpiry.getMinutes() + 15);
              const refreshTokenExpiry = new Date();
              refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

              storeTokens(user.userId, accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry);

              res.status(200).json({ error: false, message: 'Login successful', accessToken, refreshToken, user });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
