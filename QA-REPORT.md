# Südpfote QA Report
*Datum: 09.02.2026*
*Tester: Nyx (Sub-Agent)*
*URL: https://suedpfote-frontend.vercel.app*

---

## 📊 Zusammenfassung

| Kategorie | Anzahl |
|-----------|--------|
| Produkte auf Startseite | 150 (von 155 erwartet — 5 fehlen) |
| Produktseiten erreichbar (Browser) | ✅ Alle 150 (client-side rendered) |
| Produkte mit kaputten Bildern | 🔴 **35 Produkte** (Amazon-URLs 404) |
| Duplikate | 🟡 **3 Duplikate** |
| Preis-Fehler | 🔴 **2 Produkte** (1x €0.00, 1x €1.99 für Schere) |
| /warenkorb URL | 🔴 **404** |
| Impressum Platzhalter | 🔴 **Rechtlich problematisch** |
| manifest.json | 🟡 404 |

---

## 🔴 Kritische Fehler (Seite crasht / nicht erreichbar)

### 1. /warenkorb Route = 404
- **URL:** https://suedpfote-frontend.vercel.app/warenkorb
- **Problem:** Die Route `/warenkorb` existiert nicht. Der Warenkorb ist nur als Sidebar verfügbar.
- **Impact:** Wenn jemand direkt `/warenkorb` aufruft → 404-Seite
- **Fix:** Route erstellen oder Redirect auf `/kasse`

### 2. Backend API komplett DOWN
- **URL:** https://suedpfote-backend-production.up.railway.app
- **Problem:** Railway App gibt 404 "Application not found" zurück
- **Impact:** Falls das Frontend den Backend-API nutzt → Bestellungen unmöglich
- **Hinweis:** Frontend scheint aktuell mit Supabase/statischen Daten zu arbeiten, daher kein sofortiger Ausfall sichtbar

### 3. Preis €0.00 — Stanley PowerLock Maßband
- **Produkt:** Linkshänder Maßband - Stanley PowerLock 5m
- **Handle:** `/produkt/stanley-powerlock-linkshaender-massband-5m`
- **Problem:** Preis wird als €0.00 angezeigt — Kunden könnten gratis bestellen!
- **Fix:** Preis korrigieren

### 4. Verdächtig niedriger Preis — Westcott Schere €1.99
- **Produkt:** Westcott Easy Grip Linkshänder-Schere 21cm (BESTSELLER)
- **Handle:** `/produkt/westcott-linkshaender-schere`
- **Problem:** €1.99 ist unrealistisch niedrig für diese Schere (Marktpreis ~€8-12)
- **Fix:** Preis prüfen und korrigieren

### 5. Impressum hat nur Platzhalter — RECHTLICH KRITISCH!
- **URL:** /impressum
- **Problem:** Enthält `[Firmenname]`, `[Straße und Hausnummer]`, `[PLZ] [Stadt]`, `[Telefonnummer]`, `[USt-IdNr.]`, `[Name des Verantwortlichen]`
- **Impact:** Verstoß gegen §5 TMG — abmahnfähig!
- **Fix:** SOFORT echte Daten eintragen

---

## 🟡 Mittlere Fehler (falsche Daten, fehlende Bilder)

### 35 Produkte mit kaputten Bildern (Amazon-URLs 404)
Alle diese Produkte verwenden Amazon `m.media-amazon.com` URLs die 404 zurückgeben. Die Bilder werden NICHT angezeigt (broken image icon).

| # | Produkt | Kaputte Bild-URL |
|---|---------|-----------------|
| 1 | Linkshänder Kalligraphie-Set Premium 12-teilig | 71KqGXpPURL |
| 2 | Linkshänder Zeichenbrett A3 mit Neigungsverstellung | 71QMx8ORHWL |
| 3 | Ergonomischer Linkshänder Kugelschreiber-Set 5er | 61vR5L0LUXL |
| 4 | Linkshänder Planer 2026 Wochenübersicht A5 | 71pN0kCIURL |
| 5 | Linkshänder Notizbuch Spiralbindung rechts A5 3er-Set | 71BjKf5ZsQL |
| 6 | Linkshänder Textmarker-Set 6 Farben Keilspitze | 71x0QVPz9nL |
| 7 | Linkshänder Dokumentenmappe A4 Leder | 81pDXHrFR5L |
| 8 | Linkshänder Schreibtisch-Organizer Bambus | 71-mFZ3eURL |
| 9 | Linkshänder Kombizange 200mm Profi | 61ZR3LjKURL |
| 10 | Linkshänder Schraubendreher-Set 12-teilig | 71bVKMsHURL |
| 11 | Linkshänder Teppichmesser Profi mit Klingenmagazin | 61BqGZHJURL |
| 12 | Linkshänder Gartenschere Bypass Premium | 71jz5WPMTUL |
| 13 | Linkshänder Heckenschere manuell 60cm | 71qKk-vhiYL |
| 14 | Linkshänder Nähschere Gold 20cm | 61-Xa8CaURL |
| 15 | Linkshänder Stoff-Rollschneider 45mm mit Schneidematte | 71F-v87XCLL |
| 16 | Linkshänder Armbanduhr Krone links Classic | 71Q-Y9RUZFL |
| 17 | Linkshänder Geldbörse Leder RFID-Schutz | 81KqrQNnRYL |
| 18 | Linkshänder Spitzer elektrisch USB-C | 61kFmzRZURL |
| 19 | Linkshänder Schnellhefter und Ordner Set 10-teilig | 61w4PjYLd0L |
| 20 | Linkshänder Fineliner-Set 24 Farben | 81YmRnx-6WL |
| 21 | Linkshänder Wachsmalstifte dreieckig 24er | 81h5w5KNTCL |
| 22 | Linkshänder Zirkel Präzision mit Schnellverstellung | 51mYKhC7KaL |
| 23 | Linkshänder Bügelsäge 300mm Profi | 71K-tFueLjL |
| 24 | Linkshänder Maßband 8m mit Linksbremse | 71h5c26AySL |
| 25 | Linkshänder Füller-Patronen Universal 50er-Pack | 61xYfXVHReL |
| 26 | Linkshänder Schreiblerntablett für Kinder | 71s-4u+UDHL |
| 27 | Linkshänder Wasserfarbkasten 24 Farben | 81p5QJmEFPL |
| 28 | Linkshänder Spachtel-Set Maler 5-teilig | 71RqzZWGjQL |
| 29 | Linkshänder Handgelenkauflage Tastatur ergonomisch | 71rFqP6X7zL |
| 30 | Linkshänder Nagelschere gebogen Edelstahl | 51G3-CNQIYL |
| 31 | Linkshänder Pizzarad mit Fingerschutz | 61FGDQSh-EL |
| 32 | Linkshänder Brotmesser Wellenschliff 30cm | 51tGMuhZ02L |
| 33 | Linkshänder Wanduhr spiegelverkehrt 30cm | 71EeODNp-dL |
| 34 | Linkshänder Gemüseschäler Set 3-teilig | 71I4aS2BXAL |
| 35 | Linkshänder Mehrzweck-Schere Titan 21cm | 61uPRdQ4URL |

**Ursache:** Diese 35 Produkte nutzen Amazon-Bild-URLs statt Supabase. Amazon blockiert Hotlinking.
**Fix:** Alle 35 Bilder auf Supabase Storage hochladen und URLs aktualisieren.

### 3 Duplikat-Produkte
| Produktname | Anzahl | Bemerkung |
|-------------|--------|-----------|
| STABILO EASYoriginal Tintenroller für Linkshänder | 2x | `/produkt/stabilo-linkshaender-tintenroller` + `/produkt/stabilo-easyoriginal-tintenroller-linkshaender` |
| KUM Linkshänder-Anspitzer mit Auffangbehälter | 2x | `/produkt/kum-linkshaender-anspitzer` + `/produkt/kum-linkshaender-anspitzer-dosenspitzer` |
| Linkshänder-Lineal 30cm mit umgekehrter Skala | 2x | `/produkt/wedo-linkshaender-lineal-30cm` + `/produkt/lineal-30cm-linkshaender` (+ evtl. `/produkt/linkshaender-lineal-30cm-umgekehrte-skala`) |

### Typo in URL
- **URL:** `/produkt/westcott-kindercshere-linkshaender-13cm`
- **Problem:** "kindercshere" statt "kinderschere" (fehlendes 's' an falscher Stelle)
- **Impact:** SEO-nachteilig, aber Seite funktioniert

---

## 🟢 Kleinere Fehler (Kosmetik, Typos)

1. **manifest.json fehlt** — `/manifest.json` gibt 404 zurück → PWA-Installation nicht möglich
2. **Beschreibungen haben Formatierungs-Artefakte** — Viele Produktbeschreibungen zeigen rohe Markdown-Marker wie `— WARUM LINKSHÄNDER-SCHEREN? —`, `— PREMIUM QUALITÄT —`, `— FÜR WEN? —` als Plaintext statt als formatierte Überschriften (im Listentext auf der Startseite)
3. **Ticker/Marquee dreifach dupliziert** — Die animierte Kategorie-Leiste (Scheren, Füller, Lineale etc.) wird 3x identisch wiederholt
4. **Alle Produkte haben 5 Sterne** — Kein einziges Produkt hat weniger als 5/5 Sterne → wirkt unglaubwürdig
5. **Express Checkout iframe** — Auf Produktseiten gibt es ein Express Checkout iframe (vermutlich Stripe) das leer/unsichtbar erscheint
6. **Razer DeathAdder v3 doppelt** — Sowohl als `razer-deathadder-v3-linkshaender` und `razer-deathadder-v3-gaming-maus-linkshaender` (zusätzliches Duplikat)

---

## ✅ Funktionierende Features

- **Startseite** — Lädt korrekt, Hero-Section sieht gut aus ✅
- **Navigation** — Produkte, Story, FAQ Links funktionieren ✅
- **Produktseiten** — Alle 150 Produkte laden im Browser (client-side rendering) ✅
- **In den Warenkorb** — Button funktioniert, Sidebar öffnet sich mit Produkt ✅
- **Kasse/Checkout** — `/kasse` Route funktioniert, 3-Schritt-Prozess (Warenkorb → Versand → Bezahlung) ✅
- **Warenkorb-Sidebar** — Mengenänderung (+/−), Löschen, "Zur Kasse" Link funktionieren ✅
- **Story-Seite** — /story lädt und zeigt emotionalen Brand-Text ✅
- **FAQ-Seite** — /faq lädt mit Accordion-Fragen ✅
- **Impressum** — /impressum lädt (aber Platzhalter!) ✅
- **Datenschutz** — /datenschutz lädt mit Text ✅
- **AGB** — /agb lädt ✅
- **Widerruf** — /widerruf lädt ✅
- **Login-Seite** — /login lädt ✅
- **Footer** — Alle Links funktionieren ✅
- **Breadcrumbs** — Auf Produktseiten korrekt angezeigt ✅
- **"Das könnte dir auch gefallen"** — Auf Produktseiten mit funktionierenden Bildern ✅
- **Versandhinweis** — "Ab 39€ versandkostenfrei" wird korrekt angezeigt ✅
- **Responsive Warenkorb-Icon** — Zeigt Anzahl der Produkte ✅

---

## Produkte die ENTFERNT werden sollten

### Duplikate (eines der beiden entfernen)
- **STABILO EASYoriginal Tintenroller** — Duplikat: `stabilo-linkshaender-tintenroller` vs `stabilo-easyoriginal-tintenroller-linkshaender`
- **KUM Anspitzer** — Duplikat: `kum-linkshaender-anspitzer` vs `kum-linkshaender-anspitzer-dosenspitzer`
- **Linkshänder Lineal 30cm** — Duplikat: Bis zu 3 ähnliche Produkte
- **Razer DeathAdder v3** — Duplikat: `razer-deathadder-v3-linkshaender` vs `razer-deathadder-v3-gaming-maus-linkshaender`

### Fragwürdige "Linkshänder"-Produkte (PRÜFEN)
- **Linkshänder Wanduhr spiegelverkehrt** — Kreativ, aber kein echtes LH-Problem. Eher Gadget/Spaßartikel.
- **Linkshänder Nudelholz Edelstahl** — Ein Nudelholz ist symmetrisch, wo ist der LH-Vorteil?
- **Linkshänder Salatschleuder** — Symmetrisches Produkt, fragwürdiger LH-Nutzen
- **Linkshänder Kartoffelstampfer** — Symmetrisches Produkt
- **Linkshänder Schneebesen** — Ein Schneebesen ist rotationssymmetrisch
- **Linkshänder Grillzange** — Zangen sind symmetrisch
- **Linkshänder Servierzange** — Symmetrisch
- **Linkshänder Kuechenwaage digital** — Eine Waage hat keine Händigkeit
- **Linkshänder Handgelenkauflage Tastatur** — Nicht händigkeitsspezifisch
- **Linkshänder Dokumentenmappe A4 Leder** — Keine echte LH-Anpassung erkennbar
- **Linkshänder Schreibtisch-Organizer Bambus** — Nicht händigkeitsspezifisch

---

## 🎯 Prioritäten-Liste

### SOFORT (vor Launch)
1. 🔴 Impressum ausfüllen (Abmahngefahr!)
2. 🔴 Preis Stanley Maßband korrigieren (€0.00)
3. 🔴 Preis Westcott Schere prüfen (€1.99 zu niedrig?)
4. 🔴 35 kaputte Amazon-Bilder durch Supabase-Bilder ersetzen

### BALD (erste Woche)
5. 🟡 Duplikate entfernen (4 Produkte)
6. 🟡 URL-Typo fixen (`kindercshere` → `kinderschere`)
7. 🟡 /warenkorb Route erstellen oder Redirect
8. 🟡 Fragwürdige "Linkshänder"-Produkte prüfen und ggf. entfernen

### NICE TO HAVE
9. 🟢 manifest.json erstellen (PWA)
10. 🟢 Bewertungen realistischer machen (nicht alle 5 Sterne)
11. 🟢 Beschreibungs-Formatierung auf Produktkarten verbessern
12. 🟢 5 fehlende Produkte finden (150 statt 155)

---

*Report generiert: 09.02.2026 ~16:40 Uhr*
*Getestet: 150 Produkte, 6 statische Seiten, Navigation, Suche, Warenkorb, Kasse*
