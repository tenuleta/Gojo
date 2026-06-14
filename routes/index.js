const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const featured = await db.query(
      'SELECT * FROM properties ORDER BY created_at DESC LIMIT 6'
    );
    const locations = await db.query(
      'SELECT location, COUNT(*)::int AS count FROM properties GROUP BY location ORDER BY count DESC'
    );
    res.render('index', {
      title: 'Discover Unique Stays Across Ethiopia',
      properties: featured.rows,
      locations: locations.rows,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/dashboard', requireAuth, async (req, res, next) => {
  try {
    const myProperties = await db.query(
      'SELECT * FROM properties WHERE host_id = $1 ORDER BY created_at DESC',
      [req.session.userId]
    );
    const myBookings = await db.query(
      `SELECT b.*, p.title AS property_title, p.location, p.image_url
       FROM bookings b JOIN properties p ON b.property_id = p.id
       WHERE b.guest_id = $1 ORDER BY b.created_at DESC`,
      [req.session.userId]
    );
    const hostBookings = await db.query(
      `SELECT b.*, p.title AS property_title, p.location, u.name AS guest_name
       FROM bookings b JOIN properties p ON b.property_id = p.id JOIN users u ON b.guest_id = u.id
       WHERE p.host_id = $1 ORDER BY b.created_at DESC`,
      [req.session.userId]
    );

    res.render('dashboard', {
      title: 'Dashboard',
      myProperties: myProperties.rows,
      myBookings: myBookings.rows,
      hostBookings: hostBookings.rows,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
