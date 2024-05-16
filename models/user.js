
// const db = require('../config/db');

// class User {
//     // Find user by email
//     static async findByEmail(email) {
//         const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
//         return rows[0];
//     }

//     // Create a new user
//     static async create(name, email, hashedPassword, phoneNumber) {
//         const [result] = await db.execute(
//             'INSERT INTO user (name, email, password, phoneNumber) VALUES (?, ?, ?, ?)',
//             [name, email, hashedPassword, phoneNumber]
//         );
//         return result.insertId;
//     }

//     // Update an existing user
//     static async update(userId, { name, email, password, phoneNumber }) {
//         const [result] = await db.execute(
//             'UPDATE user SET name = ?, email = ?, password = ?, phoneNumber = ? WHERE user_id = ?',
//             [name, email, password, phoneNumber, userId]
//         );
//         return result.affectedRows; // Returns the number of rows affected
//     }

//     // Delete a user
//     static async delete(userId) {
//         const [result] = await db.execute(
//             'DELETE FROM user WHERE user_id = ?',
//             [userId]
//         );
//         return result.affectedRows; // Returns the number of rows affected
//     }

//     // Find user by ID
//     static async findById(userId) {
//         const [rows] = await db.query('SELECT * FROM user WHERE user_id = ?', [userId]);
//         return rows[0];
//     }
// }

// module.exports = User;