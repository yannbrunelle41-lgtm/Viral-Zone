// Les chemins respectent les noms exacts des illustrations déjà présentes.
const imagesFleurs = {
  rose: "img/fleurs/rose.svg",
  tulipe: "img/fleurs/tulipe.svg",
  renoncule: "img/fleurs/renoncule.svg",
  eucalyptus: "img/fleurs/Eucalyptus.svg",
  pivoine: "img/fleurs/pivoine.svg",
  lys: "img/fleurs/Lys.svg",
  anemone: "img/fleurs/Anemone.svg",
};

const formatPrix = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

// Charge les données existantes sans modifier les prix ni les disponibilités.
async function afficherFleurs() {
  try {
    const reponse = await fetch("data/donnees.json");
    if (!reponse.ok) throw new Error("Chargement du catalogue impossible");
    const fleurs = await reponse.json();
    const liste = document.querySelector("#liste-fleurs");
    const modele = document.querySelector("#modele-fleur");
    // Une seule fleur peut être sélectionnée à la fois.
    let boutonSelectionne = null;
    let couleursSelectionnees = null;

    // Arrondir au-dessus place la fleur supplémentaire dans la colonne gauche.
    const separation = Math.ceil(fleurs.length / 2);
    const colonnes = [fleurs.slice(0, separation), fleurs.slice(separation)];

    for (const fleursColonne of colonnes) {
      const colonne = document.createElement("ul");
      colonne.className = "flex min-w-0 flex-col gap-4 md:gap-6";

      for (const fleur of fleursColonne) {
        const carte = modele.content.cloneNode(true);
        const image = carte.querySelector("img");
        const bouton = carte.querySelector("button");
        const listeCouleurs = carte.querySelector("[data-couleurs]");
        listeCouleurs.setAttribute("aria-label", `Couleurs de ${fleur.nom}`);
        // Les libellés viennent uniquement du catalogue ; aucun HTML n'est interprété.
        for (const couleur of fleur.couleurs) {
          const element = document.createElement("li");
          const etiquette = document.createElement("label");
          etiquette.className = "flex cursor-pointer items-center gap-1 whitespace-nowrap md:gap-2";
          const radio = document.createElement("input");
          radio.type = "radio";
          radio.name = "couleur";
          radio.value = couleur;
          radio.className = "shrink-0 cursor-pointer accent-roussel-vert";
          const libelle = document.createElement("span");
          libelle.textContent = couleur;
          etiquette.append(radio, libelle);
          element.append(etiquette);
          listeCouleurs.append(element);
        }
        // Une donnée manquante ou à vérifier interdit également la sélection.
        const selectionnable = fleur.disponible === true
          && Number.isFinite(fleur.prix_tige)
          && Array.isArray(fleur.a_verifier)
          && fleur.a_verifier.length === 0;
        bouton.disabled = !selectionnable;
        carte.querySelector("[data-disponibilite]").hidden = selectionnable;
        bouton.addEventListener("click", () => {
          if (!selectionnable) return;
          // Un changement de fleur cache l'ancienne liste et réinitialise sa couleur.
          if (boutonSelectionne !== bouton) {
            if (couleursSelectionnees) {
              couleursSelectionnees.hidden = true;
              for (const radio of couleursSelectionnees.querySelectorAll("input")) {
                radio.checked = false;
              }
            }
            listeCouleurs.hidden = false;
            couleursSelectionnees = listeCouleurs;
          }
          boutonSelectionne?.classList.remove("bg-roussel-vert-clair");
          boutonSelectionne?.setAttribute("aria-pressed", "false");
          bouton.classList.add("bg-roussel-vert-clair");
          bouton.setAttribute("aria-pressed", "true");
          boutonSelectionne = bouton;
        });
        image.src = imagesFleurs[fleur.id];
        image.alt = ""; // Le nom adjacent décrit déjà la fleur.
        // textContent affiche les données comme du texte, sans interpréter de HTML.
        carte.querySelector("[data-nom]").textContent = fleur.nom;
        carte.querySelector("[data-prix]").textContent = !Number.isFinite(fleur.prix_tige)
          ? "Prix à vérifier"
          : `${formatPrix.format(fleur.prix_tige)} / tige`;
        colonne.append(carte);
      }

      liste.append(colonne);
    }
  } catch (erreur) {
    document.querySelector("#erreur-fleurs").hidden = false;
    console.error(erreur);
  }
}

afficherFleurs();
