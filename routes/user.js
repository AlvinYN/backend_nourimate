const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const verifyToken = require('../middleware/verifyToken');

router.put('/change-password/:id', verifyToken, (req, res) => {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json({ error: true, message: 'Failed to connect to database' });
        } else {
            const query = 'SELECT * FROM users WHERE userid = ?';
            connection.query(query, [userId], (err, results) => {
                if (err) {
                    connection.release();
                    res.status(500).json({ error: true, message: 'Failed to execute query' });
                } else if (results.length === 0) {
                    connection.release();
                    res.status(404).json({ error: true, message: 'User not found' });
                } else {
                    const user = results[0];
                    if (user.id !== req.userId) {
                        connection.release();
                        res.status(401).json({ error: true, message: 'Unauthorized' });
                    } else {
                        bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
                            if (err) {
                                connection.release();
                                res.status(500).json({ error: true, message: 'Failed to compare passwords' });
                            } else if (!isMatch) {
                                connection.release();
                                res.status(401).json({ error: true, message: 'Current password is incorrect' });
                            } else {
                                bcrypt.genSalt(10, (err, salt) => {
                                    if (err) {
                                        connection.release();
                                        res.status(500).json({ error: true, message: 'Failed to generate salt' });
                                    } else {
                                        bcrypt.hash(newPassword, salt, (err, hash) => {
                                            if (err) {
                                                connection.release();
                                                res.status(500).json({ error: true, message: 'Failed to hash password' });
                                            } else {
                                                const hashedPassword = hash;
                                                const updateQuery = 'UPDATE users SET password = ? WHERE userId = ?';
                                                connection.query(updateQuery, [hashedPassword, userId], (err, results) => {
                                                    connection.release();
                                                    if (err) {
                                                        res.status(500).json({ error: true, message: 'Failed to execute query' });
                                                    } else {
                                                        res.status(200).json({ error: false, message: 'Password updated successfully' });
                                                    }
                                                });
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
    });
});

router.get('/:id', verifyToken, (req, res) => {
    const userId = req.params.id;

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json({ error: true, message: 'Failed to connect to database' });
        } else {
            const query = 'SELECT userId, name, phoneNumber, email FROM users WHERE userId = ?';
            connection.query(query, [userId], (err, results) => {
                connection.release();
                if (err) {
                    res.status(500).json({ error: true, message: 'Failed to execute query' });
                } else if (results.length === 0) {
                    res.status(404).json({ error: true, message: 'User not found' });
                } else {
                    const user = results[0];
                    res.status(200).json({ error: false, message: 'User data retrieved successfully', user });
                }
            });
        }
    });
});

router.put('/edit-profile/:id', verifyToken, (req, res) => {
    const userId = req.params.id;
    const { name, email, phoneNumber } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json({ error: true, message: 'Failed to connect to database' });
        } else {
            const query = 'SELECT * FROM users WHERE userId = ?';
            connection.query(query, [userId], (err, results) => {
                if (err) {
                    connection.release();
                    res.status(500).json({ error: true, message: 'Failed to execute query' });
                } else if (results.length === 0) {
                    connection.release();
                    res.status(404).json({ error: true, message: 'User not found' });
                } else {
                    const user = results[0];
                    if (user.id !== req.userId) {
                        connection.release();
                        res.status(401).json({ error: true, message: 'Unauthorized' });
                    } else {
                        let updateQuery = 'UPDATE users SET';

                        const updateData = [];
                        const updateValues = [];

                        if (name) {
                            updateData.push('name = ?');
                            updateValues.push(name);
                        }

                        if (email) {
                            updateData.push('email = ?');
                            updateValues.push(email);
                        }

                        if (phoneNumber) {
                            updateData.push('phoneNumber = ?');
                            updateValues.push(phoneNumber);
                        }

                        if (updateData.length === 0) {
                            connection.release();
                            res.status(400).json({ error: true, message: 'No data to update' });
                        } else {
                            updateQuery += ` ${updateData.join(', ')} WHERE userId = ?`;
                            updateValues.push(userId);

                            connection.query(updateQuery, updateValues, (err, results) => {
                                connection.release();
                                if (err) {
                                    res.status(500).json({ error: true, message: 'Failed to execute query' });
                                } else {
                                    res.status(200).json({ error: false, message: 'Profile updated successfully' });
                                }
                            });
                        }
                    }
                }
            });
        }
    });
});

module.exports = router;
