# Produktplan: Hyra inte Köpa (HK)

**Engelskt projektnamn:** Borrow Not Buy  
**Kurs:** Chas Challenge  
**Typ:** Community-plattform för utlåning och lån av vardagsprylar  
**Dokumentstatus:** Underlag för uppstart (ingen utveckling i detta steg)

---

## 1. Sammanfattning

Hyra inte Köpa är en community-baserad webbplattform där privatpersoner kan **låna ut** och **låna** vardagsprylar av varandra i stället för att köpa saker som bara behövs tillfälligt.

Exempel: någon behöver en borrmaskin en dag, söker på plattformen och hittar en person i samma stad som är villig att låna ut sin.

Plattformen ersätter inte köp helt. Den gör det enkelt att **dela saker som redan finns**, spara pengar och minska onödig konsumtion.

Projektet är medvetet avgränsat. Inga privata chattar, ingen intern betalning och ingen GPS-baserad närhet. Kontakt och betalning sköts utanför appen när en förfrågan är godkänd.

---

## 2. Problem och mål

### 2.1 Problem

Många köper saker som används få gånger, till exempel verktyg, campingutrustning, köksprylar och annan hushållsutrustning. Det leder till:

- onödiga utgifter
- överkonsumtion
- fler oanvända saker och mer avfall
- att människor äger saker som andra redan har och skulle kunna dela

### 2.2 Huvudmål

Göra det enkelt att dela och återanvända saker som redan finns, i stället för att köpa nytt för tillfälligt behov.

### 2.3 Effektmål

- Spara pengar för både den som lånar och den som lånar ut (hyra per dag).
- Minska onödig konsumtion.
- Bygga tillit i communityn genom omdömen.
- Göra utlåning till främlingar mer motiverande genom tydligt dygnspris.

---

## 3. Målgrupp

Primär målgrupp: privatpersoner som vill låna eller låna ut vardagsprylar i sin stad.

Typiska användare:

- **Utlånare (A):** äger en sak, skapar en annons, tar emot förfrågningar, godkänner eller nekar, lämnar ut saken och tar emot den tillbaka.
- **Lånare (B):** söker en sak, skickar förfrågan, får kontaktuppgifter vid godkännande, hämtar/lämnar och betalar utanför appen.

En och samma person kan vara både A och B.

---

## 4. Avgränsning (scope)

Projektet ska vara smalt, tydligt och genomförbart. Följande beslut är fasta.

### 4.1 Ingår i version 1

- Konto: registrering, inloggning, enkel profil
- Annons: rubrik, foton, beskrivning, kategori, skick, stad, tillgänglighet, hyra per dag, ev. deadline för återlämning i beskrivning/fält
- Hem: alla annonser i vald stad, kategorifilter och sök
- Förfrågan om att låna under en period
- Statusflöde för förfrågan
- Godkänn / neka förfrågan
- Möjlighet att avböja även efter godkännande
- Kontakter: telefon och/eller e-post efter godkänd förfrågan
- Profil: personuppgifter, stad, omdömen
- Dashboard: egna annonser, lån, skickade och mottagna förfrågningar
- Omdömen och betyg efter avslutad uthyrning
- JWT-autentisering

### 4.2 Ingår inte i version 1

| Idé | Varför den är borttagen |
| --- | --- |
| Privata DMs / chatt | För stort. Kontakt via telefon/e-post under **Kontakter**. |
| Intern betalning (Swish, PayPal i appen) | För stort. A och B sköter betalning själva. |
| Platsbaserad närhet som Blocket/Marketplace (GPS/avstånd) | För stort. Användaren väljer **stad** i profilen och ser annonser i den staden. |
| Poängsystem, presentkort, belöningar | Skrotad idé. Satsning ligger på omdömen. |
| Extra frontend-ramverk (Tailwind, MUI, Bootstrap, styled-components) | Fast stack: React + vanlig CSS. |
| Extra backend-ramverk utöver Express | Fast stack. |

### 4.3 Viktiga produktbeslut

- **Betalning:** synligt dygnspris i annonsen. Eventuell prutning sker utanför appen. Ägaren kan skriva i beskrivningen att priset är förhandlingsbart.
- **Kontakt:** öppnas inte som chatt. När förfrågan är godkänd syns motpartens telefon och/eller e-post under Kontakter.
- **Stad:** användaren väljer stad i profilen och kan byta stad för att se andra annonser.
- **Tillit:** omdömen är kärnan. Ägaren kan neka en förfrågan om lånaren har negativa omdömen, t.ex. “fick aldrig tillbaka mina grejer”.
- **Motivation att låna ut:** hyra per dag.

---

## 5. Begrepp

| Begrepp | Betydelse |
| --- | --- |
| Annons / sak | En post i `items` som någon vill låna ut |
| Förfrågan | En `borrow_request` från lånare till ägare |
| Uthyrning / lån | Samma förfrågan när den rör sig genom statusarna |
| Kontakt | Godkänd motpart vars telefon/e-post visas |
| Stad | Filtreringsnyckel för vilka annonser som visas |
| Dygnspris | `lending_price` per dag |
| Omdöme | Betyg + kommentar kopplad till en förfrågan |

Det finns **ingen separat Borrowings-tabell**. En uthyrning är en förfrågan som byter status.

---

## 6. Informationsarkitektur och navigation

### 6.1 Bottennavigation

Appen har en bottenmeny med fyra lägen:

1. **Hem** – alla annonser i vald stad. Överst: kategorifilter och sök.
2. **Post** – skapa ny annons.
3. **Kontakter** – sparade kontaktuppgifter efter godkända förfrågningar.
4. **Profil** – omdömen, stad och personuppgifter.

Dashboard och förfrågningsdetaljer nås från Hem, Profil eller notiser/listor inne i appen, men de fyra bottenvalen är den primära navigeringen.

### 6.2 Frontend-rutter

| Sökväg | Sida | Syfte |
| --- | --- | --- |
| `/` | Hem | Annonslista, sök, kategorifilter |
| `/login` | Logga in | Inloggning |
| `/register` | Registrera | Skapa konto |
| `/items` | Bläddra | Samma annonslista som Hem (tydlig listvy) |
| `/items/:id` | Annonsdetaljer | All information om saken och ägaren |
| `/add-item` | Skapa annons | Post-flödet |
| `/items/:id/edit` | Redigera annons | Ägaren uppdaterar sin annons |
| `/dashboard` | Översikt | Egna annonser, lån och förfrågningar |
| `/profile` | Profil | Uppgifter, stad, omdömen |
| `/contacts` | Kontakter | Telefon/e-post till godkända motparter |
| `/borrow-requests/:id` | Förfrågan | Status, parter, nästa steg |

Skyddade sidor (kräver inloggning): skapa/redigera annons, dashboard, profil, kontakter, skicka förfrågan, omdöme.

---

## 7. Sidor – innehåll och krav

### 7.1 Hem (`/`)

- Visar annonser i användarens valda stad. Gäst kan se en stad eller uppmanas att välja/logga in.
- **Sök** på t.ex. borrmaskin, tält, stege, projektor, köksutrustning, kablar.
- **Kategorifilter** överst, t.ex. Verktyg, Elektronik, Utomhus, Kök, Trädgård, Hobby, Hem, Möbler.
- Varje kort visar minst: foto, rubrik, dygnspris, stad, kategori.
- Klick leder till annonsdetaljer.

### 7.2 Logga in / Registrera

- Registrering: namn, e-post, telefon, lösenord, stad.
- Inloggning: e-post och lösenord.
- Lyckad inloggning ger JWT som frontend sparar och skickar med skyddade anrop.

### 7.3 Annonsdetaljer (`/items/:id`)

Visar:

- namn, foton, beskrivning, kategori, skick, stad
- dygnspris, tydligt och framträdande
- tillgänglighet
- ägare (namn, länk till profil/omdömen)
- knapp för att skicka låneförfrågan (inte ägaren själv)

### 7.4 Skapa / redigera annons

Obligatoriska fält i version 1:

- Rubrik
- Foton
- Beskrivning (här kan ägaren skriva t.ex. “öppen för att förhandla priset” eller återlämningsdeadline)
- Kategori
- Skick
- Stad (förifylls från profil, kan justeras)
- Tillgänglighet
- Pris per dag

Endast ägaren får redigera eller ta bort sin annons.

### 7.5 Dashboard

Användaren ser:

- annonser hen har lagt upp
- saker hen lånar / har begärt
- förfrågningar hen har skickat
- förfrågningar från andra på egna annonser

Här sker godkänn, neka, markera utlämnad, återlämnad och avslutad.

### 7.6 Förfrågan / lånedetaljer

Visar sak, period, status, parter och tillåtna åtgärder för inloggad roll (ägare eller lånare).

### 7.7 Kontakter

Lista över personer användaren har en **godkänd** förfrågan med (pågående eller avslutad enligt senare regel). Visar namn, telefon och/eller e-post så att parterna kan komma överens om upphämtning, återlämning och betalning (Swish, PayPal m.m.) utanför appen.

Ingen chatt i appen.

### 7.8 Profil

- Namn, e-post, telefon
- Välja och byta **stad** (styr vilka annonser som syns)
- Omdömen andra lämnat om användaren
- Ev. kort aktivitet (antal annonser, avslutade lån)

---

## 8. Funktioner i detalj

### 8.1 Konto

- Skapa konto och logga in.
- Grundprofil: namn och aktivitet.
- Lösenord lagras som hash (bcrypt), aldrig i klartext.
- JWT identifierar användaren vid skyddade handlingar.

### 8.2 Annons

Användare listar en sak de äger och vill låna ut.

### 8.3 Sök och filter

- Fritextsök
- Filter på kategori
- Filter på stad via profilens valda stad (inte GPS-radie)

### 8.4 Låneförfrågan

Lånaren väljer sak och period (`start_date`, `end_date`). Ägaren godkänner eller nekar. Ägaren bör kunna se lånarens omdömen innan beslut.

### 8.5 Status för förfrågan

Tillåtna värden:

- `REQUESTED`
- `ACCEPTED`
- `DECLINED`
- `BORROWED`
- `RETURNED`
- `COMPLETED`

Huvudflöde:

```
REQUESTED → ACCEPTED → BORROWED → RETURNED → COMPLETED
```

Avvikande flöden som ska stödjas:

```
REQUESTED → DECLINED
ACCEPTED → DECLINED
```

`ACCEPTED → DECLINED` finns med eftersom ägaren ska kunna ångra ett godkännande, t.ex. om lånaren prutar för hårt utanför appen.

`PUT /api/borrow-requests/:id` hanterar alla statusbyten. Backend ska kontrollera att övergången är giltig och att rätt person gör den.

### 8.6 Vem får göra vad

| Handling | Vem |
| --- | --- |
| Skicka förfrågan | Inloggad användare som inte äger saken |
| Godkänn / neka | Ägaren |
| Avböj efter godkännande | Ägaren |
| Markera utlämnad (`BORROWED`) | Ägaren (ev. båda i senare version; v1: ägaren) |
| Markera återlämnad (`RETURNED`) | Ägaren |
| Markera avslutad (`COMPLETED`) | Ägaren, eller båda om tid finns |
| Lämna omdöme | Båda parter efter `COMPLETED` |

### 8.7 Omdömen

Efter `COMPLETED` kan båda lämna betyg och kort kommentar.

Syfte: skapa tillit. En ägare ska kunna neka någon med flera negativa omdömen.

**Öppen produktfråga:** I scenariot där A avböjer en redan godkänd förfrågan och vill lämna negativt omdöme finns ingen `COMPLETED`-status. Rekommendation för v1: omdöme endast efter `COMPLETED`. Alternativ att besluta innan implementation: tillåt omdöme även efter `DECLINED` om förfrågan tidigare varit `ACCEPTED`. Detta dokumenteras här så att det inte glöms.

Ett omdöme kopplas till:

- förfrågan (`borrowing_id`)
- den som skriver (`reviewer_id`)
- den som recenserades (`reviewed_user_id`)
- betyg och kommentar

### 8.8 Notiser (förenklat)

Full push-notis är inte ett måste i v1. Minsta nivå:

- synlig lista/badge på dashboard och kontakter när status ändras
- lånaren ser att förfrågan är godkänd eller nekad
- ägaren ser ny förfrågan

Om tid finns kan en enkel intern notislista läggas till. Inte ett eget system för e-post/SMS i v1.

### 8.9 Kontakter i stället för DM

När A godkänner B:s förfrågan ska B kunna se A:s telefon och/eller e-post under Kontakter, och A ska kunna se B:s. Samma princip oavsett vem som äger saken.

### 8.10 Bilduppladdning

Annons ska kunna ha foton. I v1 kan `image_url` räcka (en eller flera URL:er beroende på tid). Faktisk fillagring kan vara enkel (lokal mapp eller extern URL) utan extra molntjänst utöver det som behövs för att visa bild.

---

## 9. Användarflöden

### 9.1 Typisk lånare

Skapa konto → Välj stad → Sök/filtrera på Hem → Öppna annons → Skicka förfrågan → Ägare godkänner → Se kontakt under Kontakter → Kom överens om upphämtning och betalning utanför appen → Låna → Lämna tillbaka → Avsluta → Omdöme

### 9.2 Typisk utlånare

Skapa konto → Skapa annons (Post) → Publicera → Ta emot förfrågan → Titta på lånarens omdömen → Godkänn eller neka → Lämna ut → Få tillbaka → Avsluta → Omdöme

### 9.3 Scenario: kablar (kärnberättelse)

1. A skapar en annons om kablar hen vill låna ut (rubrik, foton, beskrivning, dygnspris).
2. B ser annonsen på Hem och skickar förfrågan.
3. A får veta att en förfrågan kommit och kan godkänna eller neka. A kan titta på B:s omdömen.
4. A godkänner.
5. B ser att förfrågan är godkänd.
6. B hittar A:s telefon/e-post under Kontakter (ingen privat chatt i appen).
7. De sköter upphämtning och t.ex. Swish själva.

### 9.4 Scenario: negativa omdömen

B har omdömen i stil med “fick aldrig tillbaka mina grejer” eller “fick tillbaka men trasigt”. A ser detta på B:s profil och nekar förfrågan.

### 9.5 Scenario: prutning efter godkännande

A blir irriterad för att B prutar för hårt i kommunikationen utanför appen. A går tillbaka till appen, avböjer den godkända förfrågan (`ACCEPTED` → `DECLINED`) och vill lämna negativt omdöme. Statusbytet ska finnas i v1. Omdöme i just detta läge är den öppna frågan i avsnitt 8.7.

---

## 10. Datamodell

Fem tabeller i PostgreSQL. Inga fler tabeller i v1.

### 10.1 `users`

| Fält | Typ / roll |
| --- | --- |
| `id` | PK |
| `name` | namn |
| `email` | unik e-post |
| `phone` | telefonnummer |
| `password_hash` | bcrypt |
| `location` | stad (styr annonsvy) |
| `created_at` | skapad |

### 10.2 `categories`

| Fält | Typ / roll |
| --- | --- |
| `id` | PK |
| `name` | t.ex. Verktyg, Elektronik, Utomhus, Kök, Trädgård, Hobby, Hem, Möbler |

### 10.3 `items`

| Fält | Typ / roll |
| --- | --- |
| `id` | PK |
| `owner_id` | FK → `users.id` |
| `category_id` | FK → `categories.id` |
| `name` | rubrik |
| `lending_price` | pris per dag |
| `description` | beskrivning, ev. förhandling/deadline |
| `condition` | skick |
| `location` | stad för annonsen |
| `image_url` | bild |
| `available` | om saken kan efterfrågas |
| `created_at` | skapad |

### 10.4 `borrow_requests`

| Fält | Typ / roll |
| --- | --- |
| `id` | PK |
| `item_id` | FK → `items.id` |
| `borrower_id` | FK → `users.id` |
| `start_date` | startdatum |
| `end_date` | slutdatum |
| `status` | se statuslista |
| `created_at` | skapad |

Status får endast vara: `REQUESTED`, `ACCEPTED`, `DECLINED`, `BORROWED`, `RETURNED`, `COMPLETED`.

### 10.5 `reviews`

| Fält | Typ / roll |
| --- | --- |
| `id` | PK |
| `borrowing_id` | FK → `borrow_requests.id` |
| `reviewer_id` | FK → `users.id` |
| `reviewed_user_id` | FK → `users.id` |
| `rating` | betyg |
| `comment` | kommentar |
| `created_at` | skapad |

### 10.6 Kopplingar

```
USERS ──äger──► ITEMS ──har──► BORROW_REQUESTS ──har──► REVIEWS
                    ▲
CATEGORIES ──har────┘

USERS ──är lånare──► BORROW_REQUESTS
USERS ──skriver/tar emot──► REVIEWS
```

Kontakter i v1 härleds: användare som har en förfrågan med status `ACCEPTED` eller senare (utom ev. `DECLINED`) mot varandra. Ingen extra `contacts`-tabell krävs om listan byggs från `borrow_requests` + `users`.

---

## 11. REST API

Frontend pratar med backend via en enkel REST-API. Inga extra anrop utöver detta i v1, förutom det som behövs för att läsa inloggad användares profil (kan vara `GET /api/users/:id`).

### Autentisering

- `POST /api/auth/register`
- `POST /api/auth/login`

Flöde vid inloggning:

```
React → POST /api/auth/login → Express → PostgreSQL → JWT → React
```

JWT används vid bland annat: skapa/redigera annons, skicka förfrågan, godkänna förfrågan, skapa omdöme.

### Användare

- `GET /api/users/:id`

### Kategorier

- `GET /api/categories`

### Annonser / saker

- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`

`GET /api/items` ska kunna filtreras på kategori, sökord och stad.

### Låneförfrågningar

- `POST /api/borrow-requests`
- `GET /api/borrow-requests/my`
- `PUT /api/borrow-requests/:id`

`PUT` hanterar godkänn, neka, utlämning, återlämning och avslut.

### Omdömen

- `POST /api/reviews`
- `GET /api/reviews/user/:id`

Alla skyddade endpoints validerar indata i backend.

---

## 12. Fast teknikstack

Stacken är låst. Lägg inte till teknik bara för att den finns.

| Område | Teknik |
| --- | --- |
| Frontend | React |
| Routing | React Router |
| Språk i klient | JavaScript |
| Stil | Vanlig CSS |
| Backend | Node.js + Express |
| Databas | PostgreSQL |
| Auth | JWT |
| Lösenord | bcrypt |
| HTTP från klient | Fetch |
| Versionshantering | Git + GitHub |
| API-test | Postman |
| Databashantering | pgAdmin |
| Drift | Render |
| Projektstyrning | GitHub Projects |

Utvecklingsstruktur:

- Backend: `controllers`, `routes`, `middleware`, `models`, `db`, `services`, `app.js`, `server.js`
- Frontend: `components`, `pages`, `services`, `hooks`, `context`, `assets`, `App.jsx`, `main.jsx`
- Kod delas efter funktion: `auth`, `users`, `items`, `categories`, `borrowRequests`, `reviews`

---

## 13. Icke-funktionella krav

- Tydligt dygnspris i lista och detaljvy.
- Svenskt användarspråk i gränssnittet.
- Enkel, ren CSS. Ingen visuell överdesign.
- Mobilvänlig layout, eftersom primär navigation sitter i botten.
- Backend ska neka ogiltiga statusbyten och åtgärder från fel person.
- Inga hemligheter i kod (lösenord, JWT-nyckel via miljövariabler senare).
- Kommentarer i källkod på **svenska**.

---

## 14. Acceptanskriterier för v1

En användare ska kunna:

1. Registrera sig, logga in och välja stad.
2. Lägga upp en annons med rubrik, foto, beskrivning och dygnspris.
3. Se annonser för vald stad, söka och filtrera på kategori.
4. Öppna en annons och skicka en förfrågan för ett datumintervall.
5. Som ägare godkänna eller neka, inklusive neka efter tidigare godkännande.
6. Efter godkännande se motpartens telefon och/eller e-post under Kontakter.
7. Föra förfrågan genom `BORROWED` → `RETURNED` → `COMPLETED`.
8. Lämna och läsa omdömen på profilen.
9. Se egna annonser och förfrågningar i dashboard.

Utanför v1: chatt, inbyggd betalning, GPS-närhet, poängshop.

---

## 15. Föreslagen ordning (utan implementation nu)

1. Databas och tom backend-struktur
2. Auth (register/login + JWT)
3. Kategorier och annonser (CRUD, sök, filter, stad)
4. Förfrågningar och statusmotor
5. Kontakter baserade på godkända förfrågningar
6. Dashboard, profil, omdömen
7. CSS och genomgående användarflöde
8. Test i Postman + manuell genomkörning av kabelscenariot

Ingen av dessa punkter implementeras i det här steget. Här skapas endast plan och mapp-/filstruktur.

---

## 16. Relaterade dokument

- [Mappstruktur.md](./Mappstruktur.md) – mappar och filer som skapas nu, utan affärslogik.
