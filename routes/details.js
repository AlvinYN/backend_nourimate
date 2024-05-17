const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 
const verifyToken = require('../middleware/verifyToken'); 

// Mendapatkan detail pengguna
router.get('/:userId', verifyToken, (req, res) => {
    const userId = req.params.userId;

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json({ error: true, message: 'Failed to connect to database' });
        } else {
            const query = 'SELECT * FROM detail WHERE detail_id = ?';
            connection.query(query, [userId], (err, results) => {
                connection.release();
                if (err) {
                    res.status(500).json({ error: true, message: 'Failed to execute query' });
                } else if (results.length === 0) {
                    res.status(404).json({ error: true, message: 'User not found' });
                } else {
                    const data = results[0];
                    res.status(200).json({ error: false, message: 'User data retrieved successfully', data});
                }
            });
        }
    });
});

// Menambah detail pengguna baru
router.post('/', verifyToken, (req, res) => {
    const userId = req.userId; 
    const { dob, height, weight, waistSize, gender, allergen, disease, bmi, bbIdeal } = req.body;

    if (!gender || !allergen || !disease) {
        return res.status(400).json({ error: true, message: 'All required fields must be filled' });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json({ error: true, message: 'Failed to connect to database' });
        } else {
            const query = `INSERT INTO detail (detail_id, dob, height, weight, waistSize, gender, allergen, disease, bmi, bbIdeal)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            connection.query(query, [userId, dob, height, weight, waistSize, gender, allergen, disease, bmi, bbIdeal], (err, results) => {
                connection.release();
                if (err) {
                    res.status(500).json({ error: true, message: 'Failed to add user details' });
                } else {
                    res.status(201).json({ error: false, message: 'User details added successfully' });
                }
            });
        }
    });
});

// Mengubah detail pengguna
router.put('/:userId', verifyToken, (req, res) => {
    const userId = req.params.userId;
    const { dob, height, weight, waistSize, gender, allergen, disease, bmi, bbIdeal } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json({ error: true, message: 'Failed to connect to database' });
        } else {
            const query = `UPDATE detail SET dob = ?, height = ?, weight = ?, waistSize = ?, gender = ?, allergen = ?, disease = ?, bmi = ?, bbIdeal = ?
                           WHERE detail_id = ?`;
            connection.query(query, [dob, height, weight, waistSize, gender, allergen, disease, bmi, bbIdeal, userId], (err, results) => {
                connection.release();
                if (err) {
                    res.status(500).json({ error: true, message: 'Failed to update user details' });
                } else {
                    res.status(200).json({ error: false, message: 'User details updated successfully' });
                }
            });
        }
    });
});

// Menghapus detail pengguna
router.delete('/:userId', verifyToken, (req, res) => {
    const userId = req.params.userId;

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json({ error: true, message: 'Failed to connect to database' });
        } else {
            const query = 'DELETE FROM detail WHERE detail_id = ?';
            connection.query(query, [userId], (err, results) => {
                connection.release();
                if (err) {
                    res.status(500).json({ error: true, message: 'Failed to delete user details' });
                } else {
                    res.status(200).json({ error: false, message: 'User details deleted successfully' });
                }
            });
        }
    });
});

module.exports = router;
