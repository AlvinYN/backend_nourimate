const pool = require('../config/db');

exports.storeTokens = (userId, accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Failed to connect to database:', err);
        } else {
            const query = `
                INSERT INTO tokens (user_id, access_token, refresh_token, access_token_expiry, refresh_token_expiry)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                access_token = VALUES(access_token),
                refresh_token = VALUES(refresh_token),
                access_token_expiry = VALUES(access_token_expiry),
                refresh_token_expiry = VALUES(refresh_token_expiry)
            `;
            const values = [userId, accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry];
            connection.query(query, values, (err, results) => {
                connection.release();
                if (err) {
                    console.error('Failed to store tokens:', err);
                }
            });
        }
    });
};
