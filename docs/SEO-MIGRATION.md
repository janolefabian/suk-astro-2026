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
3. Die direkte Kontaktadresse `jongsuk.kim83@gmail.com` wurde am 11.10.2026 vom Auftraggeber freigegeben. Sie ersetzt die Weiterleitungsadressen auf den Webseiten, einschließlich Impressum und Datenschutz. Bestehende Mail-Dienste werden dadurch nicht geändert oder gelöscht.
4. Preise und Bedingungen beruhen auf der Original-PDF mit Stand 27.12.2025 und den eingearbeiteten Rückmeldungen von Frau Kim. Eine Unterrichtsdauer der Probestunde wurde nicht erfunden. Die Biografie wurde anhand ihrer neuen Vita aktualisiert.
5. Impressum und neue, auf GitHub Pages bezogene Datenschutzerklärung fachlich prüfen. Die Vorlage berücksichtigt den neuen technischen Aufbau, ist aber keine Zusicherung rechtlicher Vollständigkeit. Die Hostingbedingungen und Datenverarbeitung müssen zum tatsächlichen Vertrag passen.
6. Kontaktlink im vorgesehenen E-Mail-Programm, alle drei Hörproben und die PDF-Dateien manuell prüfen. Die freigegebene Live-Fassung nutzt einen E-Mail-Link, kein Formular; die ältere Anfragehilfe bleibt nur in der Vergleichsvorschau.
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

## Freigegebene Live-Fassung und DNS-Stand am 11.10.2026

Für `PUBLIC_INDEXABLE=true` werden die ruhigeren Startseiten auf `/`, `/ko/` und `/ko/home/` veröffentlicht, mit festem Salon-Design und ohne Vergleichsleiste oder Speicherung von Stilpräferenzen. `Fortgeschrittene & Studium` bleibt offen sichtbar. Im Vorschau-Modus bleiben die ältere Startseite und `/vergleich/` mit vier Stilen verfügbar; Vergleichsrouten werden nicht in den Live-Build oder die Sitemap übernommen.

Der Auftraggeber hat abschließend entschieden: Domain und künftig DNS bei do.de; Website direkt bei GitHub Pages; bestehende E-Mail-Weiterleitungen unverändert bei ALL-INKL. Dazu muss zuerst die neue DNS-Zone bei do.de einschließlich der bisherigen Mail- und Verifizierungseinträge vorbereitet werden, danach erst die Nameserver auf do.de umstellen. Keine URL-/Frame-Weiterleitung. Keine Änderungen am ALL-INKL-Konto und keine Abschaltung der alten Website oder Mail-Dienste.

Read-only-Abfrage des autoritativen Servers `ns5.kasserver.com` vor der Umschaltung:

| Name | Typ | Bisheriger Wert | TTL |
| --- | --- | --- | --- |
| klavierlernen-berlin.de | A | 85.13.164.225 | 7200 |
| www.klavierlernen-berlin.de | A (Antwort) | 85.13.164.225 | 7200 |
| klavierlernen-berlin.de | MX | 10 w0141a15.kasserver.com. | 7200 |
| klavierlernen-berlin.de | TXT | v=spf1 a mx include:spf.kasserver.com ~all | 7200 |
| klavierlernen-berlin.de | TXT | google-site-verification=XZ37G_tetzkK6YMT2i1jP27WPBG29WpMVfSYQ9NQKnA | 7200 |

Aktive Nameserver: `ns5.kasserver.com`, `ns6.kasserver.com`. Für die Hauptdomain wurden keine AAAA- oder CAA-Antworten geliefert. Ob `www` explizit oder über Wildcard aufgelöst wird, muss anhand der KAS-Zone geprüft werden. Dies ist kein vollständiger Zonenexport und kein Backup des WordPress-Servers. Die alte Website nicht löschen.

Die noch nicht delegierte do.de-Zone enthält derzeit andere Web- und Mailziele (`116.202.9.166`, `mx01.mail-redirect.de`, `mx02.mail-redirect.eu`); diese sind keine Kopie der aktiven ALL-INKL-Zone. Nicht unverändert aktivieren. Bestehende weitere Subdomain-, DKIM- oder Verifizierungseinträge sind vor dem Nameserverwechsel anhand eines vollständigen Zonenexports zu prüfen; einzelne DNS-Abfragen können die Vollständigkeit nicht beweisen.

Die separate Domain `klavierschule.berlin` ist bereits an do.de delegiert und hat öffentlich die MX-Einträge `mx01.mail-redirect.de` / `mx02.mail-redirect.eu`. Sie bleibt vollständig unangetastet. Das öffentlich sichtbare Mailrouting ist nicht mit den gespeicherten Weiterleitungsregeln gleichzusetzen; diese Regeln wurden nicht eingesehen.

DNS-Ziel nach Zuordnung der Custom Domain bei GitHub: vier A-Records für die Hauptdomain (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) und ein expliziter CNAME `www` auf `janolefabian.github.io.`. Keine Wildcard auf GitHub richten. Bestehende Mail- und Verifizierungsrecords erhalten. HTTPS und tatsächliche Live-Erreichbarkeit erst nach der Umschaltung als erfolgreich markieren.

Quelle: [GitHub: Custom Domain verwalten](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). Bei einem Actions-Deployment wird die Domain in den Pages-Einstellungen verwaltet, nicht über eine CNAME-Datei.
