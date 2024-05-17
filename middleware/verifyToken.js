const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: true, message: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = verified.userId;
        next();
    } catch (err) {
        res.status(400).json({ error: true, message: 'Invalid token' });
    }
};

module.exports = verifyToken;
