// Application Fleurs Roussel : données structurées selon schema-configurateur.json.
const contenu = document.querySelector('#contenu');
const formatPrix = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

// Les frais de composition sont définis dans le sujet.
const fraisComposition = 5;

// Vérifie les champs utilisés avant d'afficher les données reçues.
function donneesValides(fleurs) {
  const cles = ['id', 'nom', 'prix_tige', 'couleurs', 'disponible', 'a_verifier'];
  const champsAVerifier = ['nom', 'prix_tige', 'couleurs', 'disponible'];
  return Array.isArray(fleurs) && fleurs.length > 0 && fleurs.every((fleur) => (
    fleur !== null && typeof fleur === 'object'
    && Object.keys(fleur).length === cles.length
    && cles.every((cle) => Object.hasOwn(fleur, cle))
    && typeof fleur.id === 'string' && /^[a-z]+(-[a-z]+)*$/.test(fleur.id)
    && typeof fleur.nom === 'string' && fleur.nom.length > 0
    && (fleur.prix_tige === null
      || (typeof fleur.prix_tige === 'number' && Number.isFinite(fleur.prix_tige) && fleur.prix_tige > 0))
    && Array.isArray(fleur.couleurs)
    && fleur.couleurs.every((couleur) => typeof couleur === 'string' && /^[a-zàâçéèêëîïôûùüÿ' -]+$/.test(couleur))
    && typeof fleur.disponible === 'boolean'
    && Array.isArray(fleur.a_verifier)
    && new Set(fleur.a_verifier).size === fleur.a_verifier.length
    && fleur.a_verifier.every((cle) => champsAVerifier.includes(cle))
    && (fleur.prix_tige !== null || fleur.a_verifier.includes('prix_tige'))
  ));
}

// Une fleur à vérifier ou sans prix reste visible, mais ne peut pas être choisie.
function estSelectionnable(fleur) {
  return fleur.disponible && fleur.prix_tige !== null && fleur.a_verifier.length === 0;
}

// Remplit le modèle de fleur et relie les choix au récapitulatif.
function afficherConfigurateur(fleurs) {
  const listeFleurs = contenu.querySelector('#choix-fleurs');
  const couleur = contenu.querySelector('#couleur');
  const taille = contenu.querySelector('#taille');
  const resume = contenu.querySelector('#resume');
  const prix = contenu.querySelector('#prix-total');
  const modeleFleur = contenu.querySelector('#modele-fleur');
  const commander = contenu.querySelector('#commander');
  let fleurChoisie = null;

  // Le lien et le prix n'apparaissent que lorsque les trois choix sont complets.
  function actualiserRecapitulatif() {
    // Le nombre de tiges est lu sur l’option définie dans le HTML.
    const optionTaille = taille.selectedOptions[0];
    const tailleChoisie = taille.value
      ? { id: taille.value, tiges: Number(optionTaille.dataset.tiges) }
      : null;
    const complet = fleurChoisie && estSelectionnable(fleurChoisie)
      && fleurChoisie.couleurs.includes(couleur.value) && tailleChoisie;
    commander.classList.toggle('hidden', !complet);
    prix.classList.toggle('hidden', !complet);
    prix.textContent = '';

    if (!complet) {
      resume.textContent = 'Choisissez une fleur, une couleur et une taille pour voir le prix de votre bouquet.';
      return;
    }

    resume.textContent = `Bouquet ${tailleChoisie.id} : ${tailleChoisie.tiges} tiges de ${fleurChoisie.nom.toLocaleLowerCase('fr-FR')}, coloris ${couleur.value}.`;
    // Calcul en centimes pour éviter les imprécisions usuelles des nombres décimaux.
    const totalCentimes = Math.round(fleurChoisie.prix_tige * 100) * tailleChoisie.tiges
      + fraisComposition * 100;
    prix.textContent = `Total : ${formatPrix.format(totalCentimes / 100)} (dont ${formatPrix.format(fraisComposition)} de composition)`;
  }

  // Chaque ligne affiche le prix connu, même lorsque la fleur est indisponible.
  fleurs.forEach((fleur, index) => {
    const disponible = estSelectionnable(fleur);
    // On copie le modèle HTML, puis on insère les données comme du texte.
    const element = modeleFleur.content.cloneNode(true);
    const choix = element.querySelector('input');
    choix.value = fleur.id;
    choix.id = `fleur-${index}`;
    choix.disabled = !disponible;
    // Les chemins respectent exactement la casse des fichiers fournis.
    const imagesFleurs = {
      rose: 'rose.svg',
      tulipe: 'tulipe.svg',
      renoncule: 'renoncule.svg',
      eucalyptus: 'Eucalyptus.svg',
      pivoine: 'pivoine.svg',
      lys: 'Lys.svg',
      anemone: 'Anemone.svg',
    };
    if (Object.hasOwn(imagesFleurs, fleur.id)) {
      const image = element.querySelector('[data-image]');
      image.src = `img/fleurs/${imagesFleurs[fleur.id]}`;
      image.classList.remove('hidden');
    }
    element.querySelector('[data-nom]').textContent = fleur.nom;
    element.querySelector('[data-prix]').textContent = fleur.prix_tige === null
      ? 'Prix à vérifier'
      : `${formatPrix.format(fleur.prix_tige)} la tige`;
    element.querySelector('[data-statut]').classList.toggle('hidden', disponible);
    listeFleurs.append(element);

    // Changer de fleur efface la couleur précédente pour éviter un choix incompatible.
    choix.addEventListener('change', () => {
      fleurChoisie = fleur;
      couleur.replaceChildren(new Option('Choisissez une couleur', ''));
      fleur.couleurs.forEach((coloris) => couleur.add(new Option(coloris, coloris)));
      couleur.disabled = false;
      actualiserRecapitulatif();
    });
  });

  couleur.addEventListener('change', actualiserRecapitulatif);
  taille.addEventListener('change', actualiserRecapitulatif);
  // Le configurateur utilise uniquement le lien vers le formulaire de contact.
  contenu.querySelector('form').addEventListener('submit', (evenement) => evenement.preventDefault());
  actualiserRecapitulatif();
}

// Affiche un message explicite si le serveur ou le fichier de données pose problème.
async function chargerFleurs() {
  // Le message de chargement ne remplace pas la structure de la page.
  const chargement = contenu.querySelector('#chargement');
  try {
    const reponse = await fetch('data/donnees.json');
    if (!reponse.ok) throw new Error(`Chargement impossible : HTTP ${reponse.status}`);
    const fleurs = await reponse.json();
    if (!donneesValides(fleurs)) throw new Error('Les données des fleurs ne respectent pas le format attendu.');
    afficherConfigurateur(fleurs);
    chargement.classList.add('hidden');
  } catch (erreur) {
    chargement.textContent = 'Impossible de charger les fleurs. Vérifiez le fichier de données et ouvrez le site avec le serveur local.';
    console.error(erreur);
  }
}

if (contenu) chargerFleurs();
