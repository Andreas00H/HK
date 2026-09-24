# Backend-uppgifter (3 veckor)

Checklista för backend. **Schema, API-kontrakt, scope och stack:** se [Projektplan.md](./Projektplan.md), [Mappstruktur.md](./Mappstruktur.md), [Teckstack.md](./Teckstack.md).

---

## Vecka 1 — Grund, databas, auth, items

### Setup
- [ ] `backend/package.json` — Express, pg, bcrypt, jsonwebtoken, dotenv, cors, nodemon  (klar )
- [ ] `app.js` / `server.js` — JSON, CORS, rutter, fel-middleware
- [ ] `.env` + `.env.example` — `PORT`, DB, `JWT_SECRET`, JWT TTL (`.env` i gitignore)
- [ ] `GET /api/health` → `{ "status": "ok" }`

### Databas
- [ ] Lokal PostgreSQL + `backend/db/` (anslutning, `schema.sql`, `seed.sql`)
- [ ] Fem tabeller enligt projektplan (inga extra tabeller; kontakter härleds från förfrågningar)
- [ ] Seed: kategorier Verktyg, Elektronik, Utomhus, Kök, Trädgård, Hobby, Hem, Möbler
- [ ] Rimliga index (email, owner_id, category_id, location, borrow_requests, reviews)

### Auth & användare
- [ ] `POST /api/auth/register` — name, email, phone, password, location; bcrypt; unik email
- [ ] `POST /api/auth/login` — JWT; aldrig returnera `password_hash`
- [ ] `middleware/authMiddleware.js` — Bearer JWT → `req.user.id`
- [ ] `GET /api/users/:id` — publik profil (senare + omdömen/snittbetyg)

### Kategorier & items
- [ ] `GET /api/categories`
- [ ] Items CRUD: `GET/POST /api/items`, `GET/PUT/DELETE /api/items/:id`
- [ ] `GET /api/items` — query: `search`, `category_id`, `location`
- [ ] POST/PUT/DELETE: JWT; `owner_id` från JWT; endast ägare får ändra/radera
- [ ] Parameteriserade SQL-frågor

### Vecka 1 — test (Postman)
- [ ] Auth (register, dubblett, login, fel lösenord, JWT saknas/ogiltig)
- [ ] Kategorier, item CRUD, sök/filter, ägare vs icke-ägare

---

## Vecka 2 — Förfrågningar, kontakter, dashboard, omdömen

### Låneförfrågningar
- [ ] `POST /api/borrow-requests` — item_id, start_date, end_date; status `REQUESTED`; lånare ≠ ägare; item tillgängligt
- [ ] `GET /api/borrow-requests/my` — skickade + mottagna (med item/användare/status)
- [ ] `PUT /api/borrow-requests/:id` — endast tillåtna statusbyten i service (inte fri status från klient)

**Tillåtna övergångar:**  
`REQUESTED`→`ACCEPTED`|`DECLINED` · `ACCEPTED`→`DECLINED`|`BORROWED` · `BORROWED`→`RETURNED` · `RETURNED`→`COMPLETED`

- [ ] **Ägare:** godkänn, neka, neka efter godkännande, `BORROWED`, `RETURNED`, `COMPLETED`
- [ ] **Lånare:** se egen förfrågan; får inte ändra status

### Kontakter & dashboard
- [ ] `GET /api/contacts` — JWT; telefon/e-post motpart efter godkännande (`ACCEPTED`+); inte vid `DECLINED`/o godkänd
- [ ] `GET /api/dashboard` *eller* tillräcklig data via befintliga endpoints — egna items, skickade/mottagna förfrågningar, pågående lån

### Omdömen
- [ ] `POST /api/reviews` — efter `COMPLETED`; deltagare recenserar motpart; betyg 1–5; inga dubbletter/self-review
- [ ] `GET /api/reviews/user/:id`
- [ ] Utöka `GET /api/users/:id` med mottagna omdömen (+ ev. snittbetyg)

### Vecka 2 — test (Postman)
- [ ] Hela statusflödet + ogiltiga övergångar
- [ ] Kontakter före/efter godkännande; obehörig statusändring
- [ ] Omdöme giltigt/ogiltigt (för tidigt, dubblett, utomstående)

---

## Vecka 3 — Hårdning, integration, drift

### Kvalitet
- [ ] Validering på all indata (auth, items, förfrågningar, omdömen)
- [ ] Konsekvent JSON-fel (`errorMiddleware`); rätt HTTP-koder (400/401/403/404/409/500); inga stack traces i prod
- [ ] Säkerhet: bcrypt, JWT i env, ägarskap/roller, kontaktregler
- [ ] CORS mot frontend-URL; `Authorization: Bearer <JWT>`

### Test & docs
- [ ] Postman-svit: health → auth → users → categories → items → borrow → contacts → dashboard → reviews → negativa fall
- [ ] Happy path: A skapar item → B förfrågar → godkänn → kontakter → BORROWED → RETURNED → COMPLETED → omdömen
- [ ] Dokumenterad DB-reset: schema → seed → start
- [ ] `backend/README.md` — install, env, körning, endpoints (kort)

### Git & Render
- [ ] Begripliga commits; ingen `.env` i repo
- [ ] Render: build/start, env, PostgreSQL, testa `/api/health` + kärnflöde mot prod-URL

---

## Klar när

Ny utvecklare kan: installera → env → schema/seed → starta → frontend mot API → register/login → items (sök/filter) → förfrågan genom hela statusflödet → kontakter efter godkännande → omdömen → obehöriga anrop nekas.
