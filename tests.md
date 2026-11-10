# Vérifications d’intégration — à effectuer dans le navigateur

Ces points sont des critères de contrôle, pas des résultats déjà obtenus.

1. À 375 px de large, aucun contenu ne déborde horizontalement.
2. Au clavier, les liens et les choix sont accessibles et le focus reste visible.
3. Les liens et zones de choix ont une hauteur d’au moins 44 px.
4. Les changements de récapitulatif sont annoncés dans la zone `aria-live`.
5. Aucune erreur ne s’affiche dans la console pendant le chargement et les interactions.

Les contrôles techniques réellement exécutés le 2026-11-10 sont consignés dans `journal.md`.

# Fonctionnalité 1: Affichage des fleurs
1. Est-ce que les fleurs s'affichent bien.
2. Est-ce que le nom s'affiche et correspond à la fleur.
3. Est-ce que le prix est à la tige.

# Fonctionnalité 2: Disponibilité des fleurs
1. Vérifier qu'une fleur indisponible, sans prix ou à vérifier est bien affiché grisée avec une mention "indisponible".
2. Vérifier si l'on peut sélectionné uniquement les fleurs disponibles. 

# Fonctionnalité 3: Choisir une couleur
1. Vérifier que seul les couleurs de cette fleur soit disponible et non celle des autres.
2. Vérifier que lorsque l'on change de fleur, les couleurs disponibles soient celle de la nouvelle fleur et non de l'ancienne.

# Fonctionnalité 4: Choix des tailles
1. Quand je choisi la taille petit, j'ai bine 7 tiges.
2. Quand je choisi la taille moyen, j'ai bine 12 tiges.
3. Quand je choisi la taille grand, j'ai bine 20 tiges.

# Fonctionnalité 5: Calculer le prix total
1. Vérifier si après chaque ajout de fleur le prix total se met à jour.
2. Vérifier si le prix de la tige se multiplie bien avec le nombre de tiges.
3. Est-ce que j'ai bien le prix de composition de 5 euros qui s'ajoute une fois par bouquet.

# Fonctionnalité 6: Récapitulatif commande
1. Est-ce que mon récapitulaif s'affiche en une phrase.
2. Vérifier que le récapitulatif affiche la taille, le nombre de tiges pour chaque fleurs choisis et la couleur.
3. Vérifier que le récapitulatif change lorsque l'utilisateur modifie un choix.

# Fonctionnalité 7: Validation commande
1. Vérifier que le prix et le lien "Commander ce bouquet" n'apparaissent pas tant que la fleur, la couleur et la taille ne sont pas choisis.
2. Si les 3 choix ne sont pas faits par l'ultilisateur verifié qu'il y ait un message pour inviter l'utilisateur à terminer les choix.
3. Quand les choix sont effectués vérifié que le lien "Commander ce bouquet" apparaît et qu'il redirige vers contact.html?objet=bouquet.
