// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../store/db');
const { SECRET } = require('../middlewares/auth.middleware');

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'username, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }
    if (db.findUserByEmail(email)) {
      return res.status(409).json({ success: false, error: 'Email is already registered.' });
    }
    if (db.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return res.status(409).json({ success: false, error: 'Username is already taken.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: db.nextUserId(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);

    const { passwordHash: _, ...safe } = user;
    return res.status(201).json({ success: true, data: safe });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      success: true,
      data: { token, expiresIn: '8h', user: { id: user.id, username: user.username, email: user.email } },
    });
  } catch (err) {
    next(err);
  }
};

const getMe = (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
  const { passwordHash: _, ...safe } = user;
  return res.status(200).json({ success: true, data: safe });
};

module.exports = { register, login, getMe };
