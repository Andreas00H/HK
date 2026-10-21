# Frontend – Hyra inte Köpa (HK)

React + React Router + vanlig CSS, byggd med Vite. Design: [Docs/UI.UX.md](../Docs/UI.UX.md).

## Kom igång

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Öppna http://localhost:5173. Backend ska köra på http://localhost:5000 (se `backend/`).

## Kommandon

| Kommando | Gör |
| --- | --- |
| `npm run dev` | Startar dev-servern |
| `npm run lint` | Kollar koden med ESLint |
| `npm run build` | Bygger produktionsversionen till `dist/` |

## Regler

- Färger, typsnitt och avstånd finns som CSS-variabler i `assets/styles/index.css`. Använd `var(--...)`, skriv aldrig hårdkodade färger.
- Alla anrop till backend går via `apiFetch` i `services/api.js`.
- Kommentarer i koden skrivs på svenska.
- Jobba på en egen branch och gör en PR mot `main`.
