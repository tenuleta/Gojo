-- Gojo Database Schema
-- Run this file to create all required tables

CREATE DATABASE gojo;

\c gojo;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'guest' CHECK (role IN ('guest', 'host')),
    avatar_url VARCHAR(500),
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Properties table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    host_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    max_guests INTEGER NOT NULL,
    image_url VARCHAR(500),
    amenities TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    guest_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Session table for connect-pg-simple
CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");




--INDEXES for faster queries--
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- AUTO-UPDATE updated_at timestamp for properties
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_properties_updated_at 
    BEFORE UPDATE ON properties 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- VALIDATION: Prevent booking if check_out is before check_in
ALTER TABLE bookings 
    ADD CONSTRAINT check_dates_valid 
    CHECK (check_out > check_in);

-- COMMENT on tables for documentation
COMMENT ON TABLE users IS 'Stores user accounts (guests and hosts)';
COMMENT ON TABLE properties IS 'Property listings created by hosts';
COMMENT ON TABLE bookings IS 'Booking transactions between guests and properties';
COMMENT ON TABLE reviews IS 'Guest reviews and ratings for properties';

COMMENT ON COLUMN users.role IS 'guest = can book stays, host = can list properties';
COMMENT ON COLUMN bookings.status IS 'pending = awaiting host approval, confirmed = approved, cancelled = cancelled by guest';
COMMENT ON COLUMN reviews.rating IS '1-5 star rating, 5 is best';


-- =====================================================
-- VIEW: Property booking summary
-- =====================================================
CREATE OR REPLACE VIEW property_booking_summary AS
SELECT 
    p.id AS property_id,
    p.title,
    COUNT(b.id) AS total_bookings,
    COALESCE(AVG(r.rating), 0) AS avg_rating,
    COUNT(r.id) AS review_count
FROM properties p
LEFT JOIN bookings b ON p.id = b.property_id AND b.status = 'confirmed'
LEFT JOIN reviews r ON p.id = r.property_id
GROUP BY p.id, p.title;
