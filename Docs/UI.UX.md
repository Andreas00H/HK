# UI / UX – Hyra inte Köpa (HK)

Ansvarig: Andy (UI/UX) med Chipego (komponenter, Profil och Kontakter)
Status: **v2.0, 2026-10-26.** Uppdaterad efter att den nya designen gick in i `main` (PR #14). Beskriver appen som den är byggd nu.

**Live:** [hk-frontend.onrender.com](https://hk-frontend.onrender.com/)

**Figma:**
- [Uthyrningsapp – startunderlag](https://www.figma.com/design/N3d2cSRBpiXYlsmCAxP6F8/Uthyrningsapp-%E2%80%93-startunderlag) (Chipego) är designen appen följer från v2.
- [HK – Mockups](https://www.figma.com/design/7Ks6k91BOnLcywdfrUiZPU/HK--Mockups) (Andy) var v1 och grunden för startunderlaget.

Bygger på Andys brainstorm "Hyr istället för köp" ([Brainstorm.pdf](./Brainstorm.pdf)). Innehåll och krav per sida finns i [Projektplan.md](./Projektplan.md).

### Hur designen har vuxit fram

| Version | Datum | Vad |
| --- | --- | --- |
| v1 | 2026-09-30 | Navigation, skärmar och stilguide (Andy). Blått och tryggt, kompakt som Blocket. |
| v1.1 | 2026-10-13 | Fem mockups i Figma och beslut i gruppen: handpenning, stadsdel, badges, gäster. |
| | 2026-10-14 | Chipego bygger vidare: knappar och komponenter i Figma, Profil och Kontakter (avsnitt 8). |
| | 2026-10-22 | Test i webbläsaren: kartnål i stället för ▾ vid staden (Andy). |
| v2.0 | 2026-10-26 | Alex bygger hela appen efter startunderlaget (PR #14). Granskning före merge: handpenning, stadsdel, "Ledig", kartnål, omdömen och WCAG-kontrast behölls eller rättades. |

---

## 1. Designprinciper

1. **Tryggt och tydligt.** Blå grundfärg som signalerar tillit. Man lånar ut saker till främlingar, så appen ska kännas seriös.
2. **Modernt men enkelt.** Rundade kort och knappar som i appar man redan kan (Vinted, Blocket), luftigt men utan effekter.
3. **Dygnspriset syns alltid.** I fetstil på varje kort och i en fast rad längst ned på annonssidan.
4. **Mobil först.** Designat för 375–390 px bredd. Samma innehåll växer till dator.
5. **Svenska överallt** i knappar, rubriker och felmeddelanden.
6. **Allt som visas finns i databasen** eller räknas fram (t.ex. beräknad hyra). Inget som lovar mer än appen kan.
7. **Tillgängligt.** WCAG AA-kontrast, klickytor minst 44 px och status alltid i text.

---

## 2. Navigation

### 2.1 Bottenmeny (mobil)

Fast längst ned. Alltid fyra val i samma ordning, ikon ovanför text:

| Ordning | Text | Rutt | Ikon | Kräver inloggning |
| --- | --- | --- | --- | --- |
| 1 | Hem | `/` | hus | Nej |
| 2 | **Lägg upp** | `/add-item` | plus i en **blå fylld knapp** (huvudhandlingen) | Ja |
| 3 | Kontakter | `/contacts` | personer | Ja |
| 4 | Profil | `/profile` | person | Ja |

- Aktivt val: blå text och ikon. Övriga: grå (`--color-text-muted`).
- Utloggad som trycker på ett skyddat val skickas till Logga in, och tillbaka dit efter inloggning.
- **Ingen bottenmeny** på Annons, Ny annons, Redigera och Förfrågan. Där finns en egen fast rad längst ned (pris och knapp) eller ett kryss för att stänga.

### 2.2 Sidhuvud (dator, från 768 px)

`HK Hyra inte Köpa` till vänster, menyn i mitten och **📍 Stockholm** till höger. Bottenmenyn döljs.
Staden har en kartnål och ingen pil, eftersom den är en länk till Profil och inte en rullista (beslut 2026-10-22).

### 2.3 Toppfält (mobil)

I mobil har varje sida sitt eget toppfält i stället för ett gemensamt sidhuvud:

| Sida | Toppfält |
| --- | --- |
| Hem | "Annonser i" + **📍 Stockholm** (länk till Profil) och **klocka** till höger (inloggad). Röd prick när förfrågningar väntar på svar, leder till Översikt. |
| Annons | Runda knappar ovanpå bilden: **‹ Tillbaka** till vänster och **Dela** till höger. |
| Ny annons / Redigera | **✕** till vänster och rubriken. |
| Förfrågan, Översikt | **‹ Tillbaka** och rubriken. |
| Kontakter, Profil | Stor rubrik. |

### 2.4 Hur man når sidor utanför menyn

| Sida | Hur |
| --- | --- |
| Annons `/items/:id` | Klick på ett annonskort |
| Redigera `/items/:id/edit` | "Redigera annons" på egen annons |
| Översikt `/dashboard` | Profil → "Mina annonser och förfrågningar", eller klockan på Hem |
| Förfrågan `/borrow-requests/:id` | Klick på en förfrågan i Översikt, eller "Följ förfrågan" efter att man skickat en |
| Logga in / Registrera | Automatiskt vid skyddad sida, eller från Profil |

### 2.5 Flöde

```
Lånare: Hem -> Annons -> Välj period -> Skicka förfrågan -> Förfrågan (Väntar)
Ägare:  Klocka / Profil -> Översikt (Mottagna) -> Förfrågan -> Godkänn / Neka
Båda:   Kontakter (telefon + e-post efter Godkänd) -> lånet sker utanför appen
Ägare:  Förfrågan -> Markera utlämnad -> Markera återlämnad -> Avsluta lånet
Båda:   Förfrågan -> Lämna omdöme -> syns på motpartens profil
```

---

## 3. Skärmar

### Hem `/`
- Toppfält: "Annonser i 📍 Stockholm" och klockan.
- Sökfält "Vad vill du låna?" med förstoringsglas.
- Kategorichips i en rad som scrollar i sidled: **Alla** (vald = blå fylld), Verktyg, Elektronik, Utomhus, Kök, Trädgård, Hobby, Hem, Möbler.
- Rubrik "Nya annonser", sedan **kort två per rad** (tre på surfplatta, fyra på dator).
- Kortet: kvadratisk bild (grå ruta med kameraikon om bild saknas eller inte laddar), rubrik på en rad, **dygnspris fet**, 📍 stad och **Ledig**.
- Tomt: "Inga annonser i Stockholm än." med länk till Lägg upp. Ingen träff: "Inga annonser matchar din sökning."

### Annons `/items/:id`
- Bild i full bredd med runda **Tillbaka** och **Dela**.
- Rubrik och **Ledig** (eller "Inte tillgänglig"), **pris i blått** "40 kr per dag" och **Handpenning 150 kr** till höger om ifylld.
- 📍 **Stadsdel, Stad** (t.ex. "Vasastan, Stockholm"), eller bara stad.
- Uppgiftskort med ikoner: Upplagd (datum), Skick, Kategori.
- Beskrivning.
- Ägarkort: initialer (t.ex. **JE**), namn, ★ betyg eller "Inga omdömen än".
- **Välj period** (Från / Till) med beräknad hyra. Antal dagar räknar både första och sista dagen (28 sep–2 okt = 5 dagar).
- **Fast rad längst ned:** "40 kr/dag · Betalas till uthyraren" och **Skicka förfrågan**. Utloggad: knappen leder till Logga in. Ägaren ser **Redigera annons** i stället.

### Ny annons / Redigera `/add-item`, `/items/:id/edit`
- Toppfält med ✕ och "Ny annons" / "Redigera annons".
- Fotoruta med förhandsvisning. Bilden är en länk i v1 ("Klistra in en länk till bilden").
- Fält i en kolumn, etikett ovanför: Rubrik ("Till exempel HDMI kabel 2 m"), Kategori, Skick, Beskrivning.
- **Pris per dag** med "kr per dag" och **Handpenning (frivilligt)** bredvid.
- **Stad** och **Stadsdel (frivilligt)** bredvid varandra. Annonser filtreras bara på stad.
- Reglage **Tillgänglig för utlåning**.
- Tipsruta: "Tips: vill du kunna förhandla priset, skriv det i beskrivningen."
- Knapp **Publicera** / **Spara ändringar**. Vid redigering: **Ta bort annons** (röd) med bekräftelse.
- Felmeddelande i röd text direkt under fältet, och markören flyttas till första felet.

### Förfrågan `/borrow-requests/:id`
Från Chipegos skärm "Ny förfrågan":
- Saken med bild och pris.
- Motparten med ★ betyg och "Medlem sedan".
- Period, antal dagar och **totalt**.
- Status med badge och en rad om vad som händer härnäst.
- **Motpartens omdömen**, så att ägaren kan bedöma lånaren innan beslut (Projektplan 8.4).
- Fast rad längst ned med de knappar ägaren får använda just nu:

| Status | Knappar (ägare) |
| --- | --- |
| Väntar | **Godkänn**, **Neka** (ljusröd) |
| Godkänd | Markera utlämnad, Avböj |
| Utlånad | Markera återlämnad |
| Återlämnad | Avsluta lånet |

- Nekad kan inte ändras tillbaka, därför frågar appen först.
- Efter **Avslutad**: formulär för omdöme (betyg 1–5, valfri kommentar) för båda parter.

### Översikt `/dashboard`
- Flikar **Mottagna**, **Skickade** och **Mina annonser** med antal.
- Varje förfrågan är ett kort med sak, status, period, motpart och "Att göra" för ägaren.
- Mina annonser visar även de som inte är tillgängliga ("Inte tillgänglig").
- Fliken sparas i adressen, så Tillbaka från en förfrågan kommer till rätt flik.

### Kontakter `/contacts`
Från Chipegos specifikation (avsnitt 8.2):
- Flikar **Godkända**, **Väntar** och **Avslutade**.
- Kort: initialer, namn, status, "Du lånar: …" eller "Lånar av dig: …", period, telefon och e-post med **Kopiera**.
- Telefon och e-post visas bara från Godkänd och framåt. Nekade visas aldrig.
- Ingen chatt. Betalning och upphämtning sköts utanför appen.

### Profil `/profile`
Från Chipegos specifikation (avsnitt 8.1):
- Knapp **Mina annonser och förfrågningar** med röd siffra när något väntar.
- Mina uppgifter: initialer, namn, "Medlem sedan", e-post, telefon.
- Stad: rullista + Spara (gäller tills man laddar om eller loggar ut, backend kan inte spara stad än).
- Omdömen: ★ snitt, antal och de senaste omdömena.
- **Logga ut** längst ned.

### Logga in / Registrera
- Centrerat formulär med logotyp. Registrera: namn, e-post, telefon, lösenord, stad.
- Fel under fältet, t.ex. "Fel e-post eller lösenord".
- Ogiltig eller utgången inloggning (401) loggar ut och leder hit.

---

## 4. Stilguide

Alla värden är CSS-variabler i `frontend/assets/styles/index.css`. **Skriv aldrig hårdkodade färger i andra CSS-filer.** Använd `var(--...)`.

### 4.1 Färger

| Variabel | Värde | Används till | Kontrast |
| --- | --- | --- | --- |
| `--color-primary` | `#1D4ED8` | Knappar, länkar, pris, aktivt menyval | 6,7:1 mot vitt |
| `--color-primary-dark` | `#1E40AF` | Hover på knappar | |
| `--color-primary-light` | `#DBEAFE` | Vald flik, "Ledig", initialrutor | |
| `--color-bg` | `#F3F4F6` | Sidans bakgrund | |
| `--color-surface` | `#FFFFFF` | Kort, formulär, menyer | |
| `--color-text` | `#111827` | Brödtext och rubriker | 17,7:1 |
| `--color-text-muted` | `#4B5563` | Hjälptext, oaktiva menyval | 6,9:1 mot grå bakgrund |
| `--color-border` | `#E5E7EB` | Ramar runt kort och avdelare (dekor) | |
| `--color-border-strong` | `#868C97` | **Ramar runt fält** | minst 3:1 (WCAG 1.4.11) |
| `--color-placeholder` | `#E5E7EB` | Tom bildruta | |
| `--color-star` | `#F2A93B` | Stjärnor i betyg | |
| `--color-success` | `#15803D` | Avslutad | 5,0:1 |
| `--color-warning` | `#B45309` | Väntar | 5,0:1 |
| `--color-danger` | `#B91C1C` | Neka, fel, ta bort | 5,6:1 på ljusröd knapp |

Figmas grå (`#6B7280`, 4,4:1) och röd (`#C8413B`, 4,2:1) klarade inte WCAG AA och byttes vid granskningen av PR #14.

### 4.2 Typsnitt

- **Inter**, inbäddat i projektet (`assets/fonts/inter-latin.woff2`, SIL Open Font License). Reserv: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Storlekar: 12, 14, **16 (brödtext)**, 18, 22 och 28 px (`--text-xs` till `--text-2xl`).
- Pris och rubriker i fet (600–700).

### 4.3 Mått

- Avstånd i steg om 4: `4, 8, 12, 16, 24, 32` px.
- Hörn: **8** px (små), **12** px (kort, fält, knappar), **16** px (stora kort), **pill** för chips och badges.
- Fält och knappar är **48** px höga. Minsta klickyta **44** px.
- Innehåll max **960** px brett på dator.
- Ingen skugga. Kort skiljs från bakgrunden med vit yta och tunn ram.

### 4.4 Komponenter

| Komponent | Utseende |
| --- | --- |
| Primärknapp | Blå fylld, vit fet text, 48 px, full bredd i mobil |
| Sekundärknapp | Vit med blå ram och blå text |
| Farlig knapp | Ljusröd bakgrund och röd text (Neka), eller röd text (Ta bort) |
| Fält | Vit, ram `--color-border-strong`, 12 px hörn, blå ram vid fokus, etikett ovanför |
| Annonskort | Vit, rundat, kvadratisk bild, rubrik, fet pris, 📍 stad, Ledig |
| Kategorichip | Pill med grå ram. Vald: blå fylld med vit text |
| Flikar | Kontakter och Översikt, vald flik markerad i blått |
| Toppfält (`TopBar`) | Tillbaka eller ✕, rubrik |
| Åtgärdsrad (`ActionBar`) | Fast längst ned: sammanfattning till vänster, knapp till höger |
| Initialruta | Ljusblå med blå bokstäver, t.ex. "JE" |
| Ikoner (`Icon`) | Egna SVG:er, inga extra paket |

### 4.5 Statusbadges

| Status i databasen | Text i appen | Stil |
| --- | --- | --- |
| `REQUESTED` | Väntar | Ljusgul bakgrund, text `--color-warning` |
| `ACCEPTED` | Godkänd | Ljusblå bakgrund, text `--color-primary` |
| `DECLINED` | Nekad | Ljusröd bakgrund, text `--color-danger` |
| `BORROWED` | Utlånad | **Fylld** `--color-primary`, vit text |
| `RETURNED` | Återlämnad | Grå bakgrund, text `--color-text-muted` |
| `COMPLETED` | Avslutad | Ljusgrön bakgrund, text `--color-success` |
| (annonskort) | Ledig | Ljusblå bakgrund, text `--color-primary` |

---

## 5. Tillgänglighet

- All text klarar **WCAG AA** (4,5:1). Fältramar klarar **3:1** (WCAG 1.4.11). Kontrollerat vid granskningen av PR #14.
- Klickytor minst **44×44 px**, fält och knappar 48 px.
- Alla bilder har `alt`-text (annonsens rubrik). Saknad bild visas som en grå ruta med kameraikon.
- Status visas alltid med **text** i badgen, inte bara med färg.
- Formulärfält har synliga etiketter (`<label>`), och fel kopplas till fältet (`aria-describedby`).
- Synlig fokusram (`:focus-visible`) för tangentbord.
- `lang="sv"` på sidan.

---

## 6. Beslut

| Fråga | Beslut | Datum |
| --- | --- | --- |
| Menyvalets namn | **Lägg upp** (svenska i hela appen) | 2026-09-30 |
| Ikoner i bottenmenyn | Ja, enkla SVG-ikoner ovanför texten | 2026-10-13 |
| Får gäster se annonser? | Ja. Låneförfrågan, Lägg upp, Kontakter och Profil kräver inloggning | 2026-10-13 |
| Standardstad för gäster | Stockholm | 2026-10-13 |
| Handpenning och stadsdel | Ja, två **frivilliga** fält i `items`. Handpenningen betalas utanför appen, precis som hyran (godkänt av Ernest) | 2026-10-13 |
| Stadsknappen i sidhuvudet | Kartnål i stället för ▾. Pilen fick knappen att se ut som en rullista, men den leder till Profil (hittat vid test) | 2026-10-22 |
| Statusbadges | Ljus bakgrund + färgad text, Utlånad fylld (från mockupsen). Pillform från v2 | 2026-10-13 |
| Designkälla från v2 | Chipegos "Uthyrningsapp – startunderlag" i Figma. HK – Mockups var grunden. Gruppen godkände genom granskning och merge av PR #14 | 2026-10-26 |
| Kontrast i v2 | Figmas grå och röd byttes mot `#4B5563` och `#B91C1C`, fältramar `#868C97` (minst 3:1). Alex räknade fram ramfärgen, Andys förslag `#9CA3AF` gav bara 2,5:1 | 2026-10-26 |
| Bottenmeny på undersidor | Döljs på Annons, Ny annons, Redigera och Förfrågan. Där finns en fast åtgärdsrad eller ✕ i stället (från Figma) | 2026-10-26 |
| Antal dagar | Både första och sista dagen räknas (28 sep–2 okt = 5 dagar), som i designen | 2026-10-26 |
| Allt i designen måste finnas i databasen | AI-förslag som BankID, "svarar inom 1 timme" och favoriter togs bort ur mockupsen | 2026-09-30 |

## 7. Från brainstormen, men inte i v1

Idéer som finns med i brainstormen men som vi väntar med för att hålla projektet litet:

- Favoriter (hjärtat på annonskortet)
- Underkategorier (t.ex. Möbler → Stolar); v1 har bara huvudkategorier
- Pausa eller radera konto från profilen
- Byta lösenord från profilen

## 8. Chipego

Ansvarig: Chipego (UI/UX för Profil och Kontakter) Status: v1, 2026-10-13. Bygger på avsnitt 3, stilguiden i avsnitt 4 och skisserna i Figma. Alla färger, typsnitt, hörn och avstånd följer avsnitt 4.

## 8.0 Mitt bidrag
Knappar och menyval i Figma: jag skapade och designade knapparna som används i appen, bland annat bottenmenyns val Hem, Lägg upp, Kontakter och Profil med ikoner, samt primär, sekundär och farlig knapp. De finns som komponenter i Figma så att alla skärmar använder samma knappar.
Färger: jag justerade knapparna och komponenterna till gruppens färger (--color-primary med flera enligt avsnitt 4.1), så att de matchar mockupsen.
Profil och Kontakter: skisser och specifikation, se 8.1 och 8.2.
Prototyper: klickbara prototyper i Figma läggs till här i ett senare skede.
## 8.1 Profil /profile
+-----------------------------------+
| Profil                            |
+-----------------------------------+
| [ Mina annonser & förfrågningar 2 >]  <- blå knapp, röd siffra
|                                   |
| +-------------------------------+ |
| | Mina uppgifter                | |
| | [A] Andreas H.                | |
| |     Medlem sedan 2024         | |
| | E-post        andreas@mail.se | |
| | Telefon         070 111 22 33 | |
| +-------------------------------+ |
| +-------------------------------+ |
| | Stad                          | |
| | Visa annonser i               | |
| | [ Stockholm        v ] [Spara]| |
| +-------------------------------+ |
| +-------------------------------+ |
| | Omdömen                       | |
| | ★ 4,6 (5 omdömen)             | |
| | Sara L. ★★★★★ 3 okt           | |
| | Smidig och trevlig ...        | |
| | Visa alla omdömen             | |
| +-------------------------------+ |
|             Logga ut              |
+-----------------------------------+
|  Hem   Lägg upp  Kontakter Profil |
+-----------------------------------+

Ordning uppifrån och ned

Mina annonser & förfrågningar: primärknapp i full bredd som leder till /dashboard. Röd siffra (--color-danger, vit text) visar antal nya förfrågningar eller statusbyten. Ingen siffra när det är noll.
Mina uppgifter (kort): initial i en ljusblå ruta (--color-primary-light, blå bokstav), namn i fet text och "Medlem sedan ÅÅÅÅ" i grå text. Under det två rader med etikett till vänster (grå) och värde till höger: E-post och Telefon.
Stad (kort): rubrik, hjälptexten "Visa annonser i", rullista med städer och en sekundärknapp Spara bredvid. Efter sparning visas en kort grå text "Sparat" under raden och Hem visar annonser i den nya staden.
Omdömen (kort): stor stjärna, snittbetyg i fet text och antal i grå text. Därefter de två senaste omdömena, åtskilda med en tunn linje: namn (fet), stjärnor, datum (grå) och texten. Längst ned en blå textlänk "Visa alla omdömen".
Logga ut: grå textlänk centrerad längst ned.

Tillstånd

Inga omdömen: "Inga omdömen än. De dyker upp efter ditt första avslutade lån."
Laddar: grå platshållarrutor i korten i stället för text.
Fel vid sparning av stad: röd text under raden, till exempel "Kunde inte spara staden. Försök igen."

Data: GET /api/users/:id (namn, stad, omdömen, snittbetyg) och GET /api/reviews/user/:id. E-post och telefon kommer från den inloggade användaren, eftersom profiler i API:t aldrig innehåller kontaktuppgifter.

Inte i v1 (se avsnitt 7): byta lösenord, pausa och radera konto. Kortet Mina uppgifter är byggt så att en knapp "Ändra uppgifter" kan läggas till längst ned senare.

## 8.2 Kontakter /contacts
+-----------------------------------+
| Kontakter                         |
+-----------------------------------+
| Kontaktuppgifter visas när en     |
| förfrågan är godkänd. Betalning   |
| och upphämtning sköter ni själva. |
| +-------------------------------+ |
| | [S] Sara L.        (Godkänd)  | |
| | Du lånar: Borrmaskin Bosch    | |
| |           20–22 okt           | |
| | 070 123 45 67                 | |
| | sara.l@mail.se                | |
| | [  Ring  ]  [  Mejla  ]       | |
| +-------------------------------+ |
| +-------------------------------+ |
| | [J] Johan K.       (Utlånad)  | |
| | Lånar av dig: Tält 4 pers     | |
| | ...                           | |
| +-------------------------------+ |
+-----------------------------------+
|  Hem   Lägg upp  Kontakter Profil |
+-----------------------------------+

Kortets innehåll

Överst: initial i ljusblå ruta, motpartens namn i fet text och statusbadge till höger (Godkänd, Utlånad, Återlämnad eller Avslutad enligt 4.5).
Rad om saken, beroende på roll (my_role):
Jag lånar: "Du lånar: Borrmaskin Bosch"
Jag äger: "Lånar av dig: Tält 4 pers"
Därefter perioden i grå text, till exempel "20–22 okt".
Telefon och e-post med liten ikon framför, i blå text och klickbara (tel: och mailto:).
Två knappar i samma rad, lika breda: Ring (primär) och Mejla (sekundär). Om ett av fälten saknas döljs den knappen och den andra tar hela bredden.

Sortering: pågående först (Godkänd, Utlånad), sedan Återlämnad och Avslutad. Nyast först inom varje grupp.

Tillstånd

Inga kontakter: "Här hamnar kontaktuppgifter när en förfrågan blir godkänd." och en sekundärknapp "Hitta något att låna" som leder till Hem.
Laddar: två grå platshållarkort.
Fel: "Kunde inte hämta kontakter. Försök igen." med en textlänk för att ladda om.

Data: GET /api/contacts ger request_id, status, start_date, end_date, item_name, my_role, contact_name, contact_phone och contact_email. Bara förfrågningar med status ACCEPTED eller senare kommer med, så Väntar och Nekad visas aldrig här.

## 8.3 Gemensamt för mina sidor
Sidrubrik (20 px fet) i ett vitt fält överst med 1 px ram under. Ingen Tillbaka-länk, eftersom båda nås från bottenmenyn.
Kort: vit bakgrund, 1 px ram, 6 px hörn, 12 px innerluft och 8 px mellan korten.
Initialrutan: 40×40 px, ljusblå bakgrund och blå bokstav. Samma ruta används för ägaren i Annonsdetaljer.
Ring, Mejla och Spara är minst 44 px höga.
Status skrivs alltid ut i text i badgen, inte bara med färg.
## 8.4 Öppna frågor
Fråga	Förslag
Var visas mina egna uppgifter om GET /api/users/:id inte ger e-post och telefon?	Spara dem från inloggningen i AuthContext, eller lägg till GET /api/users/me i backend
Ska avslutade kontakter ligga kvar för alltid?	Visa dem i 30 dagar efter Avslutad, sedan döljs de
Ska stad kunna sparas utan inloggning?	Nej, gäster ser alltid Stockholm (beslut 2026-10-13)