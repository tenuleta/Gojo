const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const { pool } = require('./config/db');
const { setLocals } = require('./middleware/auth');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const wishlistRoutes = require('./routes/wishlists');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(session({
  store: new pgSession({ pool }),
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));

app.use(setLocals);

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/properties', propertyRoutes);
app.use('/bookings', bookingRoutes);
app.use('/reviews', reviewRoutes);
app.use('/wishlists', wishlistRoutes);

app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page not found',
    error: { status: 404 },
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('error', {
    message: err.message || 'Something went wrong',
    error: { status: err.status || 500 },
  });
});

app.listen(PORT, () => {
  console.log(`Gojo running on http://localhost:${PORT}`);
});
