# UI / UX – Hyra inte Köpa (HK)

Ansvarig: Andy (UI/UX)
Status: v1.1, uppdaterad 2026-10-13 efter mockups och beslut i gruppen. Kommentera i Discord eller i en issue om något ska ändras.

**Mockups i Figma:** [HK – Mockups](https://www.figma.com/design/7Ks6k91BOnLcywdfrUiZPU/HK--Mockups) (Hem, Annonsdetaljer, Lägg upp, Kontakter, Profil)

Bygger på Andys brainstorm "Hyr istället för köp" (se [Brainstorm.pdf](./Brainstorm.pdf)).

Kort guide för hur appen ska se ut och hur man tar sig runt i den. Frontend bygger funktion och markup, och stylar enligt detta dokument. Innehåll och krav per sida finns i [Projektplan.md](./Projektplan.md).

---

## 1. Designprinciper

1. **Tryggt och tydligt.** Blå grundfärg som signalerar tillit. Man lånar ut saker till främlingar, så appen ska kännas seriös.
2. **Rakt och kompakt.** Mer Blocket än Instagram: mycket information per skärm, lite luft och inga effekter.
3. **Dygnspriset syns alltid.** Priset är det viktigaste på varje annons, både i lista och i detaljvy.
4. **Mobil först.** Vi designar för en mobilskärm (375 px bred) och låter samma layout växa på dator.
5. **Svenska överallt** i knappar, rubriker och felmeddelanden.

---

## 2. Navigation

### 2.1 Bottenmeny (huvudnavigation)

Fast längst ned på skärmen i mobil. Alltid 4 val, alltid i samma ordning:

| Ordning | Text | Rutt | Kräver inloggning |
| --- | --- | --- | --- |
| 1 | **Hem** | `/` | Nej |
| 2 | **Lägg upp** | `/add-item` | Ja |
| 3 | **Kontakter** | `/contacts` | Ja |
| 4 | **Profil** | `/profile` | Ja |

- Varje val har en enkel ikon ovanför texten (beslut 2026-10-13, ikonerna är inbyggda SVG:er utan extra paket).
- **Aktivt val:** blå text och ikon (`--color-primary`) med fet text. Övriga är gråa (`--color-text-muted`).
- **Badge:** en liten röd siffra på **Profil** när det finns nya förfrågningar eller statusbyten.
- **Utloggad användare** som trycker på Lägg upp, Kontakter eller Profil skickas till `/login`. Efter inloggning kommer man tillbaka dit man ville.
- **Dator (bredare än 768 px):** samma 4 länkar flyttar upp till sidhuvudet till höger. Bottenmenyn döljs.

### 2.2 Sidhuvud

```
+-----------------------------------+
| HK                    Stockholm v |
+-----------------------------------+
```

- Vänster: logotyp/text **HK**, som länkar till Hem.
- Höger: vald stad. Klick leder till Profil, där man byter stad.
- På undersidor (annons, förfrågan, redigera) finns en **← Tillbaka**-länk till vänster i stället för logotypen.

### 2.3 Hur man når sidor utanför bottenmenyn

| Sida | Hur man kommer dit |
| --- | --- |
| Annonsdetaljer `/items/:id` | Klicka på ett annonskort |
| Redigera annons `/items/:id/edit` | Knappen "Redigera" på egen annons |
| Översikt `/dashboard` | Stor knapp **"Mina annonser & förfrågningar"** överst på Profil |
| Förfrågan `/borrow-requests/:id` | Klicka på en förfrågan i Översikt |
| Logga in / Registrera | Automatiskt vid skyddad sida, eller länk på Profil |

`/items` visar samma lista som Hem och behöver ingen egen plats i menyn.

### 2.4 Flöde

```
Lånare: Hem -> Annons -> [Skicka förfrågan] -> Översikt (status: Väntar)
Ägare:  Profil -> Översikt -> Förfrågan -> [Godkänn] / [Neka]
Båda:   Kontakter (telefon + e-post syns efter Godkänd)
```

---

## 3. Skärmar (kort)

### Hem `/`
```
+-----------------------------------+
| HK                    Stockholm v |
+-----------------------------------+
| [ Sök t.ex. borrmaskin         ]  |
| (Alla) (Verktyg) (Elektronik) ->  |  <- kategorier, scrollar i sidled
+-----------------------------------+
| +--------------+ +--------------+ |
| |              | |              | |
| |     bild     | |     bild     | |  <- annonskort, 2 per rad
| |              | |              | |
| +--------------+ +--------------+ |
| Borrmaskin Bosch Tält 4 pers      |
| 50 kr/dag        80 kr/dag        |
| Stockholm        Stockholm        |
+-----------------------------------+
|  Hem   Lägg upp  Kontakter Profil |  <- bottenmeny
+-----------------------------------+
```
- Annonser visas som **kort i ett rutnät**: 2 per rad i mobil, 3 per rad på surfplatta och 4 per rad på dator. Samma upplägg som Blockets annonskort (se referensbild i brainstormen).
- Kortet: bild överst (kvadratisk), under den rubrik, **dygnspris i fet stil**, stad i grå text och etiketten **"Ledig"** (fältet `available`).
- Ovanför korten: "Visar 7 annonser" till vänster och "Senaste" till höger (nyaste först).
- Tom lista: "Inga annonser i Stockholm än. Bli först med att lägga upp något!"

### Annonsdetaljer `/items/:id`
- Överst: **← Tillbaka** till vänster och en **Dela**-knapp till höger (kopierar länken, eller öppnar telefonens dela-meny).
- Stor bild. Flera bilder visas som "1/4 bilder" om vi hinner, annars en bild i v1.
- Rubrik, "Ledig" och **dygnspris stort och blått**. Till höger om priset: **Handpenning** i grå text, bara om ägaren har fyllt i den.
- Info-rader: Kategori, Skick, Stad. Om stadsdel finns visas den i parentes, t.ex. "Stockholm (Södermalm)".
- Beskrivning.
- Ägarruta: initial, namn, snittbetyg (★ 4,8 (12 omdömen)) eller "Inga omdömen än", och "Medlem sedan 2021".
- **Välj period:** Från och Till (svenskt datumformat), och under dem **"Beräknad hyra (2 dagar) 100 kr"** (dygnspris × antal dagar, räknas i frontend).
- Primärknapp: "Skicka låneförfrågan". Utloggad ser "Logga in för att skicka förfrågan". Ägaren ser "Redigera annons" i stället.
- Liten grå text under knappen: "Betalning och upphämtning sköter ni själva efter godkännande."

### Lägg upp / Redigera `/add-item`, `/items/:id/edit`
- Ett formulär i en kolumn. Etikett ovanför varje fält.
- Överst: **Foton**, upp till 4 rutor där första bilden är "Huvudbild" och visas i listan. I v1 räcker en bild-URL om uppladdning inte hinns med.
- Ordning: Rubrik → Kategori → Skick → Pris per dag (kr) och **Handpenning (frivilligt)** bredvid varandra → Stad (förifylld) och **Stadsdel (frivilligt)** bredvid varandra → Beskrivning → Tillgänglig för utlåning (reglage).
- Knapp längst ned: **"Publicera"** (eller "Spara ändringar"). Vid redigering finns "Ta bort annons" som röd textlänk under knappen.

### Kontakter `/contacts`
- Lista med kort: namn, vilken sak det gäller, telefon och e-post.
- Telefon och e-post är klickbara (`tel:` / `mailto:`).
- Två knappar längst ned i kortet: **Ring** (blå) och **Mejla** (vit med blå ram).
- Statusbadge uppe till höger i kortet (Godkänd, Utlånad, Avslutad).
- Liten grå text överst: "Kontaktuppgifter visas när en förfrågan är godkänd. Betalning och upphämtning sköter ni själva."

### Profil `/profile`
- Knapp överst: **"Mina annonser & förfrågningar"** (till Översikt) med röd siffra när något nytt har hänt.
- Namn, e-post, telefon och "Medlem sedan" (när kontot skapades).
- Stad: rullista + "Spara".
- Omdömen: snittbetyg och lista med omdömen.
- "Logga ut" längst ned som grå textlänk.

### Översikt `/dashboard`
- Tre flikar överst: **Mottagna** | **Skickade** | **Mina annonser**.
- Varje förfrågan är en rad: sak, datum, motpart och **statusbadge**.

### Förfrågan `/borrow-requests/:id`
- Sak, period, lånare/ägare och statusbadge.
- Endast de knappar som är tillåtna för min roll och nuvarande status (se Projektplan 8.5–8.6).
- Ägaren ser lånarens omdömen innan hen godkänner.

### Logga in / Registrera
- Centrerat formulär, max 400 px brett, med logotyp ovanför.
- Felmeddelande i röd text direkt under fältet, till exempel "Fel e-post eller lösenord".

---

## 4. Stilguide

Alla värden läggs som CSS-variabler i `frontend/assets/styles/index.css`, så att alla använder samma färger. **Skriv aldrig hårdkodade färger i andra CSS-filer.** Använd `var(--...)`.

### 4.1 Färger

| Variabel | Värde | Används till |
| --- | --- | --- |
| `--color-primary` | `#1D4ED8` | Knappar, länkar, aktivt menyval, dygnspris |
| `--color-primary-dark` | `#1E3A8A` | Hover/tryck på knappar |
| `--color-primary-light` | `#DBEAFE` | Vald kategori, markerad bakgrund |
| `--color-bg` | `#F3F4F6` | Sidans bakgrund |
| `--color-surface` | `#FFFFFF` | Kort, formulär, menyer |
| `--color-text` | `#111827` | Brödtext och rubriker |
| `--color-text-muted` | `#4B5563` | Hjälptext, oaktiva menyval |
| `--color-border` | `#D1D5DB` | Ramar på kort och fält |
| `--color-success` | `#15803D` | Godkänd/Avslutad |
| `--color-warning` | `#B45309` | Väntar |
| `--color-danger` | `#B91C1C` | Nekad, fel, ta bort, badge |

Alla textfärger klarar WCAG AA-kontrast (minst 4,5:1) mot vit bakgrund.

### 4.2 Typsnitt

- **Systemtypsnitt**, alltså inget att ladda ner: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
- Storlekar: brödtext **16 px**, hjälptext **14 px**, kortrubrik **16 px fet**, sidrubrik **20 px fet**, dygnspris i detaljvy **24 px fet**.

### 4.3 Avstånd, hörn och skugga

- Avstånd i steg om 4: `4, 8, 12, 16, 24` px. Standard inne i kort: **12 px**. Mellan kort: **8 px**.
- Hörnradie: **6 px** på kort, knappar och fält. Raka, inte bubbliga.
- Skugga: ingen. Kort har 1 px ram (`--color-border`).
- Innehåll max **960 px** brett och centrerat på dator.

### 4.4 Komponenter

| Komponent | Utseende |
| --- | --- |
| **Primärknapp** | Blå bakgrund, vit fet text, full bredd i mobil, höjd 44 px |
| **Sekundärknapp** | Vit bakgrund, blå ram och blå text |
| **Farlig knapp/länk** | Röd text, ingen bakgrund |
| **Fält** | Vit bakgrund, grå ram, 44 px höjd, blå ram vid fokus |
| **Annonskort** | Vit, 1 px ram, kvadratisk bild överst, sedan rubrik (1 rad, klipps med …), dygnspris fet, stad i grå text och "Ledig". Hover/fokus: blå ram |
| **Kategorichip** | Grå ram. Vald: ljusblå bakgrund och blå text |
| **Statusbadge** | Liten rundad etikett med ljus bakgrund och färgad text. Undantag: Utlånad är fylld blå med vit text, eftersom det är lånet som pågår |

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

Klasserna finns färdiga i `frontend/assets/styles/index.css` (`.badge .badge-requested` osv.).

---

## 5. Tillgänglighet (minimum)

- Klickytor minst **44×44 px**.
- Alla bilder har `alt`-text (annonsens rubrik).
- Status visas alltid med **text**, inte bara med färg.
- Formulärfält har synliga etiketter (`<label>`), inte bara placeholder.

---

## 6. Beslut

| Fråga | Beslut | Datum |
| --- | --- | --- |
| Menyvalets namn | **Lägg upp** (svenska i hela appen) | 2026-09-30 |
| Ikoner i bottenmenyn | Ja, enkla SVG-ikoner ovanför texten | 2026-10-13 |
| Får gäster se annonser? | Ja. Låneförfrågan, Lägg upp, Kontakter och Profil kräver inloggning | 2026-10-13 |
| Standardstad för gäster | Stockholm | 2026-10-13 |
| Handpenning och stadsdel | Ja, två **frivilliga** fält i `items`. Handpenningen betalas utanför appen, precis som hyran (godkänt av Ernest) | 2026-10-13 |
| Statusbadges | Ljus bakgrund + färgad text, Utlånad fylld (från mockupsen) | 2026-10-13 |
| Allt i designen måste finnas i databasen | AI-förslag som BankID, "svarar inom 1 timme" och favoriter togs bort ur mockupsen | 2026-09-30 |

## 7. Från brainstormen, men inte i v1

Idéer som finns med i brainstormen men som vi väntar med för att hålla projektet litet:

- Favoriter (hjärtat på annonskortet)
- Underkategorier (t.ex. Möbler → Stolar); v1 har bara huvudkategorier
- Pausa eller radera konto från profilen
- Byta lösenord från profilen
