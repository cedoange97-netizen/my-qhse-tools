/* ==========================================================
   My-QHSE Tools – checklists.js : module « Checklists et exercices QHSE »
   - Les données (10 thèmes) sont dans checklists-data-1/2/3.js.
   - Partie 1 (CONFIG + calculs) : sans lien avec la page, testable avec Node.
   - Partie 2 (interface) : navigateur uniquement.
   Stockage : localStorage (brouillon + historique), envoi anonyme facultatif vers le Worker.
   N'utilise aucune clé des autres modules (historique des risques, quiz, terrain).
   ========================================================== */

/* ---------- 1) CONFIGURATION ---------- */
const CK_CONFIG = {
  pointsParCritere: 2,        // Oui = 2 points, Non = 0, N/A = exclu du total
  seuilPedagogique: null,     // ex. 70 : affiche un objectif PÉDAGOGIQUE (pas réglementaire). null = aucun seuil
  maxHistorique: 100,
  api: "https://my-qhse-api-ci.myqhse2.workers.dev/api/checklist-results",
  secteurs: ["BTP", "Mines", "Industrie", "Autre secteur"]
};

/* ---------- 2) LOGIQUE (sans page) ---------- */

/** Liste à plat des critères d'un thème, avec l'index de leur catégorie. */
function ckAplatir(theme) {
  const liste = [];
  theme.categories.forEach((cat, ci) => cat.criteres.forEach(c => liste.push({ cat: ci, catNom: cat.nom, q: c.q, s: c.s, r: c.r, e: c.e, a: c.a })));
  return liste;
}

/**
 * Calcule le bilan à partir des réponses de l'utilisateur ("oui" | "non" | "na" | null).
 * - Bilan d'audit : calculé sur les réponses données (Oui = 2 pts, Non = 0, N/A exclu du total).
 * - Exactitude pédagogique : comparaison avec la bonne qualification de la situation.
 */
function ckCalculer(theme, reponses) {
  const crit = ckAplatir(theme);
  const b = { total: crit.length, repondus: 0, conformes: 0, nonConformes: 0, na: 0, evalues: 0,
    score: 0, scoreMax: 0, pourcentage: null, exacts: 0, pourcentageExact: 0, erreurs: [], manques: [], categories: [] };
  const cats = theme.categories.map(c => ({ nom: c.nom, total: c.criteres.length, conformes: 0, nonConformes: 0, na: 0, evalues: 0, pourcentage: null }));
  crit.forEach((c, i) => {
    const r = reponses[i];
    if (r !== "oui" && r !== "non" && r !== "na") return;
    b.repondus++;
    const k = cats[c.cat];
    if (r === "oui") { b.conformes++; k.conformes++; }
    else if (r === "non") { b.nonConformes++; k.nonConformes++; }
    else { b.na++; k.na++; }
    if (r === c.r) b.exacts++;
    else {
      b.erreurs.push(i);
      if (c.r === "non") b.manques.push(i);   // écart réel non détecté
    }
  });
  b.evalues = b.conformes + b.nonConformes;
  b.score = b.conformes * CK_CONFIG.pointsParCritere;
  b.scoreMax = b.evalues * CK_CONFIG.pointsParCritere;
  b.pourcentage = b.scoreMax > 0 ? Math.round(100 * b.score / b.scoreMax) : null;
  b.pourcentageExact = b.total > 0 ? Math.round(100 * b.exacts / b.total) : 0;
  cats.forEach(k => {
    k.evalues = k.conformes + k.nonConformes;
    k.pourcentage = k.evalues > 0 ? Math.round(100 * k.conformes / k.evalues) : null;
  });
  b.categories = cats;
  return b;
}

/** Encode les réponses en chaîne courte (o / n / a / -) pour le stockage. */
function ckEncoder(reponses, n) {
  let s = "";
  for (let i = 0; i < n; i++) s += reponses[i] === "oui" ? "o" : reponses[i] === "non" ? "n" : reponses[i] === "na" ? "a" : "-";
  return s;
}
function ckDecoder(chaine, n) {
  const r = [];
  for (let i = 0; i < n; i++) { const c = (chaine || "")[i]; r.push(c === "o" ? "oui" : c === "n" ? "non" : c === "a" ? "na" : null); }
  return r;
}

if (typeof module !== "undefined") {
  module.exports = { CK_CONFIG, ckAplatir, ckCalculer, ckEncoder, ckDecoder };
}

/* ---------- 3) INTERFACE (navigateur uniquement) ---------- */
if (typeof document !== "undefined") (function () {
  "use strict";
  const zone = document.getElementById("checklists-zone");
  if (!zone) return;
  const THEMES = (window.QHSE_CHECKLISTS || []).slice().sort((a, b) => a.num - b.num);

  const CLE_BROUILLON = "myqhse_checklists_encours_v1";
  const CLE_HISTO = "myqhse_checklists_historique_v1";
  const CLE_ENVOI = "myqhse_checklists_envoi_actif";
  const CLE_FILE = "myqhse_checklists_file_envoi";
  const CLE_PID = "qhse_participant_id";   // même identifiant anonyme que les autres modules

  const LIBELLE = { oui: "Oui", non: "Non", na: "N/A" };
  const SENS = { oui: "Exigence respectée", non: "Exigence non respectée", na: "Non applicable" };

  let vue = "accueil";
  let st = null;          // session en cours : { themeId, i, reponses, secteur, immediat, debut }
  let dernier = null;     // dernier résultat affiché : { theme, reponses, entree }
  let stockageOk = true;

  /* ----- utilitaires ----- */
  const e = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const themeDe = id => THEMES.find(t => t.id === id);
  const nbCrit = t => ckAplatir(t).length;
  const rnd = () => { try { if (crypto.randomUUID) return crypto.randomUUID().replace(/[^A-Za-z0-9]/g, "").slice(0, 24); } catch (x) { /* repli */ } return (Date.now().toString(36) + Math.random().toString(36).slice(2)).slice(0, 24); };

  function lire(cle, defaut) { try { const v = localStorage.getItem(cle); return v === null ? defaut : JSON.parse(v); } catch (x) { return defaut; } }
  function ecrire(cle, val) { try { localStorage.setItem(cle, JSON.stringify(val)); return true; } catch (x) { stockageOk = false; return false; } }
  function retirer(cle) { try { localStorage.removeItem(cle); } catch (x) { /* rien */ } }

  const histo = () => { const h = lire(CLE_HISTO, []); return Array.isArray(h) ? h : []; };
  const brouillon = () => {
    const b = lire(CLE_BROUILLON, null), t = b && themeDe(b.themeId);
    if (!t || typeof b.rep !== "string") return null;
    return { themeId: b.themeId, i: Math.min(Math.max(parseInt(b.i, 10) || 0, 0), nbCrit(t) - 1), reponses: ckDecoder(b.rep, nbCrit(t)),
      secteur: CK_CONFIG.secteurs.indexOf(b.secteur) > -1 ? b.secteur : null, immediat: !!b.immediat, debut: b.debut || Date.now() };
  };
  function sauverBrouillon() {
    if (!st) return;
    ecrire(CLE_BROUILLON, { themeId: st.themeId, i: st.i, rep: ckEncoder(st.reponses, st.reponses.length), secteur: st.secteur, immediat: st.immediat, debut: st.debut });
  }

  /* ----- envoi anonyme (facultatif) ----- */
  const envoiActif = () => lire(CLE_ENVOI, true) !== false;
  function pid() { try { let v = localStorage.getItem(CLE_PID); if (!v) { v = rnd(); localStorage.setItem(CLE_PID, v); } return v; } catch (x) { return undefined; } }
  const file = () => { const f = lire(CLE_FILE, []); return Array.isArray(f) ? f : []; };
  function poster(p) {
    const ctrl = window.AbortController ? new AbortController() : null;
    const t = ctrl ? setTimeout(() => ctrl.abort(), 10000) : null;
    return fetch(CK_CONFIG.api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p), keepalive: true, signal: ctrl ? ctrl.signal : undefined })
      .then(r => { if (t) clearTimeout(t); if (r.ok) return "ok"; return (r.status >= 400 && r.status < 500 && r.status !== 429 && r.status !== 408) ? "drop" : "retry"; })
      .catch(() => { if (t) clearTimeout(t); return "retry"; });
  }
  let envoiEnCours = false;
  function vider() {
    if (envoiEnCours || !envoiActif()) return;
    const q = file(); if (!q.length) return;
    envoiEnCours = true;
    (function suite(i) {
      if (i >= q.length) { ecrire(CLE_FILE, []); envoiEnCours = false; majEtatEnvoi(); return; }
      poster(q[i]).then(res => { if (res === "retry") { ecrire(CLE_FILE, q.slice(i)); envoiEnCours = false; majEtatEnvoi(); } else suite(i + 1); });
    })(0);
  }
  function planifierEnvoi(charge) {
    if (!envoiActif()) return;
    ecrire(CLE_FILE, file().concat([charge]).slice(-30));
    majEtatEnvoi();
    vider();
  }
  function majEtatEnvoi() {
    const el = document.getElementById("ck-envoi-etat"); if (!el) return;
    const n = file().length;
    el.textContent = !envoiActif() ? "Envoi anonyme désactivé : vos résultats restent sur cet appareil." : n ? n + " résultat(s) en attente d'envoi (connexion requise)." : "Résultats envoyés de façon anonyme.";
  }
  window.addEventListener("online", vider);
  window.addEventListener("load", vider);
  if (document.readyState === "complete") vider();

  /* ----- navigation ----- */
  function aller(v) {
    vue = v; rendre();
    const h = zone.querySelector("[data-focus]"); if (h) { h.setAttribute("tabindex", "-1"); try { h.focus({ preventScroll: true }); } catch (x) { /* rien */ } }
    const sec = document.getElementById("checklists"); if (sec && sec.scrollIntoView) { try { sec.scrollIntoView({ block: "start" }); } catch (x) { window.scrollTo(0, 0); } }
  }

  /* ----- fragments HTML ----- */
  const barre = (pct, classe) => `<div class="ck-barre ${classe || ""}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div>`;
  const retour = (act, txt) => `<button type="button" class="ck-lien" data-act="${act}">← ${e(txt)}</button>`;

  function vueAccueil() {
    const b = brouillon(), h = histo();
    let o = `<p class="aide" data-focus>Dix thèmes pour vous entraîner à auditer. Pour chaque critère, une situation observée sur le terrain est décrite : choisissez <strong>Oui</strong>, <strong>Non</strong> ou <strong>N/A</strong>, puis découvrez la correction. Exercice pédagogique : aucune donnée à saisir.</p>`;
    if (b) {
      const t = themeDe(b.themeId), fait = b.reponses.filter(Boolean).length;
      o += `<div class="ck-reprise"><strong>Exercice en cours</strong><span>${e(t.titre)} · ${fait} / ${nbCrit(t)} critères répondus</span>
        <div class="actions"><button type="button" class="btn" data-act="reprendre">Reprendre</button><button type="button" class="btn btn-sec" data-act="abandonner">Abandonner</button></div></div>`;
    }
    o += `<ul class="ck-themes">` + THEMES.map(t => `<li><button type="button" class="ck-theme" data-act="theme" data-id="${e(t.id)}">
        <span class="ck-num">${t.num}</span><span class="ck-theme-txt"><strong>${e(t.titre)}</strong><small>${nbCrit(t)} critères · ${t.categories.length} catégories</small></span><span class="ck-fleche" aria-hidden="true">›</span></button></li>`).join("") + `</ul>`;
    o += `<div class="actions"><button type="button" class="btn btn-sec" data-act="historique">Historique (${h.length})</button></div>`;
    o += `<label class="ck-envoi"><input type="checkbox" id="ck-envoi" ${envoiActif() ? "checked" : ""}> <span>Envoyer mes résultats de façon anonyme (statistiques de l'application)</span></label><p class="aide" id="ck-envoi-etat" aria-live="polite"></p>`;
    if (!stockageOk) o += `<p class="erreur" role="alert">Stockage indisponible : l'historique ne pourra pas être conservé sur cet appareil.</p>`;
    return o;
  }

  function vueFiche() {
    const t = themeDe(st.themeId);
    return `${retour("accueil", "Tous les thèmes")}
      <h3 class="ck-titre" data-focus>${t.num}. ${e(t.titre)}</h3>
      <p>${e(t.presentation)}</p>
      <h4>Objectif</h4><p>${e(t.objectif)}</p>
      <h4>Situation professionnelle</h4><p>${e(t.contexte)}</p>
      <h4>À savoir avant de commencer</h4><ul class="ck-liste">${t.infos.map(i => `<li>${e(i)}</li>`).join("")}</ul>
      <h4>Catégories de la checklist (${nbCrit(t)} critères)</h4><ul class="ck-liste">${t.categories.map(c => `<li>${e(c.nom)} <span class="ck-petit">(${c.criteres.length})</span></li>`).join("")}</ul>
      <h4 id="ck-l-secteur">Secteur d'activité <span class="ck-petit">(facultatif)</span></h4>
      <div class="ck-choix" role="group" aria-labelledby="ck-l-secteur">${CK_CONFIG.secteurs.map(s => `<button type="button" class="ck-chip" data-act="secteur" data-v="${e(s)}" aria-pressed="${st.secteur === s}">${e(s)}</button>`).join("")}</div>
      <h4 id="ck-l-mode">Mode</h4>
      <div class="ck-choix" role="group" aria-labelledby="ck-l-mode">
        <button type="button" class="ck-chip" data-act="mode" data-v="fin" aria-pressed="${!st.immediat}">Audit : correction à la fin</button>
        <button type="button" class="ck-chip" data-act="mode" data-v="direct" aria-pressed="${st.immediat}">Entraînement : correction après chaque réponse</button>
      </div>
      <div class="actions"><button type="button" class="btn" data-act="demarrer">Commencer la checklist</button></div>`;
  }

  function vueQuestion() {
    const t = themeDe(st.themeId), crit = ckAplatir(t), n = crit.length, c = crit[st.i], rep = st.reponses[st.i];
    const faits = st.reponses.filter(Boolean).length, pct = Math.round(100 * faits / n);
    let o = `<div class="ck-haut"><span class="ck-petit">${e(t.titre)}</span><span class="ck-petit" aria-live="polite">${faits} / ${n} répondus</span></div>${barre(pct)}
      <p class="ck-cat">${e(c.catNom)} · Critère ${st.i + 1} / ${n}</p>
      <h3 class="ck-q" data-focus>${e(c.q)}</h3>
      <div class="ck-situation"><strong>Situation observée</strong><p>${e(c.s)}</p></div>
      <div class="ck-reps" role="group" aria-label="Votre réponse">` +
      ["oui", "non", "na"].map(k => `<button type="button" class="ck-rep ck-${k}" data-act="repondre" data-v="${k}" aria-pressed="${rep === k}" ${st.immediat && rep ? "disabled" : ""}><strong>${LIBELLE[k]}</strong><small>${SENS[k]}</small></button>`).join("") + `</div>`;
    if (st.immediat && rep) {
      const ok = rep === c.r;
      o += `<div class="ck-correction ${ok ? "juste" : "faux"}" role="status"><strong>${ok ? "Bonne réponse" : "Réponse à revoir"} : ${LIBELLE[c.r]}</strong><p>${e(c.e)}</p>${c.r === "non" && c.a ? `<p><em>Action corrective :</em> ${e(c.a)}</p>` : ""}</div>`;
    }
    o += `<div class="ck-nav"><button type="button" class="btn btn-sec" data-act="prec" ${st.i === 0 ? "disabled" : ""}>Précédent</button>
      <button type="button" class="btn" data-act="suiv">${st.i === n - 1 ? "Récapitulatif" : "Suivant"}</button></div>
      <div class="ck-nav2"><button type="button" class="ck-lien" data-act="recap">Récapitulatif des réponses</button><button type="button" class="ck-lien" data-act="quitter">Quitter (progression conservée)</button></div>`;
    return o;
  }

  function vueRecap() {
    const t = themeDe(st.themeId), crit = ckAplatir(t), n = crit.length, faits = st.reponses.filter(Boolean).length;
    let o = `${retour("question", "Retour aux questions")}<h3 class="ck-titre" data-focus>Récapitulatif</h3>
      <p class="aide">${faits} / ${n} critères répondus. Touchez un critère pour le modifier.</p>${barre(Math.round(100 * faits / n))}`;
    t.categories.forEach((cat, ci) => {
      o += `<h4>${e(cat.nom)}</h4><ul class="ck-recap">`;
      crit.forEach((c, i) => { if (c.cat !== ci) return; const r = st.reponses[i];
        o += `<li><button type="button" data-act="aller" data-i="${i}"><span class="ck-recap-q">${i + 1}. ${e(c.q)}</span><span class="ck-pastille ${r ? "ck-p-" + r : "ck-p-vide"}">${r ? LIBELLE[r] : "À répondre"}</span></button></li>`; });
      o += `</ul>`;
    });
    o += faits < n ? `<p class="notice" role="note">Répondez à tous les critères (N/A compris) pour valider : ${n - faits} restant(s).</p>` : "";
    o += `<div class="actions"><button type="button" class="btn" data-act="valider" ${faits < n ? "disabled" : ""}>Valider et voir les résultats</button></div>`;
    return o;
  }

  function vueResultats() {
    const { theme: t, reponses, entree } = dernier, crit = ckAplatir(t), b = ckCalculer(t, reponses);
    const pc = b.pourcentage;
    let o = `${retour("accueil", "Tous les thèmes")}<h3 class="ck-titre" data-focus>Résultats : ${e(t.titre)}</h3>
      <p class="aide">${entree ? new Date(entree.date).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }) : ""}${entree && entree.secteur ? " · " + e(entree.secteur) : ""}${entree ? " · " + (entree.immediat ? "Entraînement" : "Audit") : ""}</p>
      <section class="ck-bloc"><h4>Votre bilan d'audit</h4>
        <p class="ck-grand">${pc === null ? "—" : pc + " %"} <span class="ck-petit">de conformité</span></p>${barre(pc === null ? 0 : pc)}
        <p>Score : <strong>${b.score}</strong> / <strong>${b.scoreMax}</strong> points applicables</p>
        <ul class="ck-chiffres">
          <li><strong>${b.evalues}</strong><span>critères évalués</span></li>
          <li><strong>${b.conformes}</strong><span>conformes</span></li>
          <li><strong>${b.nonConformes}</strong><span>non conformes</span></li>
          <li><strong>${b.na}</strong><span>N/A (exclus)</span></li></ul>
        <p class="aide">Oui = ${CK_CONFIG.pointsParCritere} points, Non = 0, N/A = exclu du total : les critères N/A ne pénalisent pas le résultat.${pc === null ? " Tous les critères sont N/A : aucun pourcentage n'est calculable." : ""}</p>
        ${CK_CONFIG.seuilPedagogique !== null && pc !== null ? `<p class="notice" role="note">Objectif pédagogique fixé à ${CK_CONFIG.seuilPedagogique} % (règle de cet exercice, pas un seuil réglementaire) : ${pc >= CK_CONFIG.seuilPedagogique ? "atteint" : "non atteint"}.</p>` : ""}
      </section>
      <section class="ck-bloc"><h4>Exactitude de vos réponses</h4>
        <p class="ck-grand">${b.exacts} / ${b.total} <span class="ck-petit">situations correctement qualifiées (${b.pourcentageExact} %)</span></p>${barre(b.pourcentageExact, "ck-barre-exact")}
        <p class="aide">Comparaison avec la bonne qualification de chaque situation décrite. Dans un audit réel, la réponse dépend de ce que vous observez sur le terrain.</p></section>`;
    const ecarts = b.categories.map((k, i) => ({ k, i })).filter(x => x.k.nonConformes > 0).sort((x, y) => y.k.nonConformes - x.k.nonConformes);
    o += `<section class="ck-bloc"><h4>Catégories présentant des écarts</h4>` + (ecarts.length ? `<ul class="ck-ecarts">` + ecarts.map(x => `<li><span>${e(x.k.nom)}</span><strong>${x.k.nonConformes} non conforme(s) sur ${x.k.evalues} évalué(s)</strong>${barre(Math.round(100 * x.k.nonConformes / x.k.evalues), "ck-barre-ecart")}</li>`).join("") + `</ul>` : `<p>Aucun critère n'a été déclaré non conforme.</p>`) + `</section>`;

    const ecartsReponses = []; crit.forEach((c, i) => { if (reponses[i] === "non" && c.r === "non") ecartsReponses.push(i); });
    o += `<section class="ck-bloc"><h4>Actions correctives proposées</h4>`;
    if (ecartsReponses.length) o += `<p class="aide">Écarts correctement identifiés :</p><ol class="ck-actions">${ecartsReponses.map(i => `<li><strong>${e(crit[i].q)}</strong><br>${e(crit[i].a)}</li>`).join("")}</ol>`;
    if (b.manques.length) o += `<p class="aide"><strong>Écarts réels non détectés</strong> (situations non conformes que vous avez qualifiées autrement) :</p><ol class="ck-actions ck-manques">${b.manques.map(i => `<li><strong>${e(crit[i].q)}</strong><br>${e(crit[i].a)}</li>`).join("")}</ol>`;
    if (!ecartsReponses.length && !b.manques.length) o += `<p>Aucune action corrective à proposer.</p>`;
    o += `</section>`;

    const faux = b.erreurs;
    o += `<section class="ck-bloc"><h4>Observations</h4><ul class="ck-liste">`;
    o += `<li>${b.nonConformes} écart(s) déclaré(s) sur ${b.evalues} critère(s) évalué(s).</li>`;
    if (ecarts.length) o += `<li>Catégorie la plus touchée : ${e(ecarts[0].k.nom)} (${ecarts[0].k.nonConformes} écart(s)).</li>`;
    o += `<li>${faux.length ? faux.length + " situation(s) à revoir ci-dessous." : "Toutes les situations ont été correctement qualifiées."}</li></ul></section>`;

    o += `<section class="ck-bloc"><h4>Correction détaillée</h4>`;
    const bloc = (i) => { const c = crit[i], r = reponses[i], ok = r === c.r;
      return `<details class="ck-det ${ok ? "juste" : "faux"}"><summary><span>${i + 1}. ${e(c.q)}</span><span class="ck-pastille ${ok ? "ck-p-ok" : "ck-p-ko"}">${ok ? "Juste" : "À revoir"}</span></summary>
        <p><strong>Situation :</strong> ${e(c.s)}</p><p><strong>Votre réponse :</strong> ${LIBELLE[r] || "—"} · <strong>Attendue :</strong> ${LIBELLE[c.r]}</p><p>${e(c.e)}</p>${c.r === "non" && c.a ? `<p><em>Action corrective :</em> ${e(c.a)}</p>` : ""}</details>`; };
    if (faux.length) o += `<h5>À revoir (${faux.length})</h5>` + faux.map(bloc).join("");
    const bons = crit.map((c, i) => i).filter(i => faux.indexOf(i) === -1);
    if (bons.length) o += `<h5>Bien qualifiés (${bons.length})</h5>` + bons.map(bloc).join("");
    o += `</section><p class="aide" id="ck-envoi-etat" aria-live="polite"></p>
      <div class="actions"><button type="button" class="btn" data-act="refaire" data-id="${e(t.id)}">Refaire ce thème</button><button type="button" class="btn btn-sec" data-act="accueil">Autres thèmes</button><button type="button" class="btn btn-sec" data-act="historique">Historique</button></div>`;
    return o;
  }

  function vueHistorique() {
    const h = histo().slice().reverse();
    let o = `${retour("accueil", "Tous les thèmes")}<h3 class="ck-titre" data-focus>Historique des checklists</h3>
      <p class="aide">${stockageOk ? "Conservé sur cet appareil, séparément de l'historique des évaluations de risques." : "Stockage indisponible sur cet appareil."}</p>`;
    if (!h.length) return o + `<p>Aucun exercice terminé pour l'instant.</p>`;
    o += `<ul class="ck-histo">` + h.map(x => { const t = themeDe(x.themeId);
      return `<li><div><strong>${e(t ? t.titre : x.titre)}</strong><br><span class="ck-petit">${new Date(x.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}${x.secteur ? " · " + e(x.secteur) : ""} · ${x.immediat ? "Entraînement" : "Audit"}</span><br>
        <span>Conformité : <strong>${x.pct === null ? "—" : x.pct + " %"}</strong> · Exactitude : <strong>${x.exacts} / ${x.total}</strong></span></div>
        <div class="ck-histo-act"><button type="button" class="btn btn-sec" data-act="voir" data-cid="${e(x.cid)}">Voir</button><button type="button" class="ck-sup" data-act="supprimer" data-cid="${e(x.cid)}" aria-label="Supprimer cet exercice de l'historique">Supprimer</button></div></li>`; }).join("") + `</ul>
      <div class="actions"><button type="button" class="btn btn-sec" data-act="toutEffacer">Effacer tout l'historique</button></div>`;
    return o;
  }

  function rendre() {
    const f = { accueil: vueAccueil, fiche: vueFiche, question: vueQuestion, recap: vueRecap, resultats: vueResultats, historique: vueHistorique }[vue];
    if (!THEMES.length) { zone.innerHTML = `<p class="erreur" role="alert">Les données des checklists n'ont pas été chargées. Vérifiez que checklists-data-1.js, checklists-data-2.js et checklists-data-3.js sont dans le même dossier que index.html.</p>`; return; }
    if ((vue === "question" || vue === "recap" || vue === "fiche") && !st) vue = "accueil";
    zone.innerHTML = (f || vueAccueil)();
    majEtatEnvoi();
  }

  /* ----- actions ----- */
  function demarrerSession(themeId, base) {
    const t = themeDe(themeId); if (!t) return;
    st = base || { themeId, i: 0, reponses: new Array(nbCrit(t)).fill(null), secteur: null, immediat: false, debut: Date.now() };
  }

  function valider() {
    const t = themeDe(st.themeId), n = nbCrit(t);
    if (st.reponses.filter(Boolean).length < n) return;
    const b = ckCalculer(t, st.reponses);
    const entree = { cid: rnd(), themeId: t.id, titre: t.titre, date: Date.now(), secteur: st.secteur, immediat: st.immediat, total: n,
      pct: b.pourcentage, exacts: b.exacts, conformes: b.conformes, nonConformes: b.nonConformes, na: b.na, score: b.score, scoreMax: b.scoreMax,
      rep: ckEncoder(st.reponses, n), duree: Math.round((Date.now() - st.debut) / 1000) };
    const h = histo(); h.push(entree);
    ecrire(CLE_HISTO, h.slice(-CK_CONFIG.maxHistorique));
    retirer(CLE_BROUILLON);
    dernier = { theme: t, reponses: st.reponses.slice(), entree };
    planifierEnvoi({ participantId: pid(), clientAttemptId: entree.cid.padEnd(8, "0"), themeId: t.id, themeTitle: t.titre, sector: st.secteur || undefined,
      mode: st.immediat ? "entrainement" : "audit", total: n, conform: b.conformes, nonConform: b.nonConformes, naCount: b.na,
      score: b.score, scoreMax: b.scoreMax, accuracy: b.exacts, answers: entree.rep, durationSeconds: Math.min(entree.duree, 86400) });
    st = null;
    aller("resultats");
  }

  zone.addEventListener("click", ev => {
    const bt = ev.target.closest("[data-act]"); if (!bt || bt.disabled) return;
    const a = bt.getAttribute("data-act"), v = bt.getAttribute("data-v");
    switch (a) {
      case "accueil": aller("accueil"); break;
      case "theme": demarrerSession(bt.getAttribute("data-id")); aller("fiche"); break;
      case "refaire": demarrerSession(bt.getAttribute("data-id")); aller("fiche"); break;
      case "secteur": st.secteur = st.secteur === v ? null : v; rendre(); break;
      case "mode": st.immediat = v === "direct"; rendre(); break;
      case "demarrer": sauverBrouillon(); aller("question"); break;
      case "reprendre": { const b = brouillon(); if (b) { st = b; aller("question"); } break; }
      case "abandonner": if (window.confirm("Abandonner l'exercice en cours ?")) { retirer(CLE_BROUILLON); st = null; rendre(); } break;
      case "repondre": st.reponses[st.i] = v; sauverBrouillon(); rendre(); { const x = zone.querySelector(".ck-correction"); if (x && x.scrollIntoView) x.scrollIntoView({ block: "nearest" }); } break;
      case "prec": if (st.i > 0) { st.i--; sauverBrouillon(); aller("question"); } break;
      case "suiv": if (st.i < st.reponses.length - 1) { st.i++; sauverBrouillon(); aller("question"); } else { aller("recap"); } break;
      case "recap": sauverBrouillon(); aller("recap"); break;
      case "question": aller("question"); break;
      case "aller": st.i = parseInt(bt.getAttribute("data-i"), 10) || 0; sauverBrouillon(); aller("question"); break;
      case "quitter": sauverBrouillon(); st = null; aller("accueil"); break;
      case "valider": valider(); break;
      case "historique": aller("historique"); break;
      case "voir": { const x = histo().find(h => h.cid === bt.getAttribute("data-cid")), t = x && themeDe(x.themeId);
        if (x && t && nbCrit(t) === x.total) { dernier = { theme: t, reponses: ckDecoder(x.rep, x.total), entree: x }; aller("resultats"); }
        else window.alert("Ce thème a été modifié depuis cet exercice : le détail n'est plus disponible."); break; }
      case "supprimer": if (window.confirm("Supprimer cet exercice de l'historique ?")) { ecrire(CLE_HISTO, histo().filter(h => h.cid !== bt.getAttribute("data-cid"))); rendre(); } break;
      case "toutEffacer": if (window.confirm("Effacer tout l'historique des checklists ? Cela ne touche pas l'historique des évaluations de risques.")) { ecrire(CLE_HISTO, []); rendre(); } break;
    }
  });
  zone.addEventListener("change", ev => {
    if (ev.target && ev.target.id === "ck-envoi") { ecrire(CLE_ENVOI, ev.target.checked); majEtatEnvoi(); if (ev.target.checked) vider(); }
  });

  rendre();
  window.QHSEChecklists = { calculer: ckCalculer, themes: THEMES };
})();
