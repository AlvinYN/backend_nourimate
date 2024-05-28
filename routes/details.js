const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 
const verifyToken = require('../middleware/verifyToken'); 
const moment = require('moment');
const { promisify } = require('util');

// Mendapatkan detail pengguna
router.get('/:userId', verifyToken, (req, res) => {
    const userId = req.params.userId;

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json({ error: true, message: 'Failed to connect to database' });
        } else {
            const query = 'SELECT * FROM details WHERE detail_id = ?';
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
    const userId = req.user.userId; 
    const { dob, height, weight, waistSize, gender, allergen, disease } = req.body;
  
    if (!userId) {
      return res.status(400).json({ error: true, message: 'User ID not found in token' });
    }
  
    if (!gender || !allergen || !disease) {
      return res.status(400).json({ error: true, message: 'All required fields must be filled' });
    }
  
    console.log('User ID from token:', userId);  // Logging userId to ensure it's set correctly
  
    // Menghitung BMI dan bbIdeal
    let bmi = null;
    let bbIdeal = null;
    if (height && weight) {
      // Konversi tinggi dari cm ke meter
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters ** 2);
      bbIdeal = (height - 100) - (0.1 * (height - 100));
    }
  
    // Menghitung umur berdasarkan dob
    const age = moment().diff(moment(dob, 'YYYY-MM-DD'), 'years');
  
    pool.getConnection((err, connection) => {
      if (err) {
        return res.status(500).json({ error: true, message: 'Failed to connect to database' });
      }
      const query = `INSERT INTO details (userId, dob, height, weight, waistSize, gender, allergen, disease, bmi, bbIdeal, age)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      connection.query(query, [userId, dob, height, weight, waistSize, gender, allergen, disease, bmi, bbIdeal, age], (err, results) => {
        connection.release();
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ error: true, message: 'Failed to add user details', details: err.message });
        }
        res.status(201).json({ error: false, message: 'User details added successfully', bmi: bmi, bbIdeal: bbIdeal, age: age });
      });
    });
  });

// Promisify pool.query untuk menggunakan async/await
const query = promisify(pool.query).bind(pool);

// Mengubah detail pengguna
router.patch('/:userId', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const { dob, height, weight, waistSize, gender, allergen, disease } = req.body;

    try {
        // Membuat array untuk menyimpan bagian SET dari query dan nilai-nilainya
        let detailFields = [];
        let detailValues = [];
        let bmi = null;
        let bbIdeal = null;
        let age = null;

        // Memeriksa setiap field dan menambahkannya ke query jika ada dalam request body
        if (dob !== undefined) {
            detailFields.push('dob = ?');
            detailValues.push(dob);

            // Menghitung umur berdasarkan dob
            age = moment().diff(moment(dob, 'YYYY-MM-DD'), 'years');
            detailFields.push('age = ?');
            detailValues.push(age);
        }
        if (height !== undefined) {
            detailFields.push('height = ?');
            detailValues.push(height);

            // Jika weight juga diberikan, hitung BMI dan bbIdeal
            if (weight !== undefined) {
                detailFields.push('weight = ?');
                detailValues.push(weight);

                const heightInMeters = height / 100;
                bmi = weight / (heightInMeters ** 2);
                bbIdeal = (height - 100) - (0.1 * (height - 100));

                detailFields.push('bmi = ?');
                detailValues.push(bmi);
                detailFields.push('bbIdeal = ?');
                detailValues.push(bbIdeal);
            }
        } else if (weight !== undefined) {
            detailFields.push('weight = ?');
            detailValues.push(weight);

            // Ambil height dari database untuk menghitung BMI dan bbIdeal
            const result = await query('SELECT height FROM details WHERE userId = ?', [userId]);
            if (result.length === 0) {
                return res.status(404).json({ error: true, message: 'User not found' });
            }

            const heightInMeters = result[0].height / 100;
            bmi = weight / (heightInMeters ** 2);
            bbIdeal = (result[0].height - 100) - (0.1 * (result[0].height - 100));

            detailFields.push('bmi = ?');
            detailValues.push(bmi);
            detailFields.push('bbIdeal = ?');
            detailValues.push(bbIdeal);
        }

        if (waistSize !== undefined) {
            detailFields.push('waistSize = ?');
            detailValues.push(waistSize);
        }
        if (gender !== undefined) {
            detailFields.push('gender = ?');
            detailValues.push(gender);
        }
        if (allergen !== undefined) {
            detailFields.push('allergen = ?');
            detailValues.push(allergen);
        }
        if (disease !== undefined) {
            detailFields.push('disease = ?');
            detailValues.push(disease);
        }

        // Jika tidak ada field yang di-update di detail, kembalikan error
        if (detailFields.length === 0) {
            return res.status(400).json({ error: true, message: 'No fields provided for update' });
        }

        // Menambahkan userId ke array values
        detailValues.push(userId);

        // Membuat query UPDATE dinamis untuk tabel details
        const detailQuery = `UPDATE details SET ${detailFields.join(', ')} WHERE userId = ?`;

        await query(detailQuery, detailValues);
        res.status(200).json({ error: false, message: 'User details updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Failed to update user details', details: err.message });
    }
});

// Menghapus detail pengguna
router.delete('/:userId', verifyToken, (req, res) => {
    const userId = req.params.userId;

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json({ error: true, message: 'Failed to connect to database' });
        } else {
            const query = 'DELETE FROM details WHERE detail_id = ?';
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
