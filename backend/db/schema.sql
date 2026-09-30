-- Skal för databasens fem tabeller. 
-- users: id, name, email, phone, password_hash, location (stad), created_at
-- categories: id, name
-- items: id, owner_id, category_id, name, lending_price, description, condition, location, image_url, available, created_at
-- borrow_requests: id, item_id, borrower_id, start_date, end_date, status, created_at
-- reviews: id, borrowing_id, reviewer_id, reviewed_user_id, rating, comment, created_at
-- Status för borrow_requests: REQUESTED, ACCEPTED, DECLINED, BORROWED, RETURNED, COMPLETED


-- Schema för Hyra inte Köpa (HK)
-- Körs om från början varje gång: först raderas gamla tabeller, sedan skapas de på nytt.

-- Radera i omvänd ordning (tabeller som pekar på andra raderas först)
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS borrow_requests;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Användare
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  phone         VARCHAR(30)   NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  location      VARCHAR(100)  NOT NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- Kategorier
CREATE TABLE categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Annonser (saker som kan lånas ut)
CREATE TABLE items (
  id            SERIAL PRIMARY KEY,
  owner_id      INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id   INTEGER       NOT NULL REFERENCES categories(id),
  name          VARCHAR(150)  NOT NULL,
  lending_price NUMERIC(10,2) NOT NULL CHECK (lending_price >= 0),
  description   TEXT          NOT NULL,
  condition     VARCHAR(50)   NOT NULL,
  location      VARCHAR(100)  NOT NULL,
  image_url     TEXT,
  available     BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- Låneförfrågningar (en uthyrning är en förfrågan som byter status)
CREATE TABLE borrow_requests (
  id          SERIAL PRIMARY KEY,
  item_id     INTEGER     NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  borrower_id INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date  DATE        NOT NULL,
  end_date    DATE        NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'REQUESTED'
              CHECK (status IN ('REQUESTED', 'ACCEPTED', 'DECLINED', 'BORROWED', 'RETURNED', 'COMPLETED')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date >= start_date)
);

-- Omdömen (efter avslutat lån)
CREATE TABLE reviews (
  id               SERIAL PRIMARY KEY,
  borrowing_id     INTEGER     NOT NULL REFERENCES borrow_requests(id) ON DELETE CASCADE,
  reviewer_id      INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_user_id INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating           INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment          TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (reviewer_id <> reviewed_user_id),
  UNIQUE (borrowing_id, reviewer_id)
);



-- Index för snabbare sökningar och kopplingar
-- (email och (borrowing_id, reviewer_id) får index automatiskt via UNIQUE)
CREATE INDEX idx_items_owner_id ON items(owner_id);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_items_location ON items(location);
CREATE INDEX idx_borrow_requests_item_id ON borrow_requests(item_id);
CREATE INDEX idx_borrow_requests_borrower_id ON borrow_requests(borrower_id);
CREATE INDEX idx_borrow_requests_status ON borrow_requests(status);
CREATE INDEX idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);