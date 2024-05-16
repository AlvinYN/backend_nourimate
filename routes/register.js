const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

router.post('/', (req, res) => {
  const { name, phoneNumber, email, password } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: true, message: 'Failed to connect to database' });
    } else {
      const emailQuery = 'SELECT * FROM users WHERE email = ?';
      const phoneQuery = 'SELECT * FROM users WHERE phoneNumber = ?';

      connection.query(emailQuery, [email], (err, emailResults) => {
        if (err) {
          connection.release();
          res.status(500).json({ error: true, message: 'Failed to execute query 1' });
        } else {
          if (emailResults.length > 0) {
            connection.release();
            res.status(409).json({ error: true, message: 'User with this email already exists' });
          } else {
            connection.query(phoneQuery, [phoneNumber], (err, phoneResults) => {
              if (err) {
                connection.release();
                res.status(500).json({ error: true, message: 'Failed to execute query 2' });
              } else {
                if (phoneResults.length > 0) {
                  connection.release();
                  res.status(409).json({ error: true, message: 'User with this phone number already exists' });
                } else {
                  bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                      connection.release();
                      res.status(500).json({ error: true, message: 'Failed to generate salt' });
                    } else {
                      bcrypt.hash(password, salt, (err, hash) => {
                        if (err) {
                          connection.release();
                          res.status(500).json({ error: true, message: 'Failed to hash password' });
                        } else {
                          const hashedPassword = hash;

                          const insertQuery = 'INSERT INTO users (name, phoneNumber, email, password) VALUES (?,?,?,?)';
                          connection.query(insertQuery, [name, phoneNumber, email, hashedPassword], (err, results) => {
                            connection.release();
                            if (err) {
                              res.status(500).json({ error: true, message: 'Failed to execute query 3' });
                            } else {
                              const token = jwt.sign({ id: results.insertId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1w' });
                              res.status(201).json({ error: false, message: 'User registered successfully', token });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  });
});

module.exports = router;
