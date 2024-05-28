const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ error: true, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'your_jwt_secret_key');
    console.log('Verified token:', verified); // Log untuk memastikan token berisi userId
    req.user = { userId: verified.id }; // Menyimpan userId dalam req.user
    next();
  } catch (err) {
    res.status(400).json({ error: true, message: 'Invalid token' });
  }
};

module.exports = verifyToken;
