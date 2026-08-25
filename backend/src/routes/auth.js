const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret';
const AUTH_USER = process.env.AUTH_USER || 'admin';
const AUTH_PASS = process.env.AUTH_PASS || 'password';

// Simple login route returning JWT. In production, replace with real user store.
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (username === AUTH_USER && password === AUTH_PASS) {
    const token = jwt.sign({ username }, AUTH_SECRET, { expiresIn: '8h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'invalid credentials' });
});

module.exports = router;
