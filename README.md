# Hyra inte Köpa (Borrow Not Buy)

Community-plattform för att låna ut och låna vardagsprylar i stället för att köpa nytt.

## Dokumentation

- [Projektplan (svenska)](./Docs/Projektplan.md) – produktbeskrivning, scope, datamodell och API
- [Mappstruktur](./Docs/Mappstruktur.md) – mappar och filer i repot
- [Teckstack](./Docs/Teckstack.md) – fast teknikval för hela produkten
- [UI/UX](./Docs/UI.UX.md) – navigation, skärmar och stilguide
- [Backend-uppgifter](./Docs/BackendTasks.md) – backend-checklista
- [Frontend-uppgifter](./Docs/FrontendTasks.md) – frontend-checklista
- [Avstämning](./Docs/avstämning.md) – status per del (backend, frontend, UI/UX)

## Projektstruktur

```
Docs/       Produktplan, UI/UX och avstämning
frontend/   React + React Router + vanlig CSS (Vite)
backend/    Node.js + Express + PostgreSQL
```

## Teknikstack

React, React Router, vanlig CSS, Node.js, Express, PostgreSQL, JWT, bcrypt.

---

## Kom igång lokalt

Du behöver **Node.js 18+** och **PostgreSQL**. Kör backend och frontend i två olika terminalfönster.

### 1. Databas

Skapa databasen `hk` och kör schema och seed (från mappen `backend`):

```bash
createdb hk
psql -d hk -f db/schema.sql
psql -d hk -f db/seed.sql
```

`schema.sql` raderar och skapar om alla tabeller, så all data försvinner om du kör den igen.

Har du redan en databas från innan handpenning och stadsdel fanns? Kör migreringen i stället, den behåller all data:

```bash
psql -d hk -f db/migrations/001_deposit_area.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env    # fyll i DB-uppgifter och JWT_SECRET
npm install
npm run dev
```

Testa: öppna `http://localhost:5000/api/health` → `{"status":"ok"}`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env    # VITE_API_URL ska peka på backend
npm install
npm run dev
```

Öppna `http://localhost:5173`. Mer info i [frontend/README.md](./frontend/README.md).

---

## Mac: viktigt att veta

### Port 5000 är upptagen av AirPlay

På Mac använder **AirPlay-mottagaren port 5000**. Då kan backend inte starta, men den skriver ändå `Server running on http://localhost:5000` och avslutas direkt efter (`[nodemon] clean exit`). Express 5 kastar inget fel i det läget, så det är lätt att missa.

Kontrollera med:

```bash
lsof -i :5000
```

Står det `ControlCe` (Control Center) är det AirPlay. **Lösning:** kör backend på port 5001.

- `backend/.env`: `PORT=5001`
- `frontend/.env`: `VITE_API_URL=http://localhost:5001`
- Starta om båda (`Ctrl+C` och sedan `npm run dev`), eftersom `.env` bara läses vid start.

Alternativ: stäng av AirPlay-mottagaren i Systeminställningar → Allmänt → AirDrop och Handoff.

### PostgreSQL med Homebrew

```bash
brew install postgresql@16
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
brew services run postgresql@16   # startar databasen (kör igen efter omstart av datorn)
```

Med Homebrew är användaren ditt Mac-användarnamn och lösenordet tomt. I `backend/.env`:

```
DB_USER=ditt-mac-användarnamn
DB_PASSWORD=
```

---

## Regler

- Hemligheter (`.env`, lösenord, JWT-nyckel) committas aldrig. Bara `.env.example`.
- Jobba på en egen branch och gör en PR mot `main`.
- Kommentarer i koden skrivs på svenska.
