# Agilt arbete – Hyra inte Köpa (HK)

**Ansvarig:** Andy (UX), granskas av hela teamet
**Status:** v1, 2026-10-26

> **Ärligt om när detta skrevs:** User stories och Definition of Done skrevs ner 2026-10-26. Under projektet styrde vi arbetet med [Projektplan.md](./Projektplan.md), veckosprintar i [FrontendTasks.md](./FrontendTasks.md) och [BackendTasks.md](./BackendTasks.md) samt granskning i pull requests. När vi stämde av mot kursen såg vi att user stories och en nedskriven DoD saknades. Därför formulerade vi det vi redan byggt och de regler vi faktiskt följt som user stories och DoD. Det är en lärdom vi tar med till nästa projekt (se avsnitt 5).

---

## 1. Team och roller

| Person | Roll i CC | Ansvar |
| --- | --- | --- |
| Ernest | Backend | Databas, API, drift på Render |
| Alex | Frontend | Sidor, layout, design enligt Figma |
| Andy | UX + frontend, repo-ägare | Brainstorm, UI/UX-dokument, mockups, granskning och merge av PR:er |
| Chipego (Chippe) | UX | Komponenter i Figma, Profil och Kontakter |

Ingen hade en formell Product Owner- eller Scrum Master-roll. I praktiken prioriterade projektplanen (scope i avsnitt 4) och Andy, som repo-ägare, såg till att PR:er granskades och mergades.

## 2. Hur vi jobbade

- **Sprintar:** en vecka per sprint. Vecka 1: grund, auth och annonser. Vecka 2: förfrågningar, kontakter och översikt. Vecka 3: hårdning, design och drift.
- **Backlog:** uppgifterna per vecka som checklistor i `FrontendTasks.md` och `BackendTasks.md`.
- **Avstämning:** Discord-kanalen `#avstämning` och [avstämning.md](./avstämning.md), där varje del beskriver vad som är klart, vad som testats och vad som är kvar.
- **Granskning:** all kod in i `main` via pull request (regeln "Skydda main" på GitHub). PR #1–#18.
- **Kommunikation:** Discord (`#general`, `#project-plan`) och kommentarer i PR:erna.

## 3. User stories

Format: *Som [roll] vill jag [göra något] så att [nytta].* Prioritering enligt **MoSCoW**, utifrån beslutet om vad som ingår i v1 (Projektplan avsnitt 4).

### Epic 1: Konto

**US1 – Skapa konto och logga in** · Must · ✅ Klar
Som ny användare vill jag skapa ett konto och logga in så att jag kan låna och låna ut saker.
- Registrering kräver namn, e-post, telefon, lösenord och stad.
- Lösenordet sparas som hash (bcrypt), aldrig i klartext.
- Fel e-post eller fel lösenord ger samma felmeddelande.
- Efter inloggning kommer jag tillbaka till sidan jag försökte öppna.

**US2 – Välja stad** · Must · ✅ Klar
Som användare vill jag välja min stad så att jag bara ser annonser nära mig.
- Gäster ser Stockholm som standard.
- Stad kan bytas på Profil och sparas.
- Vald stad syns överst på Hem med en kartnål.

### Epic 2: Annonser

**US3 – Lägga upp en annons** · Must · ✅ Klar
Som utlånare vill jag lägga upp en sak med bild och dygnspris så att andra kan hitta och låna den.
- Rubrik, bild, beskrivning, kategori, skick, stad och dygnspris är obligatoriska.
- Handpenning och stadsdel är frivilliga.
- Fält har synliga etiketter och felmeddelande under fältet.
- Annonsen syns på Hem efter publicering när den är markerad som ledig.

**US4 – Redigera och ta bort annons** · Must · ✅ Klar
Som utlånare vill jag ändra eller ta bort min annons så att den alltid stämmer.
- Bara ägaren ser "Redigera annons".
- Andra användare får 403 från backend om de försöker.
- "Ta bort annons" är en röd knapp och frågar om bekräftelse innan något raderas.

### Epic 3: Hitta saker

**US5 – Söka och filtrera** · Must · ✅ Klar
Som lånare vill jag söka och filtrera på kategori så att jag snabbt hittar det jag behöver.
- Fritextsök i rubrik och beskrivning.
- Kategorichips, vald kategori är markerad.
- Tom lista visar ett vänligt meddelande i stället för en tom sida.

**US6 – Se annonsdetaljer** · Must · ✅ Klar
Som lånare vill jag se dygnspris, skick och ägarens omdömen så att jag kan bedöma om jag vill låna.
- Dygnspriset är störst och blått.
- Ägarens snittbetyg eller "Inga omdömen än" syns.
- Beräknad hyra visas när jag väljer period (dygnspris × antal dagar).

### Epic 4: Låna

**US7 – Skicka låneförfrågan** · Must · ✅ Klar
Som lånare vill jag skicka en förfrågan för ett datumintervall så att ägaren kan svara.
- Slutdatum kan inte vara före startdatum.
- Man kan inte låna sin egen sak.
- Utloggad ser "Logga in för att låna" i stället för formuläret.

**US8 – Godkänna eller neka** · Must · ✅ Klar
Som utlånare vill jag godkänna eller neka en förfrågan, även efter att jag godkänt, så att jag bestämmer vem som lånar mina saker.
- Bara ägaren kan ändra status.
- Tillåtet: Väntar → Godkänd/Nekad, Godkänd → Nekad.
- Ogiltiga statusbyten nekas av backend (409).

**US9 – Följa lånet till avslut** · Must · ✅ Klar
Som utlånare vill jag markera Utlånad, Återlämnad och Avslutad så att båda vet var lånet står.
- Status visas alltid med text, inte bara färg.
- Bara de knappar som är tillåtna för min roll och status visas.

**US10 – Översikt** · Must · ✅ Klar
Som användare vill jag se mina annonser och mina skickade och mottagna förfrågningar på ett ställe.
- Tre flikar: Mottagna, Skickade, Mina annonser.
- Röd prick på klockan när förfrågningar väntar på svar.

### Epic 5: Kontakt och tillit

**US11 – Kontaktuppgifter efter godkännande** · Must · ✅ Klar
Som lånare vill jag se ägarens telefon och e-post när förfrågan är godkänd så att vi kan komma överens om upphämtning och betalning.
- Kontaktuppgifter visas bara från Godkänd och framåt, aldrig vid Väntar eller Nekad.
- Telefon och e-post är klickbara (Ring / Mejla).

**US12 – Omdömen** · Must · ✅ Klar
Som användare vill jag lämna och läsa omdömen så att vi kan lita på varandra.
- Omdöme bara efter Avslutad, bara av de två parterna.
- Betyg 1–5, ett omdöme per person och lån.
- Snittbetyg syns på profil och annons.

### Nästa steg (inte i v1)

**US13 – Notis till lånaren** · Should · ⏳ Ej påbörjad
Som lånare vill jag märka direkt när ägaren godkänt min förfrågan så att jag inte behöver leta.
- Röd prick på klockan även för lånaren när status ändras.
- Pricken försvinner när jag öppnat förfrågan.
- *Hittad vid live-test 2026-10-26. Projektplanen (8.8) kräver bara att det syns i Översikt och Kontakter, så minimikravet är uppfyllt.*

**Won't (v1):** chatt, betalning i appen, GPS-närhet, favoriter. Se Projektplan 4.2 och UI.UX.md avsnitt 7.

## 4. Definition of Done

Det här är reglerna vi följde i praktiken. En uppgift räknades som klar när:

1. Koden ligger i en egen gren och har kommit in i `main` via en **pull request**.
2. PR:en är **granskad** av någon annan i teamet, och konflikter är lösta.
3. `npm run lint` och `npm run build` går igenom i frontend utan fel.
4. Funktionen är **testad manuellt** i webbläsaren (frontend) eller i Postman (backend), även felfall.
5. Texter i appen är på **svenska**, och det följer stilguiden och kontrastkraven i [UI.UX.md](./UI.UX.md).
6. Inga hemligheter i koden: lösenord och nycklar ligger i `.env`.
7. Dokumentationen är uppdaterad om något ändrats (README, avstämning.md eller UI.UX.md).

## 5. Lärdomar till nästa projekt

- Skriv user stories och DoD **i sprint 1**, inte i efterhand.
- Bestäm **en** Figma-fil från början. Vi hade två ett tag.
- Kom överens om vem som bygger vad innan någon börjar, så att ingen bygger ovanpå någon annans pågående arbete.
- Testa på live-adressen varje sprint, inte bara lokalt. Vi upptäckte sent att Render byggde från en fork.
