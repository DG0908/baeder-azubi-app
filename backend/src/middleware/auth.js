const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

// Token generieren
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Token verifizieren Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Kein Token vorhanden' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token ungueltig oder abgelaufen' });
    }
    req.user = user;
    next();
  });
}

// Admin/Trainer Check Middleware
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Nicht authentifiziert' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Keine Berechtigung' });
    }
    next();
  };
}

module.exports = { generateToken, authenticateToken, requireRole };
