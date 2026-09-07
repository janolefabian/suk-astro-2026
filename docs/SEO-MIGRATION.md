# SEO-erhaltender Relaunch

Bestand am 7. September 2026: `https://klavierlernen-berlin.de`.

## Entscheidungen im neuen Auftritt

Die deutsche Startseite bleibt die zentrale Seite für „Klavierunterricht in Berlin Prenzlauer Berg“. Der exakte bisherige Title bleibt erhalten. Die H1 enthält die vollständige Suchphrase. Die Beschreibung behält ihren Inhalt und korrigiert nur „Altergruppen“ zu „Altersgruppen“. Die bisherigen Themen und Angebote bleiben auf dieser URL; es werden keine konkurrierenden dünnen Angebotsseiten angelegt.

Die bestehende Seite `/ko/` hatte `/ko/home/` als Canonical. Beide Pfade bleiben als vollständige koreanische Seiten erreichbar; beide nennen weiterhin `/ko/home/` als Canonical. Die deutschen und koreanischen Sprachverweise zeigen gegenseitig auf die kanonischen Seiten. Keine automatischen Sprach- oder Länderweiterleitungen.

`/bio/`, `/audio/`, `/ko/audio/`, `/impressum/` und `/datenschutz/` bleiben erreichbar. Alle weiteren aus den ursprünglichen Sitemaps ermittelten Pfade werden als statische Archivseiten erhalten. Medien-Anhangseiten behalten die vorherigen Canonicals auf ihre Originalbilder. Diese nichtkanonischen Anhangseiten werden nicht nochmals in die neue Sitemap aufgenommen. Die Bilder selbst bleiben unter ihren alten Pfaden verfügbar.

Die bestehenden Sprungmarken `#aboutme`, `#unterricht`, `#pianistin`, `#kontakt` und `#0` bleiben erhalten. Preise, PDFs, MP3-Dateien und Originalbilder liegen weiterhin unter `/downloads/` beziehungsweise `/wp-content/uploads/`. Es bleibt auch die bisherige Adresse `/sitemap_index.xml` bestehen; sie verweist auf die neue Sitemap. Die alten Roh-Sitemaps liegen in der lokalen `.audit/inventory.json`.

Die sichtbar belegten Angaben werden als Person-, WebSite- und WebPage-Daten ausgegeben. Keine erfundenen Bewertungen oder unbelegten Geschäftsadressen in strukturierten Daten. Das vorhandene Social-Preview-Bild wurde erhalten.

## Vor dem Domainwechsel

1. Aus der bestehenden Google Search Console die wichtigsten Suchanfragen, Zielseiten, Klicks und Impressionen exportieren, einschließlich mindestens 16 Monaten zum Vergleich saisonaler Schwankungen. Zusätzliche dort belegte Zielseiten gegen den lokalen Routenbestand prüfen. Ein Sitemap-Crawl allein erfasst keine verwaisten URLs oder unbekannten Backlinks.
2. Den aktuellen Unterrichtsort, die ladungsfähige Anschrift und Telefonnummer bestätigen. Für das neue Impressum wurden Oderberger Str. 9 und die Telefonnummer aus der öffentlich vorhandenen Datenschutzerklärung übernommen. Andere öffentliche Verzeichnisse enthalten abweichende Adressen. Deshalb nicht ungeprüft als aktuellen Unterrichtsort bewerben.
3. Kontakt- und Informationspostfach prüfen. `kontakt@klavierschule.berlin` ist das bisherige Unterrichtspostfach; `info@klavierschule.berlin` war die rechtliche Kontaktadresse. Beide wurden bewusst erhalten.
4. Preise, Bedingungen und Probestunde bestätigen. Verwendet wird die Original-PDF mit Stand 27.12.2025. Eine Unterrichtsdauer der Probestunde wurde nicht erfunden. Die historische Biografie wurde anhand der Originalseite und Vita 2019 sprachlich geordnet; aktuelle Engagements bitte ergänzen, falls gewünscht.
5. Impressum und neue, auf GitHub Pages bezogene Datenschutzerklärung fachlich prüfen. Die Vorlage berücksichtigt den neuen technischen Aufbau, ist aber keine Zusicherung rechtlicher Vollständigkeit. Die Hostingbedingungen und Datenverarbeitung müssen zum tatsächlichen Vertrag passen.
6. Kontaktanfrage im vorgesehenen E-Mail-Programm, alle drei Hörproben und die PDF-Dateien manuell prüfen. Die Anfragehilfe versendet nichts selbst.
7. Aktuelle DNS-Werte und bisherigen Hostingstand für einen möglichen Rückweg sichern. Insbesondere die E-Mail-Domain `klavierschule.berlin` und ihre MX-Einträge erhalten.

## Umschaltung auf der bestehenden Domain

1. GitHub-Pages-Custom-Domain auf `klavierlernen-berlin.de` konfigurieren und Domainbesitz verifizieren. Den von GitHub vorgegebenen DNS-Einstellungen folgen. Vorhandene www- und Alternativdomains sowie ihre bisherige Weiterleitung vorher prüfen.
2. Nach erfolgreicher Domainzuordnung `PUBLIC_INDEXABLE=true` als Repositoryvariable setzen und den Workflow ausführen. `BASE_PATH` kommt automatisch aus der Pages-Konfiguration und muss für die eigene Domain `/` ergeben.
3. Nach erfolgreichem Deployment direkt auf der Originaldomain kontrollieren: Status 200 für alle wichtigen Routen, funktionierende Assets, `index, follow`, korrekter Canonical, korrekte Sprachverweise, erreichbare Sitemap und HTTPS.
4. Die GitHub-Adresse soll bei konfigurierter eigener Domain auf diese führen. Keine zweite indexierbare Kopie betreiben. Die Suchmaschinenadresse selbst bleibt gleich; dies ist kein Umzug auf eine neue Domain.
5. Die Sitemap in der bestehenden Search-Console-Property prüfen bzw. erneut einreichen. Die URL-Prüfung für `/`, `/ko/home/` und `/bio/` verwenden.

GitHub Pages kann keine frei konfigurierbaren serverseitigen 301-Regeln wie Apache ausführen. Bekannte alte Inhaltsseiten werden deshalb wirklich gebaut; ein JavaScript-Fallback ersetzt keine dauerhafte Weiterleitung. Weitere bekannte Backlink-URLs sollten gezielt als echte Routen erhalten oder an einer vorgeschalteten geeigneten Stelle weitergeleitet werden.

## Nach der Umschaltung

Indexierungsstatus, 404-Meldungen, kanonische Auswahl und die bisherigen wichtigsten Suchanfragen über mehrere Wochen beobachten. Änderungen bei Positionen und Klicks mit derselben Saison des Vorjahres und dem Stand vor dem Relaunch vergleichen. Größere weitere Inhaltsänderungen erst nach dieser Beobachtung vornehmen. Die technische Migration bewahrt bekannte Signale, garantiert aber keine bestimmten Rankings.

## Technische Prüfroutine

`npm run build` ruft `scripts/verify-build.mjs` auf. Der Prüfer gleicht den Build mit `seo-baseline.json` ab und bricht bei fehlenden Bestandsrouten, Originaldateien, Canonicals, Sprachverweisen, Sprungmarken, Metadaten oder gebrochenen internen Links ab. Der GitHub-Workflow führt denselben Prüfer aus.

Sowohl `BASE_PATH=/` als auch `BASE_PATH=/suk-astro-2026/` müssen erfolgreich sein. Preview-Modus verlangt `noindex`; Produktionsmodus verlangt indexierbare Inhaltsseiten. Die 404-Seite bleibt immer nicht indexierbar.
