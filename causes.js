/* ==========================================================
   My-QHSE Tools – causes.js : « Analyse des causes »
   Aide à la méthode des 5 pourquoi et au diagramme d'Ishikawa (5M).
   Indépendant d'app.js. Données gardées en mémoire pendant la
   session seulement (rien n'est envoyé ni enregistré).
   Pour changer les familles ou les aides : modifiez le tableau M.
   ========================================================== */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  const zone = document.getElementById("causes-zone");
  if (!zone) return;

  const NB_POURQUOI = 5;
  const M = [
    { id: "main",     nom: "Main-d’œuvre", aide: "Formation, compétence, fatigue, effectif, consignes comprises…" },
    { id: "materiel", nom: "Matériel",     aide: "Machine, outil, EPI, maintenance, état de l’équipement…" },
    { id: "methode",  nom: "Méthode",      aide: "Procédure, mode opératoire, planification, consignes…" },
    { id: "milieu",   nom: "Milieu",       aide: "Bruit, éclairage, température, encombrement, espace de travail…" },
    { id: "matiere",  nom: "Matière",      aide: "Produit, matière première, composant, qualité des approvisionnements…" }
  ];

  const etat = { pourquoi: Array(NB_POURQUOI).fill(""), m: {} };
  M.forEach(x => { etat.m[x.id] = []; });
  const $ = id => document.getElementById(id);
  const abreger = t => (t.length > 60 ? t.slice(0, 57) + "…" : t);

  /* Structure fixe (aucune donnée saisie par l'utilisateur ici) */
  zone.innerHTML =
    '<div class="field"><label for="cz-probleme">Problème à analyser</label>' +
    '<input id="cz-probleme" type="text" maxlength="160" placeholder="Ex. : Un opérateur s’est blessé en manipulant un fût"></div>' +
    '<div class="cz-bloc"><h3>1. Méthode des 5 pourquoi</h3>' +
    '<p class="aide">Répondez à chaque « pourquoi ? » : la réponse devient le sujet de la question suivante. Arrêtez-vous dès que vous atteignez une cause sur laquelle vous pouvez agir.</p>' +
    '<ol id="cz-pourquoi" class="cz-pourquoi"></ol><div id="cz-racine" class="cz-racine" aria-live="polite" hidden></div></div>' +
    '<div class="cz-bloc"><h3>2. Diagramme d’Ishikawa (5M)</h3>' +
    '<p class="aide">Classez les causes possibles par famille. Les pistes proposées sont des aides, pas une liste complète.</p>' +
    '<div id="cz-m" class="m-grille"></div></div>' +
    '<div class="cz-bloc"><h3>3. Résumé</h3><div class="actions">' +
    '<button id="cz-gen" type="button" class="btn">Générer le résumé</button>' +
    '<button id="cz-clear" type="button" class="btn btn-sec">Tout effacer</button></div>' +
    '<textarea id="cz-resume" rows="12" readonly hidden aria-label="Résumé de l’analyse"></textarea>' +
    '<button id="cz-copy" type="button" class="btn btn-sec" hidden>Copier le résumé</button>' +
    '<p id="cz-msg" class="aide" aria-live="polite"></p></div>';

  /* ----- 5 pourquoi ----- */
  const ol = $("cz-pourquoi");
  for (let k = 0; k < NB_POURQUOI; k++) {
    const li = document.createElement("li");
    li.className = "field";
    li.innerHTML = `<label for="cz-p${k}"></label><input id="cz-p${k}" type="text" maxlength="200" placeholder="Parce que…">`;
    ol.appendChild(li);
  }

  function majPourquoi() {
    for (let k = 0; k < NB_POURQUOI; k++) {
      const prec = (etat.pourquoi[k - 1] || "").trim();
      $("cz-p" + k).previousElementSibling.textContent = k === 0
        ? "Pourquoi n° 1 : pourquoi ce problème est-il arrivé ?"
        : `Pourquoi n° ${k + 1} : pourquoi « ${prec ? abreger(prec) : "…"} » ?`;
    }
    const remplies = etat.pourquoi.map((t, k) => [t.trim(), k + 1]).filter(x => x[0]);
    const r = $("cz-racine");
    if (!remplies.length) { r.hidden = true; return; }
    const [texte, n] = remplies[remplies.length - 1];
    r.hidden = false;
    r.textContent = "";
    const s = document.createElement("strong");
    s.textContent = "Cause racine retenue : ";
    r.append(s, texte + " (pourquoi n° " + n + "). ",
      "Vérifiez : si cette cause disparaît, le problème peut-il encore se produire ? Si oui, poursuivez l’analyse.");
  }

  ol.addEventListener("input", e => {
    const k = Number(e.target.id.replace("cz-p", ""));
    etat.pourquoi[k] = e.target.value;
    majPourquoi();
  });

  /* ----- Ishikawa 5M ----- */
  $("cz-m").innerHTML = M.map(x =>
    `<div class="m-carte"><h4>${x.nom}</h4><p class="aide">${x.aide}</p><ul class="m-liste" id="cz-l-${x.id}"></ul>` +
    `<div class="m-ajout"><label class="sr" for="cz-in-${x.id}">Ajouter une cause : ${x.nom}</label>` +
    `<input id="cz-in-${x.id}" type="text" maxlength="120" placeholder="Ajouter une cause">` +
    `<button type="button" class="btn btn-sec" data-add="${x.id}">Ajouter</button></div></div>`).join("");

  function listeM(id) {
    const ul = $("cz-l-" + id);
    ul.textContent = "";
    etat.m[id].forEach((c, i) => {
      const li = document.createElement("li");
      const sp = document.createElement("span"); sp.textContent = c;
      const b = document.createElement("button");
      b.type = "button"; b.dataset.del = id; b.dataset.i = i; b.textContent = "Retirer";
      b.setAttribute("aria-label", "Retirer la cause : " + c);
      li.append(sp, b); ul.appendChild(li);
    });
  }

  function ajouter(id) {
    const inp = $("cz-in-" + id), t = inp.value.trim();
    if (!t) return;
    etat.m[id].push(t); inp.value = ""; listeM(id); inp.focus();
  }

  $("cz-m").addEventListener("click", e => {
    if (e.target.dataset.add) ajouter(e.target.dataset.add);
    if (e.target.dataset.del) { etat.m[e.target.dataset.del].splice(Number(e.target.dataset.i), 1); listeM(e.target.dataset.del); }
  });
  $("cz-m").addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.id.startsWith("cz-in-")) { e.preventDefault(); ajouter(e.target.id.slice(6)); }
  });

  /* ----- Résumé, copie, effacement ----- */
  function resume() {
    const L = ["ANALYSE DES CAUSES – My-QHSE Tools", "", "Problème : " + ($("cz-probleme").value.trim() || "(non renseigné)"), "", "5 POURQUOI"];
    const p = etat.pourquoi.map(t => t.trim());
    p.forEach((t, k) => { if (t) L.push((k + 1) + ". " + t); });
    const rac = p.map((t, k) => [t, k + 1]).filter(x => x[0]).pop();
    L.push(rac ? "Cause racine retenue : " + rac[0] : "(aucune réponse)", "", "ISHIKAWA (5M)");
    M.forEach(x => L.push(x.nom + " : " + (etat.m[x.id].join(" ; ") || "—")));
    return L.join("\n");
  }

  $("cz-gen").onclick = () => {
    $("cz-resume").value = resume();
    $("cz-resume").hidden = false; $("cz-copy").hidden = false; $("cz-msg").textContent = "";
  };
  $("cz-copy").onclick = async () => {
    const ta = $("cz-resume");
    try { await navigator.clipboard.writeText(ta.value); $("cz-msg").textContent = "Résumé copié."; }
    catch (e) { ta.select(); $("cz-msg").textContent = "Sélectionné : utilisez « Copier » de votre téléphone."; }
  };
  $("cz-clear").onclick = () => {
    if (!window.confirm("Effacer toute l’analyse ?")) return;
    $("cz-probleme").value = "";
    etat.pourquoi.fill("");
    for (let k = 0; k < NB_POURQUOI; k++) $("cz-p" + k).value = "";
    M.forEach(x => { etat.m[x.id] = []; listeM(x.id); });
    $("cz-resume").hidden = true; $("cz-copy").hidden = true; $("cz-msg").textContent = "";
    majPourquoi();
  };

  majPourquoi();
})();
