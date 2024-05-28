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
              const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'your_jwt_secret_key';
              const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_secret_key';

              const accessToken = jwt.sign(
                { id: user.userId },
                accessTokenSecret,
                { expiresIn: '1d' }
              );
              const refreshToken = jwt.sign(
                { id: user.userId },
                refreshTokenSecret,
                { expiresIn: '7d' }
              );

              const accessTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
              const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

              storeTokens(user.userId, accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry);

              // Remove password before sending user object in response
              delete user.password;

              res.status(200).json({ error: false, message: 'Login successful', accessToken, refreshToken, user });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
