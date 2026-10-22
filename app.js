/* ==========================================================
   My-QHSE Tools – app.js
   1) CONFIGURATION : seuils et libellés (à modifier ici)
   2) LOGIQUE : fonctions de calcul (sans lien avec la page)
   3) INTERFACE : affichage, formulaire, tableau
   ========================================================== */

/* ---------- 1) CONFIGURATION ----------
   Seuils PROVISOIRES, à remplacer après validation d'une méthode QHSE.
   Score = probabilité × gravité (de 1 à 25).
   "max" = score maximum inclus dans le niveau. Gardez-les dans l'ordre croissant. */
const CONFIG = {
  echelle: { min: 1, max: 5 },
  probabilite: ["Très improbable", "Improbable", "Possible", "Probable", "Très probable"],
  gravite: ["Négligeable", "Faible", "Importante", "Grave", "Catastrophique"],
  niveaux: [
    { id: "faible",   nom: "Faible",   max: 4,  couleur: "#cfeedd", action: "Risque acceptable. Maintenir les mesures existantes et surveiller." },
    { id: "modere",   nom: "Modéré",   max: 9,  couleur: "#fff1b8", action: "Prévoir des mesures de réduction à moyen terme." },
    { id: "eleve",    nom: "Élevé",    max: 16, couleur: "#ffd2a3", action: "Mettre en place des actions correctives prioritaires." },
    { id: "critique", nom: "Critique", max: 25, couleur: "#f5b3b0", action: "Risque inacceptable. Agir immédiatement, arrêter l'activité si nécessaire." }
  ]
};

/* ---------- 2) LOGIQUE ---------- */

/** Vérifie qu'une valeur est un entier entre 1 et 5. */
function estValide(valeur) {
  const n = Number(valeur);
  return valeur !== "" && valeur !== null && Number.isInteger(n) &&
         n >= CONFIG.echelle.min && n <= CONFIG.echelle.max;
}

/** Retourne le score (P × G) ou null si une valeur est invalide. */
function calculerScore(probabilite, gravite) {
  if (!estValide(probabilite) || !estValide(gravite)) return null;
  return Number(probabilite) * Number(gravite);
}

/** Retourne le niveau (objet de CONFIG.niveaux) correspondant à un score. */
function trouverNiveau(score) {
  if (!Number.isInteger(score) || score < 1) return null;
  return CONFIG.niveaux.find(n => score <= n.max) || null;
}

/** Échappe le texte saisi avant de l'afficher (sécurité). */
function echapper(texte) {
  const d = document.createElement("div");
  d.textContent = texte;
  return d.innerHTML;
}

/* Permet de tester la logique avec Node.js (ignoré dans le navigateur) */
if (typeof module !== "undefined") {
  module.exports = { CONFIG, estValide, calculerScore, trouverNiveau };
}

/* ---------- 3) INTERFACE (navigateur uniquement) ---------- */
if (typeof document !== "undefined") {
  const evaluations = [];   // Mémoire de la session : vidée au rechargement
  let compteur = 0;
  const $ = id => document.getElementById(id);

  /** Remplit les listes déroulantes Probabilité et Gravité. */
  function remplirListes() {
    [["probabilite", CONFIG.probabilite], ["gravite", CONFIG.gravite]].forEach(([id, libelles]) => {
      const sel = $(id);
      sel.innerHTML = '<option value="">Choisir…</option>' +
        libelles.map((l, i) => `<option value="${i + 1}">${i + 1} – ${l}</option>`).join("");
    });
  }

  /** Dessine la matrice : gravité en lignes (5 en haut), probabilité en colonnes. */
  function dessinerMatrice(actif) {
    let h = '<thead><tr><th scope="col"><span class="sr">Gravité / Probabilité</span></th>';
    for (let p = 1; p <= 5; p++) h += `<th scope="col">P${p}</th>`;
    h += "</tr></thead><tbody>";
    for (let g = 5; g >= 1; g--) {
      h += `<tr><th scope="row">G${g}</th>`;
      for (let p = 1; p <= 5; p++) {
        const s = p * g, niv = trouverNiveau(s);
        const est = actif && actif.p === p && actif.g === g;
        h += `<td class="${est ? "actif" : ""}" style="background:${niv.couleur}"` +
             ` aria-label="Probabilité ${p}, gravité ${g}, score ${s}, ${niv.nom}">${s}</td>`;
      }
      h += "</tr>";
    }
    $("matrice-table").innerHTML = h + "</tbody>";
  }

  /** Légende des niveaux, générée à partir de CONFIG. */
  function dessinerLegende() {
    let debut = 1;
    $("legende").innerHTML = CONFIG.niveaux.map(n => {
      const t = `<li style="--c:${n.couleur}">${n.nom} (${debut}${n.max > debut ? "–" + n.max : ""})</li>`;
      debut = n.max + 1;
      return t;
    }).join("");
  }

  /** Affiche le résultat de la dernière évaluation. */
  function afficherResultat(ev) {
    const r = $("resultat");
    r.className = "resultat niv-" + ev.niveau.id;
    r.hidden = false;
    r.innerHTML = `<p class="score">Score : ${ev.score} / 25</p>` +
      `<p><strong>Niveau : ${ev.niveau.nom}</strong> (P${ev.p} × G${ev.g})</p>` +
      `<p>${ev.niveau.action}</p>`;
  }

  /** Redessine le tableau des évaluations. */
  function dessinerTableau() {
    $("historique-corps").innerHTML = evaluations.map(ev =>
      `<tr><td>${ev.id}</td><td>${echapper(ev.activite)}</td><td>${echapper(ev.danger)}</td>` +
      `<td>${ev.p}</td><td>${ev.g}</td><td>${ev.score}</td>` +
      `<td><span class="pastille" style="background:${ev.niveau.couleur}">${ev.niveau.nom}</span></td>` +
      `<td><button type="button" data-id="${ev.id}" aria-label="Supprimer l'évaluation ${ev.id}">Supprimer</button></td></tr>`
    ).join("");
    $("vide").hidden = evaluations.length > 0;
    $("vider").hidden = evaluations.length === 0;
  }

  function afficherErreur(msg) {
    const e = $("erreur");
    e.textContent = msg;
    e.hidden = !msg;
  }

  /** Soumission du formulaire. */
  function soumettre(evt) {
    evt.preventDefault();
    const activite = $("activite").value.trim();
    const danger = $("danger").value.trim();
    const p = $("probabilite").value, g = $("gravite").value;

    if (!activite || !danger) return afficherErreur("Renseignez l'activité et le danger.");
    const score = calculerScore(p, g);
    if (score === null) return afficherErreur("Choisissez une probabilité et une gravité.");

    afficherErreur("");
    const ev = { id: ++compteur, activite, danger, p: Number(p), g: Number(g), score, niveau: trouverNiveau(score) };
    evaluations.push(ev);
    afficherResultat(ev);
    dessinerMatrice({ p: ev.p, g: ev.g });
    dessinerTableau();
  }

  /* Démarrage */
  remplirListes();
  dessinerMatrice(null);
  dessinerLegende();
  dessinerTableau();

  $("form-risque").addEventListener("submit", soumettre);
  $("form-risque").addEventListener("reset", () => { afficherErreur(""); $("resultat").hidden = true; dessinerMatrice(null); });
  $("historique-corps").addEventListener("click", e => {
    const id = e.target.dataset && e.target.dataset.id;
    if (!id) return;
    evaluations.splice(evaluations.findIndex(x => x.id === Number(id)), 1);
    dessinerTableau();
  });
  $("vider").addEventListener("click", () => { evaluations.length = 0; dessinerTableau(); });
}
