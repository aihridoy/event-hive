-- users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'attendee'
            CHECK (role IN ('attendee', 'organizer')),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- events table
CREATE TABLE IF NOT EXISTS events (
  id               SERIAL PRIMARY KEY,
  title            TEXT          NOT NULL,
  description      TEXT          NOT NULL,
  category         VARCHAR(50)   NOT NULL,
  date             TIMESTAMPTZ   NOT NULL,
  location         TEXT          NOT NULL,
  total_seats      INTEGER       NOT NULL CHECK (total_seats > 0),
  available_seats  INTEGER       NOT NULL CHECK (available_seats >= 0),
  price            NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  organizer_id     INTEGER       NOT NULL REFERENCES users (id),
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT events_available_within_total CHECK (available_seats <= total_seats)
);

--   bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id              SERIAL PRIMARY KEY,
  event_id        INTEGER       NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  attendee_id     INTEGER       NOT NULL REFERENCES users (id),
  tickets_booked  INTEGER       NOT NULL CHECK (tickets_booked > 0),
  total_price     NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
  status          VARCHAR(20)   NOT NULL DEFAULT 'confirmed'
                    CHECK (status IN ('confirmed', 'cancelled')),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_events_organizer_id  ON events (organizer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id    ON bookings (event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_attendee_id ON bookings (attendee_id);

-- Refresh updated_at automatically on every UPDATE
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER events_set_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER bookings_set_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

