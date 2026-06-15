# Database Design for GOJO


## Schema Structure

| Table | Purpose |
|-------|---------|
| users | Authentication & profiles |
| properties | Property listings |
| bookings | Reservations |
| reviews | Ratings & feedback |

## Relationships
- Hosts (users) → Properties (one-to-many)
- Guests (users) → Bookings (one-to-many)  
- Properties → Bookings (one-to-many)
- Bookings → Reviews (one-to-one)

## Indexes Created
- `idx_users_email` - Faster login
- `idx_properties_price` - Price filtering
- `idx_bookings_dates` - Date search

## Maintenance Notes
- Updated_at triggers automatically track changes
- Foreign keys use CASCADE DELETE
