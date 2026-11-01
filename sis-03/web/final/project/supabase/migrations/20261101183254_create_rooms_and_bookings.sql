/*
# Create rooms and bookings tables (read-only, single-tenant)

1. New Tables
- `rooms`: the bookable rooms shown on the page.
  - `id` (uuid, primary key)
  - `name` (text, not null) e.g. "Room B214"
  - `building` (text, not null) e.g. "Hawthorne Library"
  - `is_blocked` (boolean, not null, default false) when true, every request for this room is Unavailable
- `bookings`: existing bookings for a room. The checker never creates or changes these.
  - `id` (uuid, primary key)
  - `room_id` (uuid, not null, references rooms)
  - `title` (text, not null)
  - `start_minute` (integer, not null) minutes after midnight, 0 to 1439
  - `end_minute` (integer, not null) minutes after midnight, 1 to 1440, always after start
  - `tone` (text, not null) one of sky, peach, lavender, mint (display colour)

2. Seed data
- One room, "Room B214" in "Hawthorne Library", not blocked.
- Four fictional bookings for that room.

3. Security
- Row level security enabled on both tables.
- The page has no sign-in, so the anonymous role must read the data. `anon` and `authenticated` get SELECT only.
- No INSERT, UPDATE or DELETE policies or grants exist, so the public page cannot change rooms or bookings.

4. Important notes
- Seeding uses fixed IDs and ON CONFLICT DO NOTHING, so re-running this migration does not duplicate rows.
- Time range rules (start before end, 0 to 1440) are enforced by table checks.
*/

CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  building text NOT NULL,
  is_blocked boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  title text NOT NULL,
  start_minute integer NOT NULL,
  end_minute integer NOT NULL,
  tone text NOT NULL,
  CONSTRAINT bookings_minutes_range CHECK (start_minute >= 0 AND end_minute <= 1440 AND start_minute < end_minute),
  CONSTRAINT bookings_tone_valid CHECK (tone IN ('sky', 'peach', 'lavender', 'mint'))
);

CREATE INDEX IF NOT EXISTS bookings_room_id_idx ON bookings (room_id);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON rooms TO anon, authenticated;
GRANT SELECT ON bookings TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_rooms" ON rooms;
CREATE POLICY "anon_select_rooms" ON rooms FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (true);

INSERT INTO rooms (id, name, building, is_blocked)
VALUES ('6f1d2c3a-1b2c-4d5e-8f90-a1b2c3d4e5f6', 'Room B214', 'Hawthorne Library', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (id, room_id, title, start_minute, end_minute, tone) VALUES
  ('1a2b3c4d-0001-4000-8000-000000000001', '6f1d2c3a-1b2c-4d5e-8f90-a1b2c3d4e5f6', 'History Seminar', 480, 570, 'sky'),
  ('1a2b3c4d-0002-4000-8000-000000000002', '6f1d2c3a-1b2c-4d5e-8f90-a1b2c3d4e5f6', 'Dr. Aris Office Hours', 780, 870, 'peach'),
  ('1a2b3c4d-0003-4000-8000-000000000003', '6f1d2c3a-1b2c-4d5e-8f90-a1b2c3d4e5f6', 'Study Group', 900, 960, 'lavender'),
  ('1a2b3c4d-0004-4000-8000-000000000004', '6f1d2c3a-1b2c-4d5e-8f90-a1b2c3d4e5f6', 'Thesis Writing', 990, 1050, 'mint')
ON CONFLICT (id) DO NOTHING;
