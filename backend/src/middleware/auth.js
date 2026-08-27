const jwt = require('jsonwebtoken');

const AUTH_ENABLED = (process.env.AUTH_ENABLED || 'false') === 'true';
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret';

function requireAuth(req, res, next) {
  if (!AUTH_ENABLED) return next();
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  if (req.method === 'GET') return next();

  const h = req.headers.authorization || '';
  const [type, token] = h.split(' ');
  if (type !== 'Bearer' || !token) return res.status(401).json({ error: 'missing token' });
  try {
    const payload = jwt.verify(token, AUTH_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: 'invalid token' });
  }
}

module.exports = { requireAuth };
