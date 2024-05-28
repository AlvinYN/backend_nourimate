const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const verifyToken = require('../middleware/verifyToken');

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


router.put('/change-phoneNumber/:id', verifyToken, (req, res) => {
    const userId = req.params.id;
    const { phoneNumber } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: true, message: 'Failed to connect to database' });
        }

        const query = 'SELECT * FROM users WHERE userId = ?';
        connection.query(query, [userId], (err, results) => {
            if (err) {
                connection.release();
                return res.status(500).json({ error: true, message: 'Failed to execute query 1', details: err.message });
            }

            if (results.length === 0) {
                connection.release();
                return res.status(404).json({ error: true, message: 'User not found' });
            }

            const user = results[0];
            if (user.userId !== req.userId) {
                connection.release();
                return res.status(401).json({ error: true, message: 'Unauthorized' });
            }

            // Check if phoneNumber already exists
            if (phoneNumber) {
                const phoneQuery = 'SELECT * FROM users WHERE phoneNumber = ? AND userId != ?';
                connection.query(phoneQuery, [phoneNumber, userId], (err, phoneResults) => {
                    if (err) {
                        connection.release();
                        return res.status(500).json({ error: true, message: 'Failed to execute query 2', details: err.message });
                    }

                    if (phoneResults.length > 0) {
                        connection.release();
                        return res.status(409).json({ error: true, message: 'User with this phone number already exists' });
                    }

                    // Proceed to update user phoneNumber
                    updatePhoneNumber(connection, userId, phoneNumber, res);
                });
            } else {
                connection.release();
                return res.status(400).json({ error: true, message: 'Phone number is required' });
            }
        });
    });
});

const updatePhoneNumber = (connection, userId, phoneNumber, res) => {
    const updateQuery = 'UPDATE users SET phoneNumber = ? WHERE userId = ?';
    const updateValues = [phoneNumber, userId];

    // Log query and values for debugging
    console.log('Executing query:', updateQuery);
    console.log('With values:', updateValues);

    connection.query(updateQuery, updateValues, (err, results) => {
        connection.release();
        if (err) {
            console.error('Query execution error:', err);
            return res.status(500).json({ error: true, message: 'Failed to execute query 3', details: err.message });
        }
        res.status(200).json({ error: false, message: 'Phone number updated successfully' });
    });
};

module.exports = router;
