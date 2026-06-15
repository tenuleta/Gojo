const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth, requireHost } = require('../middleware/auth');
const upload = require('../config/upload');

router.get('/', async (req, res, next) => {
  try {
    const { location, min_price, max_price, guests } = req.query;
    let sql = 'SELECT * FROM properties WHERE 1=1';
    const params = [];
    let idx = 1;

    if (location) {
      sql += ` AND LOWER(location) LIKE LOWER($${idx})`;
      params.push(`%${location}%`);
      idx++;
    }
    if (min_price) {
      sql += ` AND price >= $${idx}`;
      params.push(parseFloat(min_price));
      idx++;
    }
    if (max_price) {
      sql += ` AND price <= $${idx}`;
      params.push(parseFloat(max_price));
      idx++;
    }
    if (guests) {
      sql += ` AND max_guests >= $${idx}`;
      params.push(parseInt(guests));
      idx++;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await db.query(sql, params);
    res.render('properties/index', {
      title: 'Browse Properties',
      properties: result.rows,
      filters: req.query,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/new', requireAuth, requireHost, (req, res) => {
  res.render('properties/new', { title: 'List a Property' });
});

router.post('/', requireAuth, requireHost, upload.single('image'), async (req, res, next) => {
  try {
    const { title, description, price, location, bedrooms, bathrooms, max_guests, amenities } = req.body;
    const imageUrl = req.file ? `/uploads/properties/${req.file.filename}` : null;

    const amenitiesArr = amenities ? amenities.split(',').map(a => a.trim()).filter(Boolean) : [];

    const result = await db.query(
      `INSERT INTO properties (host_id, title, description, price, location, bedrooms, bathrooms, max_guests, image_url, amenities)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [req.session.userId, title, description, parseFloat(price), location,
       parseInt(bedrooms), parseInt(bathrooms), parseInt(max_guests), imageUrl, amenitiesArr]
    );
    res.redirect(`/properties/${result.rows[0].id}`);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const property = await db.query(
      `SELECT p.*, u.name AS host_name
       FROM properties p JOIN users u ON p.host_id = u.id
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (property.rows.length === 0) {
      return res.status(404).render('error', { message: 'Property not found', error: { status: 404 } });
    }

    const reviews = await db.query(
      `SELECT r.*, u.name AS user_name
       FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.property_id = $1 ORDER BY r.created_at DESC`,
      [req.params.id]
    );

    const userBookings = req.session.userId
      ? await db.query(
          `SELECT id, check_in, check_out FROM bookings
           WHERE guest_id = $1 AND property_id = $2 AND status = 'confirmed'`,
          [req.session.userId, req.params.id]
        )
      : { rows: [] };
      const wishlisted = req.session.userId
      ? await db.query(
          'SELECT id FROM wishlists WHERE user_id = $1 AND property_id = $2',
          [req.session.userId, req.params.id]
        )
      : { rows: [] };

    res.render('properties/show', {
      title: property.rows[0].title,
      property: property.rows[0],
      reviews: reviews.rows,
      userBookings: userBookings.rows,
      isWishlisted: wishlisted.rows.length > 0,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/edit', requireAuth, requireHost, async (req, res, next) => {
  try {
    const property = await db.query(
      'SELECT * FROM properties WHERE id = $1 AND host_id = $2',
      [req.params.id, req.session.userId]
    );
    if (property.rows.length === 0) {
      return res.status(404).render('error', { message: 'Property not found', error: { status: 404 } });
    }
    res.render('properties/edit', {
      title: `Edit ${property.rows[0].title}`,
      property: property.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, requireHost, upload.single('image'), async (req, res, next) => {
  try {
    const { title, description, price, location, bedrooms, bathrooms, max_guests, amenities } = req.body;
    const imageUrl = req.file ? `/uploads/properties/${req.file.filename}` : req.body.existing_image;
    const amenitiesArr = amenities ? amenities.split(',').map(a => a.trim()).filter(Boolean) : [];

    await db.query(
      `UPDATE properties SET title=$1, description=$2, price=$3, location=$4,
       bedrooms=$5, bathrooms=$6, max_guests=$7, image_url=$8, amenities=$9, updated_at=NOW()
       WHERE id=$10 AND host_id=$11`,
      [title, description, parseFloat(price), location,
       parseInt(bedrooms), parseInt(bathrooms), parseInt(max_guests), imageUrl, amenitiesArr,
       req.params.id, req.session.userId]
    );
    res.redirect(`/properties/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, requireHost, async (req, res, next) => {
  try {
    await db.query('DELETE FROM properties WHERE id = $1 AND host_id = $2', [req.params.id, req.session.userId]);
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
