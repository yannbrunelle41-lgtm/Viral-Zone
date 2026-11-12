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

    // Arrondir au-dessus place la fleur supplémentaire dans la colonne gauche.
    const separation = Math.ceil(fleurs.length / 2);
    const colonnes = [fleurs.slice(0, separation), fleurs.slice(separation)];

    for (const fleursColonne of colonnes) {
      const colonne = document.createElement("ul");
      colonne.className = "flex min-w-0 flex-col gap-4 md:gap-6";

      for (const fleur of fleursColonne) {
        const carte = modele.content.cloneNode(true);
        const image = carte.querySelector("img");
        image.src = imagesFleurs[fleur.id];
        image.alt = fleur.nom;
        // textContent affiche les données comme du texte, sans interpréter de HTML.
        carte.querySelector("h2").textContent = fleur.nom;
        carte.querySelector("p").textContent = fleur.prix_tige === null
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
