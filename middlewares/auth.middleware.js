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
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.';
    return res.status(401).json({ success: false, error: message });
  }
};

module.exports = { protect, SECRET };
