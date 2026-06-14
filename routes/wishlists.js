const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// View "My Wishlist" page
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT p.*, w.created_at AS saved_at
       FROM wishlists w
       JOIN properties p ON w.property_id = p.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [req.session.userId]
    );
    res.render('wishlists/index', {
      title: 'My Wishlist',
      properties: result.rows,
    });
  } catch (err) {
    next(err);
  }
});

// Add a property to wishlist
router.post('/:propertyId', requireAuth, async (req, res, next) => {
  try {
    await db.query(
      `INSERT INTO wishlists (user_id, property_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, property_id) DO NOTHING`,
      [req.session.userId, req.params.propertyId]
    );
    res.redirect(req.get('Referer') || '/properties');
  } catch (err) {
    next(err);
  }
});

// Remove a property from wishlist
router.delete('/:propertyId', requireAuth, async (req, res, next) => {
  try {
    await db.query(
      'DELETE FROM wishlists WHERE user_id = $1 AND property_id = $2',
      [req.session.userId, req.params.propertyId]
    );
    res.redirect(req.get('Referer') || '/wishlists');
  } catch (err) {
    next(err);
  }
});

module.exports = router;