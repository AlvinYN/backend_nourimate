const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { storeTokens } = require('./tokenService'); // Import fungsi storeTokens
const moment = require('moment'); // Pastikan library moment sudah diinstal

exports.register = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await User.create(name, email, hashedPassword, phoneNumber);
        res.status(201).send(`User created with ID: ${userId}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send('Invalid credentials');
        }
        
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

        const accessToken = jwt.sign(
            { userId: user.user_id, email: user.email },
            accessTokenSecret,
            { expiresIn: '15m' } // expires in 15 minutes
        );
        const refreshToken = jwt.sign(
            { userId: user.user_id, email: user.email },
            refreshTokenSecret,
            { expiresIn: '7d' } // expires in 7 days
        );

        const accessTokenExpiry = moment().add(15, 'minutes').toDate(); // Menambahkan 15 menit dari waktu saat ini
        const refreshTokenExpiry = moment().add(7, 'days').toDate(); // Menambahkan 7 hari dari waktu saat ini

        // Simpan token ke database dengan tanggal kedaluwarsa
        storeTokens(user.user_id, accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry);

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
