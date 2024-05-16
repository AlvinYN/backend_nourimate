
// const jwt = require('jsonwebtoken');

// const logRequest = (req, res, next) => {
//     console.log('Terjadi req ke path: ', req.path);
//     next();
// }

// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

//     if (token == null) return res.sendStatus(401);

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     });
// };

// module.exports = verifyToken;
// module.exports = logRequest;

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
