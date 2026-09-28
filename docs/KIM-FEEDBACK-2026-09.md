# Korrekturen von Jongsuk Kim

Stand: 28. September 2026. Grundlage sind die kommentierte Korrekturfassung
und die von Frau Kim gelieferte Datei „Vita_Foto Jongsuk Kim .docx“.

## Umgesetzt

- Jazz aus Unterrichtstext und FAQ entfernt.
- Studienvorbereitung und Korrepetition auf beiden Sprachfassungen größer und
  mit eigenen fett gesetzten Bezeichnungen hervorgehoben. Preise unverändert.
- Die vorhandene Biografieseite mit der neuen Vita aktualisiert, sprachlich
  geglättet und die datierten Stationen von 2026 bis 2014 absteigend sortiert.
- Alte Biografie-PDF-Verweise von Startseiten und Biografieseite entfernt.
  Die alte PDF-Datei bleibt unter ihrer bisherigen URL erreichbar.
- In der bestehenden Preislisten-PDF ausschließlich die beiden Fristen
  „spätestens einen Tag vorher“ und „innerhalb von 12 Wochen“ stärker gesetzt.
  Text, Zeichenpositionen, Preise und Bedingungen wurden unverändert geprüft.
- Hero, Salon-Stil, Künstlerfoto, Vorstellung, drei Hörproben und Seitenadressen
  beibehalten. Keine neue Musik-Unterseite.
- Kompakten „Lost Beauty“-Bereich in der bestehenden Künstlersektion auf Deutsch
  und Koreanisch ergänzt: Originalcover, Albumhinweis und Link zum Anhören auf
  der offiziellen Bandcamp-Seite. Das Cover wird lokal geladen; kein externer
  Player und keine zusätzlichen Drittanbieteranfragen beim Seitenaufruf.

## Redaktionelle Hinweise

Die neue Vita ist die Grundlage für biografische Angaben. Ältere abweichende
Angaben zu Wettbewerben wurden nicht mit ihr vermischt. Namen und Titel wie
„Ewoncc“, „Russisches Kiew Radio Symphony Orchester“ und „Vocalize“ sind aus
der gelieferten Vita übernommen, nicht unabhängig verifiziert. Die Schreibweise
„Friedlich-Wilhelm Schnurr“ wurde anhand des bereits vorhandenen Namens auf
der Biografieseite zu „Friedrich-Wilhelm Schnurr“ berichtigt.

## CD-Quellen

Das Cover wurde auf ausdrücklichen Wunsch online recherchiert und am
28. September 2026 direkt auf der Albumseite des Labels gefunden:

- Album: https://solairerecords.com/product/szymon-marciniak-jongsuk-kim-lost-beauty/
- Cover: https://solairerecords.com/wp-content/uploads/2024/10/4251336910181_Lost-Beauty_COVER-scaled.jpg
- Offizielle Hörmöglichkeit: https://szymonmarciniak.bandcamp.com/album/lost-beauty-audiophile-edition

Verwendet wird die 768 × 768 Pixel große Coverdatei des Labels, unverändert
unter `public/images/lost-beauty-cover.jpg` gespeichert. Die Rechte verbleiben
bei den jeweiligen Rechteinhabern; daraus folgt keine allgemeine Nutzungslizenz.
Der Nutzer hat den vorgeschlagenen CD-Bereich mit Bandcamp-Link und die
Veröffentlichung der aktualisierten GitHub-Pages-Vorschau freigegeben.
Es wird keine Aufnahme aus Streamingdiensten kopiert.

## Noch offen

Frau Kim sollte die koreanischen Texte, Namen und Werktitel sowie die endgültige
Materialverwendung gegenlesen bzw. freigeben. Ein eigener CD-Audioplayer ist
optional und würde eine von ihr ausgewählte, freigegebene Audiodatei benötigen;
für den aktuellen CD-Bereich genügt der Bandcamp-Link.
Die koreanische Startseite ist unter `/ko/home/?stil=salon` zur Prüfung verfügbar;
ihre bestehende Biografie-Verlinkung ist weiterhin ausdrücklich als deutsch
gekennzeichnet.
Vor einem späteren Domainwechsel muss Salon als endgültige Gestaltung von der
Vorschau-Auswahl entkoppelt werden. Die Suchmaschinenfreigabe erfolgt erst im
Rahmen der SEO-Migration, nicht für diese GitHub-Pages-Vorschau.

## Prüfung

`npm run check` ohne Fehler, Warnungen oder Hinweise; GitHub-Pages-Build mit
`BASE_PATH=/suk-astro-2026` erfolgreich. Bestehende Prüfungen bestätigen
27 HTML-Seiten, 26 ursprüngliche Routen und 44 Originaldateien sowie interne
Links, Canonicals, Sprachverweise und Sitemaps. Die neue Inhaltsprüfung läuft
bei jedem Build mit. Die deutsche Startseite und Biografie wurden bei 1280 px
und 390 px geprüft, die koreanische Startseite zusätzlich bei 390 px. Kein
horizontaler Überlauf. Preislisten-PDF vollständig gerendert und geprüft.

Veröffentlichungsziel dieser Korrekturen ist ausschließlich die GitHub-Pages-
Vorschau unter `https://janolefabian.github.io/suk-astro-2026/`. Die bestehende
Live-Domain, der Vorschau-Schutz `noindex, follow` und die Stil-Auswahl bleiben
unverändert.
