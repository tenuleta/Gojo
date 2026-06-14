const db = require('../config/db');

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
}

function requireHost(req, res, next) {
  if (!req.session.userId || req.session.userRole !== 'host') {
    return res.status(403).render('error', {
      message: 'Only hosts can access this page.',
      error: { status: 403 },
    });
  }
  next();
}

async function setLocals(req, res, next) {
  res.locals.currentUser = null;
  res.locals.notifPending = 0;
  res.locals.notifConfirmations = 0;

  if (req.session.userId) {
    try {
      const user = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.session.userId]);
      if (user.rows.length > 0) {
        res.locals.currentUser = user.rows[0];

        const pending = await db.query(
          `SELECT COUNT(*)::int AS count FROM bookings b
           JOIN properties p ON b.property_id = p.id
           WHERE p.host_id = $1 AND b.status = 'pending'`,
          [req.session.userId]
        );
        res.locals.notifPending = pending.rows[0].count;

        const confirmations = await db.query(
          `SELECT COUNT(*)::int AS count FROM bookings b
           WHERE b.guest_id = $1 AND b.status = 'confirmed' AND b.created_at > NOW() - INTERVAL '7 days'`,
          [req.session.userId]
        );
        res.locals.notifConfirmations = confirmations.rows[0].count;
      }
    } catch (err) {
      console.error('setLocals error:', err);
    }
  }
  next();
}

module.exports = { requireAuth, requireHost, setLocals };
