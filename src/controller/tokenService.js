// tokenService.js
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports.storeTokens = function(userId, accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry) {
    userId = userId ?? null;
    accessToken = accessToken ?? null;
    refreshToken = refreshToken ?? null;
    accessTokenExpiry = accessTokenExpiry ?? null;
    refreshTokenExpiry = refreshTokenExpiry ?? null;
    
    const query = `
        INSERT INTO auth_tokens (user_id, access_token, refresh_token, access_token_expiry, refresh_token_expiry)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            access_token = VALUES(access_token),
            refresh_token = VALUES(refresh_token),
            access_token_expiry = VALUES(access_token_expiry),
            refresh_token_expiry = VALUES(refresh_token_expiry);
    `;

    connection.execute(query, [userId, accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry], (err, results, fields) => {
        if (err) {
            console.error('Error saat menyimpan token:', err);
            return;
        }
        console.log('Token tersimpan dengan sukses');
    });
};
