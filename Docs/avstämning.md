Backend   --- Ernest + Alex ---


# Avstämning: Backend och databas

**Projekt:** Hyra inte Köpa (HK)
**Ansvarig:** Ernest
**Datum:** 2026-10-08
**Status:** Vecka 1 och 2 klara och testade. Vecka 3 (hårdning och drift) återstår.

---

## 1. Kort sammanfattning

Backend och databas för v1 är byggda enligt projektplanen. Hela flödet fungerar från registrering till omdöme: användare skapar annonser, andra skickar förfrågningar, ägaren för förfrågan genom alla statusar, kontaktuppgifter visas först efter godkännande, och båda parter kan lämna omdömen efter avslutat lån.

Stacken är oförändrad: Node.js + Express, PostgreSQL, JWT, bcrypt.

---

## 2. Databas

Fem tabeller (inga extra): `users`, `categories`, `items`, `borrow_requests`, `reviews`.

- Filer: `backend/db/schema.sql`, `seed.sql` och `db.js` (anslutning).
- Databasen skyddar sig själv: giltiga statusvärden, betyg 1–5, pris minst 0, slutdatum inte före startdatum, unik e-post och ett omdöme per person och lån.
- Index finns på de kolumner som används vid filtrering och kopplingar.
- Seed fyller de åtta kategorierna (kan köras flera gånger utan dubbletter).

---

## 3. Funktioner som fungerar

| Område | Endpoint | Inloggning |
| --- | --- | --- |
| Hälsa | `GET /api/health` | Nej |
| Konto | `POST /api/auth/register`, `POST /api/auth/login` | Nej |
| Profil | `GET /api/users/:id` (namn, stad, omdömen, snittbetyg) | Nej |
| Kategorier | `GET /api/categories` | Nej |
| Annonser | `GET /api/items` (sök, `category_id`, `location`), `GET /api/items/:id` | Nej |
| Annonser | `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id` | Ja, endast ägaren ändrar/raderar |
| Förfrågningar | `POST /api/borrow-requests` | Ja |
| Förfrågningar | `GET /api/borrow-requests/my` (skickade och mottagna) | Ja |
| Förfrågningar | `PUT /api/borrow-requests/:id` (statusbyte) | Ja, endast ägaren |
| Kontakter | `GET /api/contacts` | Ja |
| Dashboard | `GET /api/dashboard` (egna annonser, skickade, mottagna, pågående) | Ja |
| Omdömen | `POST /api/reviews`, `GET /api/reviews/user/:id` | Skriva: ja. Läsa: nej |

### Viktiga regler som backend upprätthåller

- **Statusflöde:** `REQUESTED → ACCEPTED → BORROWED → RETURNED → COMPLETED`. Ägaren kan även välja `DECLINED` från `REQUESTED` eller `ACCEPTED`. Alla andra byten nekas (409). Klienten skickar bara önskad status, servern avgör om bytet är giltigt.
- **Behörighet:** bara ägaren ändrar status och sina annonser (403 för andra). Man kan inte låna sin egen sak.
- **Kontakter:** telefon och e-post visas bara när förfrågan är `ACCEPTED` eller längre fram, aldrig vid `REQUESTED` eller `DECLINED`. Profiler och listor innehåller aldrig kontaktuppgifter.
- **Omdömen:** bara efter `COMPLETED`, bara av de två parterna, mot motparten, betyg 1–5, ett per person och lån.
- **Lösenord:** hashas med bcrypt, `password_hash` skickas aldrig till klienten. Samma felmeddelande vid fel e-post eller fel lösenord.
- **SQL:** alla frågor är parameteriserade.

---

## 4. Hur det gick

- Allt är testat manuellt, både godkända fall och nekade fall (400, 401, 403, 404, 409).
- Postman fungerade inte på min dator (Cloud Agent kan inte nå localhost och Desktop Agent installerades inte). Jag testade i stället med PowerShell (`Invoke-RestMethod`). Samma anrop kan göras i Postman av den som har det igång.
- Problem som löstes på vägen:
  - PostgreSQL saknades i PATH och postgres-lösenordet var glömt. Återställt, och inloggning krävs igen.
  - Kategorierna blev tomma när schemat kördes om. Seeden gjordes säker att köra om.
  - Priset kom som text (`"50.00"`). Nu returneras det som tal.
  - Datum kunde skiftas en dag av tidszon. Nu returneras `ÅÅÅÅ-MM-DD`.

---

## 5. Att diskutera i gruppen

1. **Radering av annons** raderar även dess förfrågningar och omdömen (`ON DELETE CASCADE`). Vi kan i stället blockera radering om det finns pågående lån.
2. **Ingen kontroll av överlappande datum.** Samma sak kan få flera godkända förfrågningar för samma dagar. Planen kräver det inte i v1.
3. **Omdöme efter `DECLINED`** (öppen fråga i planen, avsnitt 8.7). Nu gäller omdöme endast efter `COMPLETED`.
4. **Svarsformat:** listor returneras som `{ items: [...] }`, `{ contacts: [...] }` osv., enstaka objekt som `{ item: {...} }`. Fel returneras som `{ "error": "text" }` på svenska. Frontend kan förlita sig på detta.

---

## 6. Kvar (Vecka 3)

- Genomgång av validering på all indata
- Gemensam felhantering (`errorMiddleware`) och inga stack traces i produktion
- CORS låst till frontendens adress (just nu öppen)
- Postman-svit eller motsvarande testskript
- `backend/README.md` (installation, `.env`, återställning av databas, endpoints)
- Driftsättning på Render (databas, miljövariabler, test av `/api/health` och hela flödet)

---

## 7. Köra backend lokalt

1. Installera PostgreSQL och skapa databasen `hk`.
2. Kopiera `backend/.env.example` till `backend/.env` och fyll i värdena.
3. Kör `db/schema.sql` och därefter `db/seed.sql` (schema raderar och skapar om alla tabeller).
4. `npm install` och sedan `npm run dev` i mappen `backend`.






Frontend    ------ Andy  + Alex ----








UI/UX----- Andy  + Chippe -----