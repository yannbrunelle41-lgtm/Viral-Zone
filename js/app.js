// Application Fleurs Roussel : données structurées selon schema-configurateur.json.
const contenu = document.querySelector('#contenu');
const formatPrix = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

// Les tailles et les frais de composition sont définis dans le sujet.
const tailles = [
  { id: 'petit', tiges: 7 },
  { id: 'moyen', tiges: 12 },
  { id: 'grand', tiges: 20 },
];
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

function afficherConfigurateur(fleurs) {
  // Ce gabarit est fixe : les données externes sont insérées ensuite avec textContent.
  contenu.innerHTML = `
    <h1 class="mb-6 text-3xl font-bold text-roussel-vert">Composez votre bouquet</h1>
    <form class="grid gap-6" aria-label="Configurateur de bouquet">
      <fieldset>
        <legend class="mb-3 text-xl font-semibold">1. Choisissez une fleur</legend>
        <div id="choix-fleurs" class="grid gap-3 sm:grid-cols-2"></div>
      </fieldset>
      <div class="grid gap-2">
        <label for="couleur" class="text-xl font-semibold">2. Choisissez une couleur</label>
        <select id="couleur" class="rounded border border-roussel-gris p-3 disabled:opacity-50" disabled>
          <option value="">Choisissez d’abord une fleur</option>
        </select>
      </div>
      <div class="grid gap-2">
        <label for="taille" class="text-xl font-semibold">3. Choisissez une taille</label>
        <select id="taille" class="rounded border border-roussel-gris p-3">
          <option value="">Choisissez une taille</option>
        </select>
      </div>
    </form>
    <section class="mt-6 grid gap-3 rounded bg-roussel-vert-clair p-5" aria-label="Votre bouquet">
      <div id="resultat" class="grid gap-2" role="status" aria-live="polite"></div>
      <a id="commander" href="contact.html?objet=bouquet" class="hidden w-fit rounded bg-roussel-vert px-4 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2">Commander ce bouquet</a>
    </section>
  `;

  const listeFleurs = contenu.querySelector('#choix-fleurs');
  const couleur = contenu.querySelector('#couleur');
  const taille = contenu.querySelector('#taille');
  const resultat = contenu.querySelector('#resultat');
  const commander = contenu.querySelector('#commander');
  let fleurChoisie = null;

  // Le lien et le prix n'apparaissent que lorsque les trois choix sont complets.
  function actualiserRecapitulatif() {
    const tailleChoisie = tailles.find((element) => element.id === taille.value);
    const complet = fleurChoisie && estSelectionnable(fleurChoisie)
      && fleurChoisie.couleurs.includes(couleur.value) && tailleChoisie;
    commander.classList.toggle('hidden', !complet);
    resultat.replaceChildren();

    if (!complet) {
      resultat.textContent = 'Choisissez une fleur, une couleur et une taille pour voir le prix de votre bouquet.';
      return;
    }

    const resume = document.createElement('p');
    resume.textContent = `Bouquet ${tailleChoisie.id} : ${tailleChoisie.tiges} tiges de ${fleurChoisie.nom.toLocaleLowerCase('fr-FR')}, coloris ${couleur.value}.`;
    const prix = document.createElement('p');
    prix.className = 'text-xl font-bold text-roussel-vert';
    // Calcul en centimes pour éviter les imprécisions usuelles des nombres décimaux.
    const totalCentimes = Math.round(fleurChoisie.prix_tige * 100) * tailleChoisie.tiges
      + fraisComposition * 100;
    prix.textContent = `Total : ${formatPrix.format(totalCentimes / 100)} (dont ${formatPrix.format(fraisComposition)} de composition)`;
    resultat.append(resume, prix);
  }

  // Chaque ligne affiche le prix connu, même lorsque la fleur est indisponible.
  fleurs.forEach((fleur, index) => {
    const disponible = estSelectionnable(fleur);
    const etiquette = document.createElement('label');
    etiquette.className = disponible
      ? 'flex cursor-pointer items-center gap-3 rounded border border-roussel-vert p-3'
      : 'flex cursor-not-allowed items-center gap-3 rounded border border-roussel-gris p-3 text-roussel-gris opacity-60';
    const choix = document.createElement('input');
    choix.type = 'radio';
    choix.name = 'fleur';
    choix.value = fleur.id;
    choix.id = `fleur-${index}`;
    choix.disabled = !disponible;
    const texte = document.createElement('span');
    const prix = fleur.prix_tige === null ? 'prix à vérifier' : `${formatPrix.format(fleur.prix_tige)} la tige`;
    texte.textContent = `${fleur.nom} — ${prix}${disponible ? '' : ' — Indisponible'}`;
    etiquette.append(choix, texte);
    listeFleurs.append(etiquette);

    // Changer de fleur efface la couleur précédente pour éviter un choix incompatible.
    choix.addEventListener('change', () => {
      fleurChoisie = fleur;
      couleur.replaceChildren(new Option('Choisissez une couleur', ''));
      fleur.couleurs.forEach((coloris) => couleur.add(new Option(coloris, coloris)));
      couleur.disabled = false;
      actualiserRecapitulatif();
    });
  });

  tailles.forEach((element) => {
    taille.add(new Option(`${element.id} (${element.tiges} tiges)`, element.id));
  });
  couleur.addEventListener('change', actualiserRecapitulatif);
  taille.addEventListener('change', actualiserRecapitulatif);
  // Le configurateur utilise uniquement le lien vers le formulaire de contact.
  contenu.querySelector('form').addEventListener('submit', (evenement) => evenement.preventDefault());
  actualiserRecapitulatif();
}

// Affiche un message explicite si le serveur ou le fichier de données pose problème.
async function chargerFleurs() {
  contenu.textContent = 'Chargement des fleurs…';
  try {
    const reponse = await fetch('data/donnees.json');
    if (!reponse.ok) throw new Error(`Chargement impossible : HTTP ${reponse.status}`);
    const fleurs = await reponse.json();
    if (!donneesValides(fleurs)) throw new Error('Les données des fleurs ne respectent pas le format attendu.');
    afficherConfigurateur(fleurs);
  } catch (erreur) {
    contenu.textContent = 'Impossible de charger les fleurs. Vérifiez le fichier de données et ouvrez le site avec le serveur local.';
    console.error(erreur);
  }
}

if (contenu) chargerFleurs();
