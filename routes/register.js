const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { storeTokens } = require('./tokenService');

router.post('/', (req, res) => {
  const { name, phoneNumber, email, password } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: true, message: 'Failed to connect to database' });
    }

    const emailQuery = 'SELECT * FROM users WHERE email = ?';
    const phoneQuery = 'SELECT * FROM users WHERE phoneNumber = ?';

    connection.query(emailQuery, [email], (err, emailResults) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: true, message: 'Failed to execute query 1' });
      }

      if (emailResults.length > 0) {
        connection.release();
        return res.status(409).json({ error: true, message: 'User with this email already exists' });
      }

      connection.query(phoneQuery, [phoneNumber], (err, phoneResults) => {
        if (err) {
          connection.release();
          return res.status(500).json({ error: true, message: 'Failed to execute query 2' });
        }

        if (phoneResults.length > 0) {
          connection.release();
          return res.status(409).json({ error: true, message: 'User with this phone number already exists' });
        }

        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            connection.release();
            return res.status(500).json({ error: true, message: 'Failed to generate salt' });
          }

          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              connection.release();
              return res.status(500).json({ error: true, message: 'Failed to hash password' });
            }

            const hashedPassword = hash;
            const insertQuery = 'INSERT INTO users (name, phoneNumber, email, password) VALUES (?,?,?,?)';

            connection.query(insertQuery, [name, phoneNumber, email, hashedPassword], (err, results) => {
              if (err) {
                connection.release();
                return res.status(500).json({ error: true, message: 'Failed to execute query 3' });
              }

              const userId = results.insertId;
              const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
              const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

              const accessToken = jwt.sign(
                { id: userId },
                accessTokenSecret,
                { expiresIn: '15m' } // Access token valid for 15 minutes
              );
              const refreshToken = jwt.sign(
                { id: userId },
                refreshTokenSecret,
                { expiresIn: '7d' } // Refresh token valid for 7 days
              );

              storeTokens(userId, accessToken, refreshToken);

              connection.release();
              res.status(201).json({
                error: false,
                message: 'User registered successfully',
                userId,
                accessToken,
                refreshToken
              });
            });
          });
        });
      });
    });
  });
});

module.exports = router;
