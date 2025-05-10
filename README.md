# AutoTeach

AutoTeach on veebipõhine rakendus haridusasutustele, mille eesmärk on lihtsustada õppetundide haldust, kohaloleku registreerimist ning pakkuda kasutajasõbralikku statistikat. Süsteem järgib rahvusvahelisi standardeid ISO 21001, ISO/IEC 27001 ja ISO 30401.

## Põhifunktsioonid
- Лursusi haldus: õpetaja saab hallata oma kursusi.
- Kohaloleku registreerimine: süsteem genereerib unikaalse QR-koodi iga tunni jaoks, mille abil saavad õpilased end registreerida.
- Statistika: õpetaja saab vaadata iga õpilase kohaloleku ajalugu ja hinnete dünaamikat.
- Õpilase vaade: õpilane näeb oma hindeid, puudumisi ja võib end QR-koodi kaudu registreerida.

## Rollid
- Õpetaja: saab hallata kursusi, sisestada hindeid ja registreerida kohalolekut.
- Õpilane: saab vaadata statistikat ja registreeruda QR-koodiga.

## Tehniline ülesehitus
- Frontend: React.js
- Backend: Node.js ja Express
- Andmebaas: MySQL
- API: REST
- Autentimine: bcrypt ja sessioonihaldus

## Arhitektuurilised põhimõtted
- Single Page Application (SPA)
- AJAX-päringud dünaamiliseks andmevahetuseks
- JSON-andmestruktuurid frontendi ja backendi vahel

## Vastavus standarditele
- ISO 21001: õppeasutuste juhtimissüsteem
- ISO/IEC 27001: infoturbe juhtimissüsteem
- ISO 30401: teadmushalduse süsteem

## Arendusmeetod
Rakenduse arendus põhineb PDCA (Plan-Do-Check-Act) mudelil ning järgib iteratiivset täiustamistsüklit.

## Käivitamine

### Eeldused

- Node.js (v18+)
- MySQL server
- Git
- .env fail backendis

### Reposi kloonimine ja installeerimine

```bash
git clone https://github.com/KotBegemotEST/AutoTeach.git
cd AutoTeach

cd backend
npm install
# Loo .env fail järgmise sisuga:
# DB_HOST=localhost
# DB_USER=kasutaja
# DB_PASSWORD=parool
# DB_NAME=autoteach
# SESSION_SECRET=midagisalajast
npm start

