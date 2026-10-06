# Jongsuk Kim · Astro 2026

Neuer Auftritt für den Klavierunterricht in Berlin Prenzlauer Berg. Astro 7, TypeScript, statische HTML-Seiten, lokal bereitgestellte Schriftarten und Originalfotos. Deployment über GitHub Actions und GitHub Pages.

## Lokal starten

Node.js 22.12 oder neuer, npm 9.6 oder neuer.

```sh
npm ci
npm run dev
```

Astro gibt die lokale Vorschauadresse aus. Die Dateien in `dist/` sind die fertig gebaute Website; das Wurzelverzeichnis ist das Quellprojekt.

```sh
npm run check
npm run build
npm run preview
```

## Inhalte bearbeiten

- `src/components/Home.astro`: deutsche und koreanische Startseite, Unterricht, Biografie-Auszug und FAQ.
- `src/lib/site.ts`: E-Mail, Preise, Datum der Preisliste, kanonische Domain und Hörproben.
- `src/components/Contact.astro`: Anfragehilfe. Sie öffnet eine vorbereitete E-Mail; es gibt kein Backend und keine automatische Versendung.
- `src/pages/bio.astro`: ausführliche Biografie.
- `src/pages/impressum.astro` / `datenschutz.astro`: rechtliche Angaben für den neuen statischen Auftritt.
- `src/styles/global.css`: Gestaltung und responsive Breakpoints.
- `public/downloads/` und `public/wp-content/uploads/`: Originaldateien an unveränderten URL-Pfaden.

Bei Preisänderungen sowohl `site.ts` als auch die preisbezogenen FAQ in `Home.astro` und die Original-PDF aktualisieren. Keine erfundenen Bewertungen, Auszeichnungen oder freien Termine ergänzen.

## GitHub Pages

Die Workflow-Datei `.github/workflows/deploy.yml` baut bei jedem Push auf `main`, prüft die vollständige Ausgabe und veröffentlicht anschließend. Die Pages-Einstellung des Repositorys muss „GitHub Actions“ als Quelle verwenden.

Der Workflow bezieht den Basispfad automatisch aus GitHub Pages. Damit funktioniert die Vorschau unter `/<repository>/` ebenso wie später die ursprüngliche Domain ohne Unterverzeichnis. Ein zusätzlicher Server, PHP und WordPress sind nicht erforderlich.

## SEO und Freischaltung

### Vergleichsfassung (6. Oktober 2026)

Die ruhigere Inhaltsfassung ist noch **nicht übernommen**. Sie liegt in der
GitHub-Pages-Vorschau separat unter `/vergleich/` und auf Koreanisch unter
`/vergleich/ko/`. Die bisherigen Startseiten bleiben unverändert. Das bestehende
Stil-Auswahlfeld enthält zusätzlich „Bisher / Ruhiger“; alle vier Schriftstile
stehen für beide Fassungen zur Verfügung. Der gewählte Schriftstil bleibt beim
Wechsel erhalten, die Inhaltsfassung wird dagegen nicht als neue Voreinstellung
gespeichert. Beim Umschalten innerhalb eines Abschnitts wird dessen Anker übernommen.

`src/components/CalmHome.astro` und `src/styles/calm-preview.css` enthalten das
isolierte Experiment. Es kürzt Wiederholungen, vereinfacht Preise und Kontakt und
behält die Fotos, beide Spezialangebote, CD und alle Hörproben bei. Die Absage-
und 10er-Karten-Regeln bleiben erhalten. Die Stil-Auswahl ist weiterhin einklappbar;
ihr eingeklappter Zustand bleibt während derselben Browsersitzung erhalten.

Die Vergleichsseiten sind `noindex`, nicht in der Sitemap und werden bei
`PUBLIC_INDEXABLE=true` gar nicht gebaut. Erst nach Auswahl durch den Nutzer
sollen einzelne Änderungen auf die bisherigen Startseiten übertragen werden.
`scripts/verify-calm-preview.mjs` prüft diese Trennung bei jedem Build.

### Freischaltung der Hauptwebsite

Standardmäßig enthalten alle HTML-Seiten `noindex, follow`. Diese Einstellung schützt die bestehende Domain vor einer konkurrierenden Vorschau. Die Canonicals verweisen weiterhin auf `https://klavierlernen-berlin.de`. Die Website auf der bisherigen Domain wurde für diesen Relaunch nicht verändert.

**Die Vorschau nicht mit `noindex` als fertige Hauptwebsite einsetzen.** Erst beim abgestimmten Domainwechsel die GitHub-Repositoryvariable `PUBLIC_INDEXABLE` auf `true` setzen und den Workflow neu ausführen. Alle Schritte stehen in `docs/SEO-MIGRATION.md`.

Ein lokaler Produktionstest ohne Veröffentlichung ist möglich:

```sh
PUBLIC_INDEXABLE=true BASE_PATH=/ npm run build
```

Die automatischen Prüfungen vergleichen alte Routen und Dateien mit `docs/seo-baseline.json`, erhalten die Hauptüberschrift und den Suchmaschinentitel, prüfen Canonicals, Sprachverweise, Sitemaps sowie interne Links. Sie können reale Rankingänderungen nicht vorhersagen; dafür sind die bisherige Search Console und ihre Leistungsdaten maßgeblich.

## Quellen und Übernahme

Originalauftritt und Sitemap am 7. September 2026 erfasst. Nur öffentlich erreichbare Inhalte übernommen. Fotos, PDFs und Aufnahmen behalten ihre bestehenden Rechte; das Repository vergibt dafür keine neue Lizenz. `.audit/` enthält die lokale Rohsicherung und wird nicht veröffentlicht. Die einmaligen Archivskripte sollten nur bewusst ausgeführt werden, weil sie Inhalte vom alten Auftritt erneut übernehmen.
