const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register' });
});

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.render('auth/register', { title: 'Register', error: 'All fields are required.' });
    }
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.render('auth/register', { title: 'Register', error: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, hashedPassword, role || 'guest']
    );
    req.session.userId = result.rows[0].id;
    req.session.userRole = role || 'guest';
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
});

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render('auth/login', { title: 'Login', error: 'Email and password are required.' });
    }
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.render('auth/login', { title: 'Login', error: 'Invalid email or password.' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.render('auth/login', { title: 'Login', error: 'Invalid email or password.' });
    }
    req.session.userId = user.id;
    req.session.userRole = user.role;
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
