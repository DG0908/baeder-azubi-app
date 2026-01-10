const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { pool } = require('../config/database');
const { generateToken, authenticateToken } = require('../middleware/auth');

// Registrierung
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'azubi', trainingYear = 1, trainingEnd } = req.body;

    // Validierung
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, E-Mail und Passwort sind erforderlich' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen lang sein' });
    }

    // Pruefen ob E-Mail bereits existiert
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'E-Mail bereits registriert' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Benutzer erstellen
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role, training_year, training_end) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, trainingYear, trainingEnd || null]
    );

    const userId = result.insertId;

    // User Stats initialisieren
    await pool.execute('INSERT INTO user_stats (user_id) VALUES (?)', [userId]);

    // User Daten fuer Response
    const user = {
      id: userId,
      name,
      email,
      role,
      trainingYear,
      trainingEnd
    };

    // Token generieren
    const token = generateToken(user);

    res.status(201).json({
      message: 'Registrierung erfolgreich',
      user,
      token
    });
  } catch (error) {
    console.error('Registrierung Fehler:', error);
    res.status(500).json({ error: 'Serverfehler bei der Registrierung' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich' });
    }

    // User suchen
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Ungueltige Anmeldedaten' });
    }

    const user = users[0];

    // Passwort pruefen
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Ungueltige Anmeldedaten' });
    }

    // Last Login aktualisieren
    await pool.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    // User Stats laden
    const [stats] = await pool.execute('SELECT * FROM user_stats WHERE user_id = ?', [user.id]);

    // Token generieren
    const token = generateToken(user);

    res.json({
      message: 'Login erfolgreich',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        trainingYear: user.training_year,
        trainingEnd: user.training_end
      },
      stats: stats[0] || null,
      token
    });
  } catch (error) {
    console.error('Login Fehler:', error);
    res.status(500).json({ error: 'Serverfehler beim Login' });
  }
});

// Aktuellen User abrufen
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, training_year, training_end, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const [stats] = await pool.execute('SELECT * FROM user_stats WHERE user_id = ?', [req.user.id]);
    const [categoryStats] = await pool.execute('SELECT * FROM category_stats WHERE user_id = ?', [req.user.id]);
    const [badges] = await pool.execute('SELECT badge_id, earned_at FROM user_badges WHERE user_id = ?', [req.user.id]);

    res.json({
      user: users[0],
      stats: stats[0] || null,
      categoryStats,
      badges
    });
  } catch (error) {
    console.error('Get User Fehler:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Alle Benutzer abrufen (fuer Quizduell)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, role, training_year FROM users WHERE id != ?',
      [req.user.id]
    );
    res.json(users);
  } catch (error) {
    console.error('Get Users Fehler:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

module.exports = router;
