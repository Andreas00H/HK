# HK Backend (Hyra inte Köpa)

REST-API med Node.js, Express och PostgreSQL.

## Installation

```
cd backend
npm install
```

## Miljövariabler

Kopiera `.env.example` till `.env` och fyll i värdena. `.env` ska aldrig committas.

| Variabel | Beskrivning |
| --- | --- |
| `PORT` | Port för servern (standard 5000) |
| (databasvariabler, se .env.example) | Anslutning till PostgreSQL |
| `JWT_SECRET` | Hemlig nyckel för JWT, välj en lång slumpmässig sträng |
| (JWT-livslängd, se .env.example) | Hur länge en token gäller, t.ex. 7d |
| `FRONTEND_URL` | Frontendens adress för CORS, t.ex. http://localhost:5173 |

## Databas (återställ från början)

1. Skapa en tom PostgreSQL-databas (t.ex. i pgAdmin).
2. Kör `db/schema.sql` (raderar och skapar om alla tabeller).
3. Kör `db/seed.sql` (lägger in kategorierna).
4. Starta servern.

Exempel med psql:

```
psql -U <användare> -d <databas> -f db/schema.sql
psql -U <användare> -d <databas> -f db/seed.sql
```

OBS: `schema.sql` tar bort all befintlig data.

## Köra servern

```
npm run dev
```

Kontrollera att den lever: `GET http://localhost:5000/api/health` ger `{ "status": "ok" }`.

## Endpoints

Skyddade endpoints kräver headern `Authorization: Bearer <JWT>`.

| Metod | Sökväg | Skyddad | Beskrivning |
| --- | --- | --- | --- |
| GET | /api/health | Nej | Hälsokontroll |
| POST | /api/auth/register | Nej | Skapa konto |
| POST | /api/auth/login | Nej | Logga in, ger JWT |
| GET | /api/users/:id | Nej | Publik profil med omdömen |
| GET | /api/categories | Nej | Alla kategorier |
| GET | /api/items | Nej | Annonser (search, category_id, location) |
| GET | /api/items/:id | Nej | En annons |
| POST | /api/items | Ja | Skapa annons |
| PUT | /api/items/:id | Ja (ägare) | Ändra annons |
| DELETE | /api/items/:id | Ja (ägare) | Ta bort annons |
| POST | /api/borrow-requests | Ja | Skicka låneförfrågan |
| GET | /api/borrow-requests/my | Ja | Skickade och mottagna förfrågningar |
| PUT | /api/borrow-requests/:id | Ja (ägare) | Byt status |
| GET | /api/contacts | Ja | Kontakter efter godkännande |
| GET | /api/dashboard | Ja | Översikt |
| POST | /api/reviews | Ja | Lämna omdöme efter COMPLETED |
| GET | /api/reviews/user/:id | Nej | En användares omdömen |

## Statusflöde

`REQUESTED` → `ACCEPTED` → `BORROWED` → `RETURNED` → `COMPLETED`
Avvikande: `REQUESTED` → `DECLINED` och `ACCEPTED` → `DECLINED`.