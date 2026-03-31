// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'se3040_lab06_secret';

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    const db = require('../store/db');
    if (!db.findUserById(decoded.id)) {
      return res.status(401).json({ success: false, error: 'User does not exist in current memory session.' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.';
    return res.status(401).json({ success: false, error: message });
  }
};

module.exports = { protect, SECRET };
