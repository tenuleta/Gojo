-- Seed data for Gojo

-- Insert demo users (password is "password123" hashed)
INSERT INTO users (name, email, password, role, bio) VALUES
('Alemitu Tadesse', 'alice@example.com', '$2a$10$wwq9rwyxFrHd8f105RSTAeV4Akfb58YMrVb/qBkhp1.LITdolVnki', 'host', 'Travel enthusiast and experienced host in Addis Ababa.'),
('Biruk Alemu', 'bob@example.com', '$2a$10$wwq9rwyxFrHd8f105RSTAeV4Akfb58YMrVb/qBkhp1.LITdolVnki', 'host', 'Love hosting guests from around the world.'),
('Chaltu Bekele', 'carol@example.com', '$2a$10$wwq9rwyxFrHd8f105RSTAeV4Akfb58YMrVb/qBkhp1.LITdolVnki', 'guest', 'Frequent traveler exploring the Horn of Africa.'),
('Dawit Eshetu', 'david@example.com', '$2a$10$wwq9rwyxFrHd8f105RSTAeV4Akfb58YMrVb/qBkhp1.LITdolVnki', 'guest', 'Remote worker who loves cozy stays.'),
('Eden Fikru', 'eve@example.com', '$2a$10$wwq9rwyxFrHd8f105RSTAeV4Akfb58YMrVb/qBkhp1.LITdolVnki', 'host', 'Artist and host of unique creative spaces.');

-- Insert sample properties
INSERT INTO properties (host_id, title, description, price, location, bedrooms, bathrooms, max_guests, image_url, amenities) VALUES
(1, 'Sunset Villa — Entoto Hills', 'A stunning villa overlooking the Addis Ababa skyline from the Entoto Hills. Floor-to-ceiling windows, infinity pool, and a rooftop terrace perfect for sunset dinners.', 150.00, 'Addis Ababa, Ethiopia', 4, 3, 8, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', ARRAY['WiFi', 'Pool', 'Parking', 'Kitchen', 'AC']),
(1, 'Lakeside Cottage — Lake Tana', 'Peaceful cottage on the shores of Lake Tana. Enjoy boat rides to ancient monasteries, bird watching, and bonfire nights under the stars.', 85.00, 'Bahir Dar, Ethiopia', 2, 1, 4, 'https://images.unsplash.com/photo-1540541338287-41700207dee6', ARRAY['WiFi', 'Parking', 'Kitchen', 'Fireplace']),
(2, 'Highland Lodge — Lalibela', 'Stone-built lodge with views of the famous rock-hewn churches. Warm hospitality, traditional coffee ceremonies, and guided tours.', 200.00, 'Lalibela, Ethiopia', 3, 2, 6, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', ARRAY['WiFi', 'Parking', 'Kitchen', 'Guide', 'Breakfast']),
(2, 'Mountain Retreat — Simien', 'Cozy cabin nestled in the Simien Mountains. Perfect for trekkers and nature lovers seeking tranquility among Ethiopia''s highlands.', 65.00, 'Simien Mountains, Ethiopia', 1, 1, 2, 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e', ARRAY['WiFi', 'Parking', 'Kitchen', 'Fireplace']),
(5, 'Artists Loft — Bole', 'A vibrant creative space in the Bole district. Exposed brick, gallery walls, and a rooftop studio with views of Mount Entoto.', 120.00, 'Addis Ababa, Ethiopia', 2, 1, 3, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', ARRAY['WiFi', 'Parking', 'Studio', 'AC']),
(1, 'Danakil Desert Camp', 'Luxury camping in the otherworldly Danakil Depression. Salt flats, sulfur springs, and incredible starry night skies.', 350.00, 'Danakil, Ethiopia', 1, 1, 2, 'https://images.unsplash.com/photo-1540541338287-41700207dee6', ARRAY['Meals', 'Guide', 'Tents', 'Transport']),
(2, 'Urban Penthouse — Kazanchis', 'Modern penthouse in Kazanchis with panoramic views of Addis Ababa. Rooftop jacuzzi, smart home features, and gym access.', 250.00, 'Addis Ababa, Ethiopia', 3, 2, 6, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', ARRAY['WiFi', 'Jacuzzi', 'Gym', 'Parking', 'AC']),
(5, 'Lake View Lodge — Arba Minch', 'Eco-friendly lodge overlooking the twin lakes of Arba Minch. Hippo viewing, boat safaris, and lush garden surroundings.', 175.00, 'Arba Minch, Ethiopia', 3, 2, 5, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', ARRAY['WiFi', 'Lake Access', 'Kitchen', 'Boat Tours']);

-- Insert sample bookings
INSERT INTO bookings (property_id, guest_id, check_in, check_out, total_price, status) VALUES
(1, 3, '2026-07-15', '2026-07-20', 750.00, 'confirmed'),
(3, 4, '2026-08-01', '2026-08-07', 1400.00, 'pending'),
(2, 3, '2026-06-20', '2026-06-22', 170.00, 'confirmed'),
(5, 4, '2026-09-10', '2026-09-14', 480.00, 'confirmed');

-- Insert sample reviews
INSERT INTO reviews (booking_id, user_id, property_id, rating, comment) VALUES
(1, 3, 1, 5, 'Absolutely breathtaking views! The infinity pool was incredible.'),
(3, 3, 2, 4, 'Lovely cottage by the lake. Perfect for a weekend getaway.'),
(4, 4, 5, 5, 'The most unique space I have ever stayed in. The rooftop studio is magical.');
