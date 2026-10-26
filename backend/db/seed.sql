-- Startdata för Hyra inte Köpa (HK)
-- Körs efter schema.sql. Alla demokonton har lösenordet Test1234!
-- Datum räknas från dagens datum, så demon ser levande ut oavsett när den körs.

-- bcrypt för lösenorden (gen_salt('bf') ger hash som backendens bcrypt kan verifiera)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Kategorier
INSERT INTO categories (name) VALUES
  ('Verktyg'), ('Elektronik'), ('Utomhus'), ('Kök'),
  ('Trädgård'), ('Hobby'), ('Hem'), ('Möbler')
ON CONFLICT (name) DO NOTHING;

-- Användare
INSERT INTO users (name, email, phone, password_hash, location) VALUES
  ('Anna Lindqvist', 'anna.lindqvist@example.se', '0701110001', crypt('Test1234!', gen_salt('bf', 10)), 'Stockholm'),
  ('Erik Svensson',  'erik.svensson@example.se',  '0701110002', crypt('Test1234!', gen_salt('bf', 10)), 'Göteborg'),
  ('Sara Nilsson',   'sara.nilsson@example.se',   '0701110003', crypt('Test1234!', gen_salt('bf', 10)), 'Malmö'),
  ('Omar Hassan',    'omar.hassan@example.se',    '0701110004', crypt('Test1234!', gen_salt('bf', 10)), 'Stockholm'),
  ('Lisa Berg',      'lisa.berg@example.se',      '0701110005', crypt('Test1234!', gen_salt('bf', 10)), 'Göteborg'),
  ('Johan Ek',       'johan.ek@example.se',       '0701110006', crypt('Test1234!', gen_salt('bf', 10)), 'Stockholm');

-- Annonser
INSERT INTO items (owner_id, category_id, name, lending_price, deposit, description, condition, location, area, image_url)
SELECT u.id, c.id, v.name, v.price, v.deposit, v.descr, v.cond, v.city, v.area, v.img
FROM (VALUES
  ('anna.lindqvist@example.se', 'Verktyg',    'Slagborrmaskin 500 W', 60, 300, 'Kraftig slagborrmaskin för betong och tegel. Borrar i medföljer.', 'Bra skick', 'Stockholm', 'Södermalm', 'https://media.jemogfix.dk/prod-mediafiles/se/varer/700/3101%209048121.jpg?v=639117583800000000'),
  ('anna.lindqvist@example.se', 'Trädgård',   'Hink 15 l', 10, NULL, 'Stor hink, perfekt för tvätt, målning eller trädgårdsjobb.', 'Bra skick', 'Stockholm', 'Södermalm', 'https://assets.cdn.jula.com/v2/preset:jpgoptimized/w:1920/132318?lastmodified=20260803160028'),
  ('erik.svensson@example.se',  'Verktyg',    'Träskruv 10-pk 10x50 mm', 5, NULL, 'Oöppnad förpackning med träskruvar, bra för ett enstaka bygge.', 'Nyskick', 'Göteborg', 'Majorna', 'https://assets.cdn.jula.com/v2/preset:jpgoptimized/w:1920/319255?lastmodified=20260924122405'),
  ('omar.hassan@example.se',    'Elektronik', 'Powerbank 10 000 mAh', 20, 100, 'Laddar en mobil ungefär tre gånger. Kabel medföljer.', 'Bra skick', 'Stockholm', 'Kungsholmen', 'https://assets.cdn.jula.com/v2/preset:jpgoptimized/w:1920/171910?lastmodified=20260826123602'),
  ('sara.nilsson@example.se',   'Utomhus',    'Tält 3 personer', 150, 500, 'Lättuppsatt tält med tvärstänger och packpåse.', 'Bra skick', 'Malmö', 'Västra Hamnen', 'https://picsum.photos/seed/talt/600/400'),
  ('lisa.berg@example.se',      'Kök',        'Köksmixer', 40, 200, 'Kraftfull mixer med två skålar och visp.', 'Bra skick', 'Göteborg', 'Linné', 'https://picsum.photos/seed/mixer/600/400'),
  ('johan.ek@example.se',       'Hobby',      'Akustisk gitarr', 80, 500, 'Gitarr med stålsträngar, väska och stämapparat ingår.', 'Okej skick', 'Stockholm', 'Vasastan', 'https://picsum.photos/seed/gitarr/600/400'),
  ('erik.svensson@example.se',  'Trädgård',   'Gräsklippare, el', 100, 400, 'Elektrisk gräsklippare med 20 m förlängningssladd.', 'Bra skick', 'Göteborg', 'Örgryte', 'https://picsum.photos/seed/grasklippare/600/400'),
  ('sara.nilsson@example.se',   'Möbler',     'Hopfällbart bord', 50, NULL, 'Stabilt bord för 6 personer, bra till fest eller loppis.', 'Bra skick', 'Malmö', 'Möllevången', 'https://picsum.photos/seed/bord/600/400'),
  ('omar.hassan@example.se',    'Elektronik', 'Projektor', 200, 1000, 'Full HD-projektor med HDMI-kabel, perfekt för filmkväll.', 'Nyskick', 'Stockholm', 'Östermalm', 'https://picsum.photos/seed/projektor/600/400'),
  ('lisa.berg@example.se',      'Hem',        'Dammsugare', 30, NULL, 'Kraftfull dammsugare med flera munstycken.', 'Okej skick', 'Göteborg', 'Haga', 'https://picsum.photos/seed/dammsugare/600/400'),
  ('anna.lindqvist@example.se', 'Utomhus',    'Campingstolar, 2-pack', 25, NULL, 'Två hopfällbara stolar med dryckeshållare.', 'Bra skick', 'Stockholm', 'Södermalm', 'https://picsum.photos/seed/campingstol/600/400'),
  ('johan.ek@example.se',       'Verktyg',    'Stege 3 m', 40, 150, 'Aluminiumstege, tål 150 kg.', 'Bra skick', 'Stockholm', 'Vasastan', 'https://picsum.photos/seed/stege/600/400'),
  ('sara.nilsson@example.se',   'Kök',        'Fondue-set', 35, 100, 'Fonduegryta med sex gafflar och brännare.', 'Nyskick', 'Malmö', 'Centrum', 'https://picsum.photos/seed/fondue/600/400'),
  ('erik.svensson@example.se',  'Hobby',      'Brädspelspaket', 20, NULL, 'Fem klassiska sällskapsspel i samma kartong.', 'Okej skick', 'Göteborg', 'Majorna', 'https://picsum.photos/seed/spel/600/400'),
  ('lisa.berg@example.se',      'Verktyg',    'Skruvdragare 18 V', 70, 300, 'Batteridriven skruvdragare med två batterier och laddare.', 'Bra skick', 'Göteborg', 'Linné', 'https://picsum.photos/seed/skruvdragare/600/400')
) AS v(owner_email, category, name, price, deposit, descr, cond, city, area, img)
JOIN users u ON u.email = v.owner_email
JOIN categories c ON c.name = v.category;

-- En annons som inte är tillgänglig just nu
UPDATE items SET available = FALSE WHERE name = 'Fondue-set';

-- Låneförfrågningar i olika statusar (datum räknas från idag)
INSERT INTO borrow_requests (item_id, borrower_id, start_date, end_date, status)
SELECT i.id, b.id, CURRENT_DATE + v.start_off, CURRENT_DATE + v.end_off, v.status
FROM (VALUES
  ('Slagborrmaskin 500 W', 'erik.svensson@example.se', -40, -38, 'COMPLETED'),
  ('Slagborrmaskin 500 W', 'omar.hassan@example.se',   -20, -18, 'COMPLETED'),
  ('Tält 3 personer',      'anna.lindqvist@example.se', -30, -27, 'COMPLETED'),
  ('Köksmixer',            'sara.nilsson@example.se',  -15, -14, 'COMPLETED'),
  ('Akustisk gitarr',      'lisa.berg@example.se',     -10, -8,  'RETURNED'),
  ('Stege 3 m',            'omar.hassan@example.se',   -2,  1,   'BORROWED'),
  ('Powerbank 10 000 mAh', 'johan.ek@example.se',      3,   5,   'ACCEPTED'),
  ('Projektor',            'sara.nilsson@example.se',  7,   9,   'REQUESTED'),
  ('Gräsklippare, el',     'anna.lindqvist@example.se', 5,  6,   'REQUESTED'),
  ('Skruvdragare 18 V',    'johan.ek@example.se',      2,   3,   'DECLINED')
) AS v(item_name, borrower_email, start_off, end_off, status)
JOIN items i ON i.name = v.item_name
JOIN users b ON b.email = v.borrower_email;

-- Omdömen, båda parter efter varje avslutat lån
INSERT INTO reviews (borrowing_id, reviewer_id, reviewed_user_id, rating, comment)
SELECT br.id, rv.id, rd.id, v.rating, v.comment
FROM (VALUES
  ('Slagborrmaskin 500 W', 'erik.svensson@example.se',  'anna.lindqvist@example.se', 'erik.svensson@example.se',  5, 'Lämnade tillbaka maskinen rengjord och i perfekt skick. Gärna igen!'),
  ('Slagborrmaskin 500 W', 'erik.svensson@example.se',  'erik.svensson@example.se',  'anna.lindqvist@example.se', 5, 'Smidigt och tydligt. Maskinen var precis som i annonsen.'),
  ('Slagborrmaskin 500 W', 'omar.hassan@example.se',    'anna.lindqvist@example.se', 'omar.hassan@example.se',    4, 'Bra kontakt, kom i tid. Saknade en borr men fixade det snabbt.'),
  ('Slagborrmaskin 500 W', 'omar.hassan@example.se',    'omar.hassan@example.se',    'anna.lindqvist@example.se', 5, 'Superbra service och rimligt pris.'),
  ('Tält 3 personer',      'anna.lindqvist@example.se', 'sara.nilsson@example.se',   'anna.lindqvist@example.se', 5, 'Perfekt tält, höll tätt trots regn.'),
  ('Tält 3 personer',      'anna.lindqvist@example.se', 'anna.lindqvist@example.se', 'sara.nilsson@example.se',   4, 'Trevlig lånare, tältet kom tillbaka torrt och helt.'),
  ('Köksmixer',            'sara.nilsson@example.se',   'lisa.berg@example.se',      'sara.nilsson@example.se',   3, 'Lite sen med återlämningen, men allt var helt.'),
  ('Köksmixer',            'sara.nilsson@example.se',   'sara.nilsson@example.se',   'lisa.berg@example.se',      5, 'Fantastisk mixer och snällt bemötande.')
) AS v(item_name, borrower_email, reviewer_email, reviewed_email, rating, comment)
JOIN items i ON i.name = v.item_name
JOIN users b ON b.email = v.borrower_email
JOIN borrow_requests br ON br.item_id = i.id AND br.borrower_id = b.id AND br.status = 'COMPLETED'
JOIN users rv ON rv.email = v.reviewer_email
JOIN users rd ON rd.email = v.reviewed_email;