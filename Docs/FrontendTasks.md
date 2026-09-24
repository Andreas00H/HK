# Frontend-uppgifter (3 veckor)

Checklista för frontend **utan UI-design** — layout, färger och visuellt utseende kommer från UX (se [UI.UX.md](./UI.UX.md) när den finns). Frontend ansvarar för **React-app, routing, state, formulär, API-koppling och flöden**.

**Rutter, sidor, API och scope:** [Projektplan.md](./Projektplan.md), [Mappstruktur.md](./Mappstruktur.md), [Teckstack.md](./Teckstack.md). Backend-parallell: [BackendTasks.md](./BackendTasks.md).

---

## Vecka 1 — App, auth, annonslista

### Setup
- [ ] `frontend/package.json` — React, React Router, Vite (eller enligt teambeslut); dev-script
- [ ] `main.jsx` / `App.jsx` — router, grundlayout (platshållare tills UX levererar styling)
- [ ] `frontend/.env.example` — t.ex. `VITE_API_URL=http://localhost:5000` (ingen hemlighet i repo)
- [ ] `services/api.js` — `fetch`, bas-URL, `Authorization: Bearer`, JSON-fel

### Auth
- [ ] `AuthContext` + `useAuth` — login/logout, spara JWT (t.ex. localStorage), inloggad användare
- [ ] `ProtectedRoute` — skydda `/add-item`, `/dashboard`, `/profile`, `/contacts`, redigera annons m.m.
- [ ] `Login.jsx` / `Register.jsx` — formulär → `POST /api/auth/login`, `POST /api/auth/register` (name, email, phone, password, location)
- [ ] Visa API-fel (t.ex. fel lösenord, e-post upptagen) utan att designa om UX

### Hem / annonser
- [ ] `CityContext` / `useCity` — vald stad (från profil eller standard); skicka `location` till `GET /api/items`
- [ ] `Home.jsx` (ev. `Items.jsx`) — hämta annonser, lista
- [ ] Sök + kategorifilter — query `search`, `category_id`; `GET /api/categories`
- [ ] `ItemDetails.jsx` — `GET /api/items/:id`; knapp för låneförfrågan (dold om ej inloggad / egen annons)
- [ ] `ItemCard`, `ItemList`, `SearchBar`, `CategoryFilter` — **data och props**, minimal markup

### Vecka 1 — manuell test
- [ ] Register → login → JWT → skyddad sida
- [ ] Lista, sök och filter mot backend
- [ ] Logga ut; skyddade sidor omdirigerar

---

## Vecka 2 — CRUD, lån, dashboard, kontakter

### Annonser (ägare)
- [ ] `AddItem.jsx` + `ItemForm` — POST med JWT (rubrik, kategori, pris/dag, beskrivning, skick, stad, bild-URL, tillgänglig)
- [ ] `EditItem.jsx` — PUT/DELETE endast egen annons; hantera 403

### Låneförfrågningar
- [ ] `BorrowRequestForm` — datum → `POST /api/borrow-requests`
- [ ] `BorrowingDetails.jsx` — visa status; **ägare:** knappar för tillåtna status (`PUT /api/borrow-requests/:id`) enligt projektplan
- [ ] `RequestStatus`, `RequestCard` — visa statustext och tillgängliga åtgärder (logik, inte design)

### Översikt
- [ ] `Dashboard.jsx` — `GET /api/borrow-requests/my` och/eller `GET /api/dashboard` — egna annonser, skickade/mottagna förfrågningar
- [ ] `Contacts.jsx` — `GET /api/contacts` efter godkännande; visa namn, telefon, e-post (ingen chatt)

### Profil
- [ ] `Profile.jsx` — `GET /api/users/:id`; `CitySelect` — uppdatera stad (PUT user om backend stödjer, annars enligt API)
- [ ] Länk till ägarens omdömen inför godkännande av förfrågan (visa data från API)

### Layout (funktion)
- [ ] `BottomNav` — rutter: `/`, `/add-item`, `/contacts`, `/profile` (ikoner/text enligt UX senare)
- [ ] `Layout.jsx` — wrapper + outlet

### Vecka 2 — manuell test
- [ ] Skapa/redigera/radera egen annons
- [ ] Hela låneflödet i UI (förfrågan → godkänn → statussteg)
- [ ] Kontakter syns först efter godkännande

---

## Vecka 3 — Omdömen, robusthet, drift

### Omdömen
- [ ] `ReviewForm` / `ReviewList` — efter `COMPLETED`; `POST /api/reviews`, `GET /api/reviews/user/:id`
- [ ] Visa omdömen på profil (ägare kan bedöma lånare före godkännande)

### Kvalitet
- [ ] Laddningstillstånd och felmeddelanden på alla API-anrop
- [ ] Tomma listor (inga annonser / inga förfrågningar) — enkel text, ingen designpass
- [ ] 401 → login; ogiltig JWT → rensa token
- [ ] CSS: endast koppla in UX-filer eller minimal struktur (grid/flex för flöde), **ingen visuell design**

### Integration & deploy
- [ ] Byt `VITE_API_URL` mot lokal backend, sedan Render-backend
- [ ] Genomkör happy path tillsammans med backend (samma scenario som Postman)
- [ ] Build (`npm run build`); statisk hosting enligt team (t.ex. Render)

---

## Klar när

Användare kan i appen: registrera/logga in → välja stad → bläddra/söka/filter → se annons → begära lån → ägare hanterar status → se kontakter → avsluta → lämna/läsa omdömen → dashboard visar rätt data — allt via API, redo att stylas av UX.
