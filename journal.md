# Journal des prompts

## 2026-11-10 — Europe/Paris — Application des conventions

- **Demande :** « mes à jour ce qui doit l'être », à la suite de la vérification des trois PDF du dossier `fiches-et-conventions-6af1937f7d3f7259265755`.
- **Sources :** `conventions-integration.pdf`, `fiche-techniques-structuration.pdf` et `fiche-chainer-des-prompts.pdf` dans ce dossier voisin.
- **Résultat :** titres de parties ajoutés dans le HTML, contours de focus roses, liens de navigation d’au moins 44 px de haut, prix roses, grille élargie à partir de `md`, commentaire de fonction ajouté. CSS Tailwind recompilé.
- **Vérification :** `node --check js/app.js` et `npm run build` réussis. Analyse statique HTML réussie : un seul h1, identifiants uniques, absence de balise style et d’attribut style, classes de focus demandées présentes sur tous les liens.
- **À vérifier dans le navigateur :** rendu à 375 px, navigation au clavier, annonces des messages et absence d’erreurs pendant les interactions. Ces contrôles ne sont pas déclarés réussis.
- **Limites :** les pages `bouquets.html`, `abonnement.html` et `contact.html` ne sont pas présentes dans le projet. Les liens existants sont conservés ; leur destination ne peut pas être validée ici. Les images de quatre fleurs restent manquantes.
- **Historique :** cette entrée décrit uniquement cette intervention. Elle ne reconstitue pas des exécutions ou commits antérieurs. Les essais isolés des prompts et les essais dans un second assistant restent à effectuer.
