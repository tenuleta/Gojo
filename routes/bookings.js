const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const bookings = await db.query(
      `SELECT b.*, p.title AS property_title, p.location, p.image_url
       FROM bookings b JOIN properties p ON b.property_id = p.id
       WHERE b.guest_id = $1 ORDER BY b.created_at DESC`,
      [req.session.userId]
    );
    res.render('bookings', {
      title: 'My Bookings',
      bookings: bookings.rows,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { property_id, check_in, check_out } = req.body;
    if (!property_id || !check_in || !check_out) {
      return res.redirect(`/properties/${property_id}`);
    }

    const property = await db.query('SELECT * FROM properties WHERE id = $1', [property_id]);
    if (property.rows.length === 0) {
      return res.status(404).render('error', { message: 'Property not found', error: { status: 404 } });
    }

    const checkIn = new Date(check_in);
    const checkOut = new Date(check_out);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    if (nights < 1) {
      return res.redirect(`/properties/${property_id}`);
    }

    const totalPrice = nights * parseFloat(property.rows[0].price);

    await db.query(
      `INSERT INTO bookings (property_id, guest_id, check_in, check_out, total_price, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [property_id, req.session.userId, check_in, check_out, totalPrice]
    );
    res.redirect('/bookings');
  } catch (err) {
    next(err);
  }
});

router.put('/:id/cancel', requireAuth, async (req, res, next) => {
  try {
    await db.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = $1 AND guest_id = $2",
      [req.params.id, req.session.userId]
    );
    res.redirect('/bookings');
  } catch (err) {
    next(err);
  }
});

router.put('/:id/confirm', requireAuth, async (req, res, next) => {
  try {
    await db.query(
      `UPDATE bookings SET status = 'confirmed' FROM properties p
       WHERE bookings.id = $1 AND bookings.property_id = p.id AND p.host_id = $2`,
      [req.params.id, req.session.userId]
    );
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
