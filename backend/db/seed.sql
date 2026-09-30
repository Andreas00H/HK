-- Startdata för Hyra inte Köpa (HK)
-- Körs efter schema.sql

-- Kategorier
INSERT INTO categories (name) VALUES
  ('Verktyg'),
  ('Elektronik'),
  ('Utomhus'),
  ('Kök'),
  ('Trädgård'),
  ('Hobby'),
  ('Hem'),
    ('Möbler')
ON CONFLICT (name) DO NOTHING;