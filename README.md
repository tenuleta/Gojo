# Gojo

A server-side rendered (SSR) web application for an Airbnb-style booking platform built with Node.js, Express, EJS, and PostgreSQL.


## Features

- User registration and login with authentication (bcrypt + sessions)
- Browse and search properties by location, price, and guest capacity
- View detailed property information with amenities and reviews
- Host role — create, edit, and delete property listings (full CRUD)
- Guest role — book properties and manage reservations
- Leave reviews and ratings for booked stays
- Dashboard for hosts to manage their properties and booking requests
- Filter and search functionality
- Responsive design with mobile navigation
- EJS partials for layout reuse (header, footer, navbar)

## Technologies Used

- **Backend:** Node.js, Express.js
- **Templating:** EJS (with partials/layout reuse)
- **Database:** PostgreSQL
- **Authentication:** bcryptjs, express-session (with PostgreSQL session store via connect-pg-simple)
- **Frontend:** CSS3 with custom properties, Google Fonts (Playfair Display + DM Sans), vanilla JavaScript
- **Other:** method-override for PUT/DELETE support, dotenv for environment configuration

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)
- npm (comes with Node.js)

## Installation

### 1. Clone the repository

```bash
git clone <your-github-repo-url>
cd gojo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Create a PostgreSQL database and run the schema file:

```bash
psql -U postgres -f db/schema.sql
```

Then seed with sample data:

```bash
psql -U postgres -d gojo -f db/seed.sql
```

**Note:** The seed file includes pre-hashed passwords. All demo users have the password `password123`. You can also register new users through the application.

### 4. Configure environment variables

Edit the `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gojo
```

Adjust the `DATABASE_URL` to match your PostgreSQL credentials.

### 5. Start the application

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

### 6. Open the browser

Visit [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Name | Email | Password | Role |
|------|-------|----------|------|
| Alice Kamau | alice@example.com | password123 | Host |
| Bob Ochieng | bob@example.com | password123 | Host |
| Carol Wanjiku | carol@example.com | password123 | Guest |
| David Mwangi | david@example.com | password123 | Guest |
| Eve Akinyi | eve@example.com | password123 | Host |

## Project Structure

```
gojo/
├── server.js                 # Express app entry point
├── package.json
├── .env                      # Environment variables
├── config/
│   └── db.js                 # PostgreSQL connection pool
├── middleware/
│   └── auth.js               # Authentication middleware
├── routes/
│   ├── index.js              # Home page + Dashboard
│   ├── auth.js               # Register, login, logout
│   ├── properties.js         # Property CRUD
│   ├── bookings.js           # Booking management
│   └── reviews.js            # Review creation
├── views/
│   ├── partials/             # EJS partials (header, footer, navbar)
│   ├── index.ejs             # Home page
│   ├── dashboard.ejs         # User dashboard
│   ├── bookings.ejs          # Booking list
│   ├── error.ejs             # Error page
│   ├── auth/                 # Login and register pages
│   └── properties/           # Property list, detail, create, edit
├── public/
│   ├── css/style.css         # Stylesheet
│   └── js/main.js            # Client-side JavaScript
└── db/
    ├── schema.sql            # Database schema
    └── seed.sql              # Sample data
```

## GitHub Repository

[Link to your GitHub repository]

## Assignment Requirements Checklist

- [x] Express server setup
- [x] Routing using Express
- [x] Middleware usage (auth, session, error handling)
- [x] CRUD operations (properties, bookings, reviews)
- [x] Form handling (search, booking, review, property forms)
- [x] EJS templates with dynamic data rendering
- [x] Navigation between pages
- [x] Clean and usable interface
- [x] PostgreSQL database integration
- [x] EJS partials/layout reuse (header, footer, navbar)
- [x] GitHub repository with meaningful commits
