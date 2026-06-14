const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { booking_id, property_id, rating, comment } = req.body;

    const booking = await db.query(
      'SELECT * FROM bookings WHERE id = $1 AND guest_id = $2 AND status = $3',
      [booking_id, req.session.userId, 'confirmed']
    );
    if (booking.rows.length === 0) {
      return res.status(403).render('error', {
        message: 'You can only review confirmed bookings.',
        error: { status: 403 },
      });
    }

    await db.query(
      `INSERT INTO reviews (booking_id, user_id, property_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (booking_id) DO NOTHING`,
      [booking_id, req.session.userId, property_id, parseInt(rating), comment]
    );
    res.redirect(`/properties/${property_id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
