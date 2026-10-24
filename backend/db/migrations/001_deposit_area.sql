-- Lägger till handpenning (deposit) och stadsdel (area) i en databas som redan finns,
-- utan att radera någon data. Behövs bara om databasen skapades innan fälten fanns i schema.sql.
-- Kör från mappen backend:  psql -d hk -f db/migrations/001_deposit_area.sql
-- Kan köras flera gånger utan fel.
ALTER TABLE items ADD COLUMN IF NOT EXISTS deposit NUMERIC(10,2) CHECK (deposit >= 0);
ALTER TABLE items ADD COLUMN IF NOT EXISTS area VARCHAR(100);
