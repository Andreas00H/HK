# Mapp- och filstruktur

Detta dokument beskriver hur projektet är uppdelat. Filerna som skapats nu är **tomma skal** med svenska kommentarer. Ingen frontend-, backend- eller affärslogik är införd ännu.

Roten är git-repot `HK` (GitHub: BorrowNotBuy).

```
HK/
├── Docs/
│   ├── Projektplan.md
│   └── Mappstruktur.md
├── frontend/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── backend/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
└── README.md
```

---

## Frontend

Byggs med React, React Router, JavaScript och vanlig CSS.

### Rot

| Fil | Senare ansvar |
| --- | --- |
| `frontend/main.jsx` | Startpunkt, kopplar React till DOM |
| `frontend/App.jsx` | Rutter och övergripande layout |

### `pages/`

En fil per skärm.

| Fil | Rutt | Innehåll |
| --- | --- | --- |
| `Home.jsx` | `/` | Annonser, sök, kategorifilter |
| `Login.jsx` | `/login` | Inloggning |
| `Register.jsx` | `/register` | Registrering |
| `Items.jsx` | `/items` | Listvy för annonser |
| `ItemDetails.jsx` | `/items/:id` | En annons |
| `AddItem.jsx` | `/add-item` | Ny annons (botten: Post) |
| `EditItem.jsx` | `/items/:id/edit` | Redigera annons |
| `Dashboard.jsx` | `/dashboard` | Egna annonser och förfrågningar |
| `Profile.jsx` | `/profile` | Uppgifter, stad, omdömen |
| `Contacts.jsx` | `/contacts` | Telefon/e-post efter godkännande |
| `BorrowingDetails.jsx` | `/borrow-requests/:id` | En förfrågans status |

### `components/`

Uppdelat efter funktion, inte efter ramverk.

```
components/
├── layout/     Bottenmeny, sidhuvud, sidomslag
├── common/     Små återanvändbara fält och knappar
├── items/      Annonskort, lista, sök, filter, formulär
├── borrow/     Förfrågan, status, kort
├── reviews/    Omdömeskort, lista, formulär
├── contacts/   Kontaktkort
└── profile/    Profiluppgifter och stadsval
```

### `services/`

En service per API-område. Alla anrop ska senare gå via `fetch`.

### `hooks/` och `context/`

- `AuthContext` / `useAuth` – inloggad användare och JWT
- `CityContext` / `useCity` – vald stad
- `useItems`, `useBorrowRequests` – listor och uppdatering

### `assets/`

- `images/` – logotyp och statiska bilder
- `styles/` – vanlig CSS, en fil per yta

---

## Backend

Node.js + Express. Kod delas efter funktion: auth, users, items, categories, borrowRequests, reviews.

### Rot

| Fil | Senare ansvar |
| --- | --- |
| `backend/app.js` | Express-app, middleware, rutter |
| `backend/server.js` | Startar servern |

### Mappar

| Mapp | Senare ansvar |
| --- | --- |
| `controllers/` | Tar emot HTTP, anropar services |
| `routes/` | Kopplar URL:er till controllers |
| `middleware/` | JWT, fel, validering |
| `models/` | Databasfrågor per tabell |
| `db/` | Anslutning och SQL-skal för schemat |
| `services/` | Affärsregler (statusbyten, ägarskap) |

Varje feature har motsvarande `*Controller.js`, `*Routes.js`, `*Model.js` och `*Service.js`.

---

## Vad som medvetet saknas nu

- Ingen `package.json`-logik, inga beroenden installerade i detta steg
- Ingen React-komponentkod
- Ingen Express-kod
- Inga SQL-`CREATE TABLE`
- Ingen JWT-/bcrypt-implementation


