# Application Fleurs Roussel

Configurateur de bouquet réalisé en HTML, Tailwind CSS 4 et JavaScript. L’utilisateur choisit une fleur, une couleur et une taille, puis consulte le prix et le récapitulatif du bouquet.

## Fonctionnement

- Le catalogue est chargé depuis `data/donnees.json` : illustration, nom et prix à la tige.
- Une seule fleur peut être sélectionnée. Les fleurs indisponibles, sans prix numérique ou avec un champ à vérifier sont grisées et bloquées.
- Les couleurs proposées sont uniquement celles de la fleur sélectionnée.
- Les tailles apparaissent après le choix d’une couleur : petit (7 tiges), moyen (12 tiges), grand (20 tiges).
- Le prix total correspond au prix d’une tige multiplié par le nombre de tiges, avec 5,00 € de composition ajoutés une seule fois.
- Le prix, la phrase récapitulative et le lien de commande apparaissent une fois les trois choix effectués.
- Changer de fleur efface les choix de couleur et de taille précédents.

Le lien « Commander ce bouquet » pointe vers `contact.html?objet=bouquet`. Les pages `contact.html`, `bouquets.html` et `abonnement.html` ne sont pas présentes dans ce projet : les liens ne permettent donc pas encore de consulter ces pages.

## Affichage mobile et desktop

Sous 768 px, les fleurs s’affichent sur une seule colonne occupant la largeur disponible. Le bloc de calcul du prix et le lien de commande sont centrés.

À partir de 768 px, les fleurs sont réparties sur deux colonnes de même largeur. En cas de nombre impair, la colonne gauche contient une fleur de plus. Le bloc de calcul du prix est aligné à droite ; le lien de commande reste centré sous le récapitulatif.

## Installer

Prérequis : Node.js et npm.

Installer les dépendances déclarées dans `package.json` :

```sh
npm install
```

## Lancer le projet

Dans un premier terminal, générer les styles Tailwind et surveiller les modifications :

```sh
npm run dev
```

Dans un second terminal, démarrer le serveur local :

```sh
npm run serve
```

Ouvrir [http://localhost:8080](http://localhost:8080). Le serveur est nécessaire pour charger le catalogue avec `fetch` ; ouvrir directement `index.html` depuis le disque ne suffit pas.

Pour générer une fois le fichier CSS minifié :

```sh
npm run build
```

`dist/output.css` est généré depuis les sources Tailwind. Les modifications de présentation se font dans les classes HTML et JavaScript ou dans le thème `src/input.css`.

## Organisation

| Fichier ou dossier | Rôle |
| --- | --- |
| `index.html` | Structure de la page et modèle des cartes de fleurs |
| `js/app.js` | Chargement du catalogue, choix du bouquet, calcul et récapitulatif |
| `data/donnees.json` | Catalogue des sept fleurs et champs à vérifier |
| `img/fleurs/` | Illustrations SVG fournies dans le projet |
| `src/input.css` | Import de Tailwind et couleurs du thème Roussel |
| `dist/output.css` | Styles générés par Tailwind |
| `package.json` | Dépendances et commandes npm |
| `AGENTS.md` | Règles de travail de l’équipe |
| `prompts/` | Prompts de contenu, de fonctionnalités et de relecture |
| `tests.md` | Cas fonctionnels et vérifications d’intégration à effectuer |
| `journal.md` | Suivi du travail et des vérifications consignées |

## Données du catalogue

Chaque fleur possède les champs `id`, `nom`, `prix_tige`, `couleurs`, `disponible` et `a_verifier`. Un prix inconnu vaut `null` et doit être signalé dans `a_verifier`.

Les prix et les disponibilités ne sont pas recalculés depuis la source cliente par l’application : elle utilise le catalogue enregistré. Toute mise à jour doit respecter les règles d’`AGENTS.md` et être vérifiée auprès de sa source. Les noms et les couleurs sont insérés comme du texte avec `textContent`.

## Vérifier le fonctionnement

Les cas détaillés sont dans `tests.md`. Dans le navigateur, contrôler notamment :

1. L’affichage des sept fleurs et le blocage de Pivoine, Lys et Anémone avec le catalogue actuel.
2. L’apparition des couleurs, puis des tailles, et leur remise à zéro lors d’un changement de fleur.
3. Pour une rose à 2,50 € la tige : 22,50 € pour 7 tiges, 35,00 € pour 12 et 55,00 € pour 20, composition comprise.
4. Le masquage du prix et de la commande tant que les choix sont incomplets.
5. L’affichage à 375 px, à 767 px et à 768 px : colonnes, centrage et absence de débordement horizontal.
6. Le parcours au clavier, la visibilité du focus, les annonces du récapitulatif et la console du navigateur.

Cette liste décrit des contrôles à réaliser ; elle ne constitue pas un compte rendu de tests réussis.
