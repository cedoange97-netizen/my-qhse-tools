/* ==========================================================
   My-QHSE Tools – quiz-cartes.js : choix du quiz par CARTES
   Ajoute au quiz une présentation en cartes (une carte par thème, avec
   icône), une recherche et des filtres par famille.

   - Ne modifie PAS quiz.js : il lit les familles et thèmes déjà prêts
     dans l'écran d'accueil du quiz, puis masque les deux listes déroulantes.
   - Si ce fichier ne se charge pas, les listes d'origine restent visibles
     et le quiz fonctionne comme avant.
   - Un nouveau thème ajouté dans quiz.js ou dans une banque de questions
     apparaît automatiquement sous forme de carte.
   - Installation : une seule ligne dans index.html, APRÈS quiz.js :
       <script src="quiz-cartes.js"></script>
   ========================================================== */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  const zone = document.getElementById("quiz-zone");
  if (!zone) return;

  /* ----- Icônes : tracé fin (1,5), une par famille. Pour changer une icône,
         remplacez son dessin SVG. Une famille inconnue reçoit l'icône « base ». ----- */
  const ICONES = {
    mixte: '<path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="m4 4 5 5"/>',
    base: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    mgmt: '<path d="m12 2-10 5 10 5 10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    qual: '<circle cx="12" cy="8" r="6"/><path d="M8.2 13.9 7 23l5-3 5 3-1.2-9.1"/><path d="m9.5 8 1.8 1.8L14.7 6.4"/>',
    sst: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    hyg: '<path d="M12 2.7 17.7 8.4a8 8 0 1 1-11.4 0z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
    env: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"/>',
    trans: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
    casque: '<path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><path d="M14 6a6 6 0 0 1 6 6v3"/>',
    alerte: '<path d="m21.7 18-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    loupe: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/><path d="M11 8v6"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M8 9h2"/>',
    retour: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'
  };
  /* Icône et couleur propres à certains thèmes : identifiant du thème -> [icône, couleur].
     Un thème absent de cette liste reprend l'icône et la couleur de sa famille. */
  const PAR_THEME = {
    securite: ["casque", "sst"], risques: ["alerte", "mgmt"], iso9001: ["qual", "qual"],
    iso14001: ["env", "env"], iso45001: ["sst", "sst"], hygiene: ["hyg", "hyg"],
    methodes: ["loupe", "mgmt"], management: ["mgmt", "base"], reglementation: ["doc", "trans"], t46: ["retour", "trans"]
  };
  const icone = k => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONES[k] || ICONES.base) + "</svg>";

  const norm = t => String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pluriel = n => n + " question" + (n > 1 ? "s" : "");

  /* ----- Styles (couleurs de la marque : verts et turquoise, orange non utilisé) ----- */
  const st = document.createElement("style");
  st.textContent = `
.qc-cache { display: none !important; }
.qc-chips { display: flex; gap: 8px; overflow-x: auto; padding: 2px 2px 8px; margin: 2px 0 6px; position: relative; scrollbar-width: none; }
.qc-chips::-webkit-scrollbar { display: none; }
.qc-chip { flex: none; padding: 8px 14px; border-radius: 999px; border: 1px solid var(--bordure, #d5e3db); background: var(--surface, #fff); color: var(--texte, #1b2b24); font: inherit; font-size: .88rem; cursor: pointer; }
.qc-chip[aria-pressed="true"] { background: var(--vert, #198754); border-color: var(--vert, #198754); color: #fff; font-weight: 600; }
.qc-cartes { display: grid; grid-template-columns: repeat(auto-fill, minmax(126px, 1fr)); gap: 10px; margin-top: 4px; }
.qc-carte {
  --c: #0f7a4f; --t: #e4f4ec;
  display: flex; flex-direction: column; align-items: flex-start; gap: 8px; text-align: left;
  min-height: 124px; padding: 11px; font: inherit; color: var(--texte, #1b2b24); cursor: pointer;
  background: var(--surface, #fff); border: 1px solid var(--bordure, #d5e3db); border-radius: 16px;
  box-shadow: 0 1px 2px rgba(16, 60, 40, .06), 0 4px 12px rgba(16, 60, 40, .04);
  transition: transform .12s ease, border-color .12s ease, box-shadow .12s ease;
}
.qc-carte:hover { border-color: var(--c); box-shadow: 0 2px 4px rgba(16, 60, 40, .08), 0 8px 18px rgba(16, 60, 40, .08); }
.qc-carte:active { transform: scale(.98); }
.qc-carte:focus-visible, .qc-chip:focus-visible { outline: 3px solid #0b7f86; outline-offset: 2px; }
.qc-ico { display: flex; align-items: center; justify-content: center; flex: none; width: 42px; height: 42px; border-radius: 13px; color: var(--c); background: var(--t); border: 1px solid rgba(15, 80, 60, .14); }
.qc-ico svg { width: 24px; height: 24px; }
.qc-titre { font-weight: 700; font-size: .84rem; line-height: 1.25; overflow-wrap: break-word; hyphens: auto; }
.qc-meta { margin-top: auto; font-size: .74rem; line-height: 1.3; color: var(--gris, #5b6b63); }
.qc-fam-base { --c: #0f7a4f; --t: #e4f4ec; }
.qc-fam-mgmt { --c: #0b7f86; --t: #dff3f4; }
.qc-fam-qual { --c: #1f6f8b; --t: #e2f0f6; }
.qc-fam-sst { --c: #0f5132; --t: #e3efe8; }
.qc-fam-hyg { --c: #0e8f7a; --t: #ddf5ef; }
.qc-fam-env { --c: #3f7d20; --t: #e9f4df; }
.qc-fam-trans { --c: #3d5a66; --t: #e6eef1; }
.qc-mixte { grid-column: 1 / -1; flex-direction: row; align-items: center; min-height: 0; gap: 14px; color: #fff; border: 0;
  background: linear-gradient(135deg, #0f5132 0%, #0b7f86 100%); }
.qc-mixte:hover { box-shadow: 0 4px 16px rgba(11, 127, 134, .35); }
.qc-mixte .qc-ico { background: rgba(255, 255, 255, .16); border-color: rgba(255, 255, 255, .35); color: #fff; }
.qc-mixte .qc-meta { color: rgba(255, 255, 255, .85); margin-top: 2px; font-size: .82rem; }
.qc-mixte .qc-titre { font-size: 1rem; }
.qc-mixte .qc-corps { display: flex; flex-direction: column; }
@media (prefers-reduced-motion: reduce) { .qc-carte { transition: none; } }
/* Mode sombre : cartes, pastilles et icônes suivent le thème */
html[data-theme="sombre"] .qc-carte:not(.qc-mixte) { box-shadow: none; }
html[data-theme="sombre"] .qc-carte:not(.qc-mixte) .qc-ico { background: rgba(255, 255, 255, .08); border-color: rgba(255, 255, 255, .16); color: #7fe0c4; }
html[data-theme="sombre"] .qc-carte:not(.qc-mixte):hover { border-color: #7fe0c4; }
html[data-theme="sombre"] .qc-chip[aria-pressed="false"] { background: var(--surface, #1b2421); color: var(--texte, #e8efec); }
`;
  document.head.appendChild(st);

  let famActive = "tous", recherche = "";

  /** Lit les familles, thèmes et nombres de questions dans l'écran d'accueil d'origine. */
  function lireCatalogue(selF, selT) {
    const memF = selF.value, memT = selT.value, cat = [], mixte = {};
    Array.prototype.forEach.call(selF.options, function (of) {
      selF.value = of.value; selF.dispatchEvent(new Event("change"));
      const themes = [];
      Array.prototype.forEach.call(selT.options, function (ot) {
        const m = ot.textContent.match(/^(.*) \((\d+) questions?[^)]*\)\s*$/);
        if (ot.value === "tous") { mixte[of.value] = m ? Number(m[2]) : 0; return; }
        themes.push({ id: ot.value, nom: m ? m[1] : ot.textContent, n: m ? Number(m[2]) : 0 });
      });
      if (of.value !== "tous") cat.push({ id: of.value, nom: of.textContent, themes: themes });
    });
    selF.value = memF; selF.dispatchEvent(new Event("change")); selT.value = memT;
    return { cat: cat, mixte: mixte };
  }

  function construire() {
    if (zone.querySelector(".qc-wrap")) return;
    const selF = document.getElementById("quiz-fam"), selT = document.getElementById("quiz-theme"), go = document.getElementById("quiz-go");
    if (!selF || !selT || !go) return;
    const donnees = lireCatalogue(selF, selT), cat = donnees.cat;
    if (!cat.length) return;
    if (famActive !== "tous" && !cat.some(f => f.id === famActive)) famActive = "tous";

    [selF, selT].forEach(s => { const f = s.closest(".field"); if (f) f.classList.add("qc-cache"); });
    go.classList.add("qc-cache");

    const wrap = document.createElement("div");
    wrap.className = "qc-wrap";
    wrap.innerHTML =
      '<div class="field"><label for="qc-recherche">Rechercher un thème</label>' +
      '<input id="qc-recherche" type="search" placeholder="Ex. : ISO 9001, déchets, audit…" autocomplete="off"></div>' +
      '<div class="qc-chips" role="group" aria-label="Filtrer par famille">' +
      [{ id: "tous", nom: "Toutes" }].concat(cat).map(f =>
        `<button type="button" class="qc-chip" data-fam="${esc(f.id)}" aria-pressed="false">${esc(f.nom)}</button>`).join("") + "</div>" +
      '<p id="qc-compte" class="aide" aria-live="polite"></p><div id="qc-cartes" class="qc-cartes"></div>' +
      '<p id="qc-vide" class="aide" hidden>Aucun thème ne correspond à votre recherche.</p>';
    zone.insertBefore(wrap, zone.firstChild);

    const $ = id => wrap.querySelector("#" + id);
    $("qc-recherche").value = recherche;

    function lancer(f, t) {
      selF.value = f; selF.dispatchEvent(new Event("change"));
      selT.value = t;
      go.click();
    }

    function dessiner() {
      const mot = norm(recherche.trim());
      Array.prototype.forEach.call(wrap.querySelectorAll(".qc-chip"), c => c.setAttribute("aria-pressed", String(c.dataset.fam === famActive)));
      const cartes = [];
      cat.forEach(f => {
        if (famActive !== "tous" && f.id !== famActive) return;
        f.themes.forEach(t => { if (!mot || norm(t.nom + " " + f.nom).includes(mot)) cartes.push({ f: f, t: t }); });
      });
      let h = "";
      if (!mot) {
        const nomF = famActive === "tous" ? "tous les thèmes" : (cat.find(f => f.id === famActive) || {}).nom;
        h += `<button type="button" class="qc-carte qc-mixte" data-f="${esc(famActive)}" data-t="tous" aria-label="Quiz mixte, ${esc(nomF)}, ${pluriel(donnees.mixte[famActive] || 0)} au hasard">` +
          `<span class="qc-ico">${icone("mixte")}</span><span class="qc-corps"><span class="qc-titre">Quiz mixte</span>` +
          `<span class="qc-meta">${esc(nomF)} · ${pluriel(donnees.mixte[famActive] || 0)} au hasard</span></span></button>`;
      }
      h += cartes.map(x => {
        const st = PAR_THEME[x.t.id] || [x.f.id, x.f.id];
        return `<button type="button" class="qc-carte qc-fam-${esc(st[1])}" data-f="${esc(x.f.id)}" data-t="${esc(x.t.id)}" aria-label="${esc(x.t.nom)}, ${pluriel(x.t.n)}">` +
        `<span class="qc-ico">${icone(st[0])}</span><span class="qc-titre">${esc(x.t.nom)}</span>` +
        `<span class="qc-meta">${pluriel(x.t.n)} · ${esc(x.f.nom)}</span></button>`;
      }).join("");
      $("qc-cartes").innerHTML = h;
      $("qc-vide").hidden = cartes.length > 0;
      $("qc-compte").textContent = cartes.length + " thème" + (cartes.length > 1 ? "s" : "") + (mot ? " trouvé" + (cartes.length > 1 ? "s" : "") : "") + ". Touchez une carte pour lancer le quiz.";
    }

    $("qc-recherche").addEventListener("input", e => { recherche = e.target.value; dessiner(); });
    wrap.querySelector(".qc-chips").addEventListener("click", e => {
      const c = e.target.closest(".qc-chip");
      if (c) { famActive = c.dataset.fam; dessiner(); }
    });
    $("qc-cartes").addEventListener("click", e => {
      const b = e.target.closest(".qc-carte");
      if (b) lancer(b.dataset.f, b.dataset.t);
    });
    dessiner();
  }

  /* quiz.js remplace tout le contenu de la zone à chaque retour à l'accueil : on reconstruit alors les cartes. */
  new MutationObserver(construire).observe(zone, { childList: true });
  construire();
})();
