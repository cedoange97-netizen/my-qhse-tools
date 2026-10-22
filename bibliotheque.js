/* ==========================================================
   My-QHSE Tools – bibliotheque.js : rubrique « Bibliothèque de sujets »
   Indépendant du calculateur et du quiz. Les textes viennent de
   sujets.js (variable SUJETS) : pour ajouter un sujet, modifiez
   uniquement sujets.js.
   ========================================================== */
(function () {
  "use strict";
  if (typeof document === "undefined" || typeof SUJETS === "undefined") return;
  const $ = id => document.getElementById(id);
  const liste = $("sujets-liste"), lecture = $("sujets-lecture"), zoneListe = $("sujets-zone-liste");
  if (!liste || !lecture) return;

  /** Échappe le texte avant de l'insérer dans la page. */
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  /** Minuscules sans accents : « Évaluation » est trouvé en tapant « evaluation ». */
  const norm = t => String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  /** Affiche la liste, filtrée par le texte de recherche. */
  function afficherListe() {
    const mot = norm($("sujets-recherche").value.trim());
    const trouves = SUJETS.filter(s => norm(s.titre).includes(mot) || String(s.id) === mot);
    liste.innerHTML = trouves.map(s =>
      `<li><button type="button" class="sujet-item" data-id="${s.id}">` +
      `<span class="sujet-num" aria-hidden="true">${s.id}</span><span>${esc(s.titre)}</span></button></li>`).join("");
    $("sujets-vide").hidden = trouves.length > 0;
    $("sujets-compte").textContent = trouves.length + " sujet" + (trouves.length > 1 ? "s" : "") +
      (mot ? " trouvé" + (trouves.length > 1 ? "s" : "") : " disponibles");
  }

  /** Affiche un sujet en entier : introduction, développement, conclusion. */
  function lire(id) {
    const i = SUJETS.findIndex(s => s.id === id);
    if (i < 0) return;
    const s = SUJETS[i];
    lecture.innerHTML =
      '<button type="button" class="btn btn-sec" id="sujet-retour">← Retour à la liste</button>' +
      `<article class="sujet"><p class="aide">Sujet ${s.id} sur ${SUJETS.length}</p>` +
      `<h3 id="sujet-titre" tabindex="-1">${esc(s.titre)}</h3>` +
      `<h4>Introduction</h4><p>${esc(s.introduction)}</p>` +
      `<h4>Développement</h4>${s.developpement.map(p => `<p>${esc(p)}</p>`).join("")}` +
      `<h4>Conclusion</h4><p class="sujet-concl">${esc(s.conclusion)}</p></article>` +
      '<div class="actions">' +
      `<button type="button" class="btn btn-sec" id="sujet-prec"${i === 0 ? " disabled" : ""}>← Précédent</button>` +
      `<button type="button" class="btn btn-sec" id="sujet-suiv"${i === SUJETS.length - 1 ? " disabled" : ""}>Suivant →</button></div>`;
    zoneListe.hidden = true; lecture.hidden = false;
    $("sujet-retour").onclick = retour;
    $("sujet-prec").onclick = () => lire(SUJETS[i - 1].id);
    $("sujet-suiv").onclick = () => lire(SUJETS[i + 1].id);
    $("bibliotheque").scrollIntoView();
    $("sujet-titre").focus();
  }

  function retour() {
    lecture.hidden = true; zoneListe.hidden = false;
    $("bibliotheque").scrollIntoView();
  }

  $("sujets-recherche").addEventListener("input", afficherListe);
  liste.addEventListener("click", e => {
    const b = e.target.closest(".sujet-item");
    if (b) lire(Number(b.dataset.id));
  });
  afficherListe();
})();
