/* ==========================================================
   My-QHSE Tools – entree.js
   Page d'entrée de l'application : une seule porte, trois sorties.
     • Commencer       : personne nouvelle sur cet appareil  → application
     • Continuer       : personne qui utilise déjà l'appli   → application
     • Administrateur  : code administrateur                 → statistiques seulement
   Le tableau de bord reprend celui de admin.html, mais DANS l'application :
   plus besoin d'ouvrir un autre lien. Le code n'est jamais enregistré : il
   reste en mémoire jusqu'à « Se déconnecter » ou la fermeture de la page.
   Ce fichier est chargé par parametres.js (dans l'en-tête de index.html).
   ========================================================== */
(function () {
  "use strict";
  var API = "https://my-qhse-api-ci.myqhse2.workers.dev";
  var FLAG = "qhse_deja_venu";
  var racine = document.documentElement;

  /* L'application reste masquée tant qu'un choix n'est pas fait ; si quoi que ce soit échoue, on la libère. */
  racine.classList.add("entree-attente");
  function liberer() { racine.classList.remove("entree-attente"); }
  var secours = setTimeout(function () { if (!document.getElementById("entree")) liberer(); }, 6000);

  function stockage(action, cle, val) {
    try {
      if (action === "get") return localStorage.getItem(cle);
      if (action === "set") localStorage.setItem(cle, val);
    } catch (e) {}
    return null;
  }
  /* Déjà utilisateur : marque posée par cette page, OU anciennes données de l'appli (historique, quiz, préférences, statistiques) */
  function dejaVenu() {
    if (stockage("get", FLAG) === "1") return true;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        if (/^(my)?qhse/i.test(localStorage.key(i) || "")) return true;
      }
    } catch (e) {}
    return false;
  }

  var REVENANT = dejaVenu();   // évalué tout de suite : les autres scripts écrivent ensuite dans le stockage

  var LANG = (racine.getAttribute("lang") || "fr").slice(0, 2) === "en" ? "en" : "fr";
  var T = {
    fr: {
      sous: "Qualité · Hygiène · Sécurité · Environnement",
      bienvenue: "Bienvenue ! Évaluez les risques, révisez avec les quiz et retrouvez vos outils QHSE.",
      retour: "Content de vous revoir ! Retrouvez vos outils là où vous les avez laissés.",
      commencer: "Commencer", continuer: "Continuer", admin: "Administrateur",
      code: "Code administrateur", entrer: "Entrer", retourBtn: "Retour",
      saisie: "Saisissez votre code. Il n'est ni enregistré ni affiché.",
      titreAdmin: "Statistiques", deconnexion: "Se déconnecter", actualiser: "Actualiser", plus: "Voir plus de résultats",
      attente: "Vérification…", invalide: "Code administrateur invalide.", reseau: "Réseau indisponible.",
      trop: "Trop de requêtes. Réessayez dans quelques minutes.",
      nonConf: "Administration non configurée côté serveur (secret ADMIN_TOKEN manquant).", serveur: "Erreur du serveur ("
    },
    en: {
      sous: "Quality · Health · Safety · Environment",
      bienvenue: "Welcome! Assess risks, practise with quizzes and find your QHSE tools.",
      retour: "Welcome back! Pick up your tools where you left them.",
      commencer: "Get started", continuer: "Continue", admin: "Administrator",
      code: "Administrator code", entrer: "Enter", retourBtn: "Back",
      saisie: "Enter your code. It is neither saved nor displayed.",
      titreAdmin: "Statistics", deconnexion: "Log out", actualiser: "Refresh", plus: "Show more results",
      attente: "Checking…", invalide: "Invalid administrator code.", reseau: "Network unavailable.",
      trop: "Too many requests. Try again in a few minutes.",
      nonConf: "Administration is not configured on the server (ADMIN_TOKEN secret missing).", serveur: "Server error ("
    }
  }[LANG];

  var CSS =
    "html.entree-attente body > *:not(#entree):not(#admin-tdb){display:none!important}" +
    "#entree{position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;" +
      "background:linear-gradient(160deg,var(--vert-fonce,#075e54),var(--vert,#0f7a6b));font-family:inherit}" +
    "#entree[hidden],#admin-tdb[hidden]{display:none!important}" +
    ".ent-carte{width:100%;max-width:420px;margin:auto;text-align:center;background:var(--surface,#fff);color:var(--texte,#1b2b24);border-radius:24px;padding:30px 22px 26px;box-shadow:0 12px 40px rgba(0,0,0,.28)}" +
    ".ent-logo{width:66px;height:66px;margin:0 auto 14px;border-radius:20px;background:var(--vert-fonce,#075e54);color:#fff;display:grid;place-items:center}" +
    ".ent-logo svg{width:38px;height:38px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
    ".ent-carte h1{margin:0;font-size:1.55rem;color:var(--titre,#075e54)}.ent-carte h1 span{font-weight:400}" +
    ".ent-sous{margin:6px 0 0;font-size:.85rem;color:var(--gris,#5b6b63)}" +
    ".ent-texte{margin:16px 0 8px;line-height:1.5}" +
    ".ent-btn{display:block;width:100%;min-height:52px;margin-top:12px;padding:10px 16px;border-radius:14px;font:inherit;font-size:1.05rem;font-weight:700;cursor:pointer;border:2px solid var(--vert,#0f7a6b);-webkit-tap-highlight-color:transparent}" +
    ".ent-btn.princ{background:var(--vert,#0f7a6b);color:var(--sur-accent,#fff)}" +
    ".ent-btn.sec{background:transparent;color:var(--titre,#075e54)}" +
    ".ent-btn:focus-visible,.ent-champ:focus-visible{outline:3px solid #0b7f86;outline-offset:2px}" +
    ".ent-sep{height:1px;margin:20px 6px 4px;background:var(--bordure,#d5e3db)}" +
    ".ent-form{margin-top:14px;text-align:left}" +
    ".ent-form label{display:block;margin-bottom:6px;font-weight:600}" +
    ".ent-champ{width:100%;padding:14px;font:inherit;border:1.5px solid var(--champ,#9db8a9);border-radius:12px;background:var(--surface,#fff);color:var(--texte,#1b2b24)}" +
    ".ent-msg{min-height:1.4em;margin:10px 0 0;font-size:.92rem;color:var(--gris,#5b6b63)}.ent-msg.err{color:var(--danger,#8a1c1c);font-weight:600}" +

    "#admin-tdb{position:fixed;inset:0;z-index:310;overflow-y:auto;background:var(--fond,#f6faf8);color:var(--texte,#1b2b24)}" +
    ".adm-in{max-width:900px;margin:0 auto;padding:0 16px calc(28px + env(safe-area-inset-bottom,0px))}" +
    ".adm-tete{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:calc(10px + env(safe-area-inset-top,0px)) 0 10px;background:var(--fond,#f6faf8);border-bottom:1px solid var(--bordure,#d5e3db)}" +
    ".adm-tete h1{margin:0;font-size:1.2rem;color:var(--titre,#075e54)}" +
    "#admin-tdb h2{font-size:1.08rem;margin:1.5rem 0 .5rem;color:var(--titre,#075e54)}#admin-tdb h3{font-size:.95rem;margin:1rem 0 .4rem}" +
    ".adm-note{font-size:.85rem;color:var(--gris,#5b6b63);margin:.3rem 0}" +
    ".adm-btn{padding:10px 16px;font:inherit;font-weight:600;border-radius:10px;border:1px solid var(--vert,#0f7a6b);background:var(--vert,#0f7a6b);color:var(--sur-accent,#fff);cursor:pointer}" +
    ".adm-btn.sec{background:var(--vert-clair,#e3f4f0);color:var(--titre,#075e54);border-color:var(--bordure,#d5e3db)}" +
    ".adm-msg{margin:.6rem 0;min-height:1.4em;color:var(--gris,#5b6b63)}.adm-msg.err{color:var(--danger,#8a1c1c);font-weight:600}" +
    ".kpis{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}" +
    ".kpi{background:var(--vert-clair,#e3f4f0);border:1px solid var(--bordure,#d5e3db);border-radius:10px;padding:10px}" +
    ".kpi b{display:block;font-size:1.5rem;color:var(--titre,#075e54)}.kpi span{font-size:.85rem}" +
    ".adm-wrap{overflow-x:auto}#admin-tdb table{width:100%;border-collapse:collapse;font-size:.9rem}" +
    "#admin-tdb th,#admin-tdb td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--bordure,#d5e3db);white-space:nowrap}#admin-tdb th{background:var(--vert-clair,#e3f4f0)}" +
    ".adm-barre{height:10px;background:var(--vert,#0f7a6b);border-radius:5px;min-width:2px}" +
    ".adm-jour{display:grid;grid-template-columns:5.5rem 1fr 3rem;gap:8px;align-items:center;font-size:.85rem;margin:3px 0}" +
    "@media (min-width:600px){.kpis{grid-template-columns:repeat(4,1fr)}}";

  var ICONE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z"/><path d="m9 12 2 2 4-4"/></svg>';
  var jeton = "";          // en mémoire uniquement
  var PAGE = 50, decalage = 0;
  var porte = null, tdb = null;

  function el(tag, text, cls) { var e = document.createElement(tag); if (text !== undefined && text !== null) e.textContent = String(text); if (cls) e.className = cls; return e; }
  function g(id) { return document.getElementById(id); }
  function ad(id) { return document.getElementById("ad-" + id); }

  /* ================== PAGE D'ENTRÉE ================== */
  function construirePorte() {
    var revenant = REVENANT;
    porte = el("div"); porte.id = "entree";
    porte.setAttribute("role", "dialog"); porte.setAttribute("aria-modal", "true"); porte.setAttribute("aria-labelledby", "ent-titre");
    porte.innerHTML =
      '<div class="ent-carte">' +
        '<div class="ent-logo">' + ICONE + '</div>' +
        '<h1 id="ent-titre">My-QHSE <span>Tools</span></h1>' +
        '<p class="ent-sous"></p>' +
        '<div id="ent-choix">' +
          '<p class="ent-texte"></p>' +
          '<button type="button" class="ent-btn princ" id="ent-entrer"></button>' +
          '<div class="ent-sep" role="separator"></div>' +
          '<button type="button" class="ent-btn sec" id="ent-admin"></button>' +
        '</div>' +
        '<form class="ent-form" id="ent-form" hidden autocomplete="off">' +
          '<label for="ent-code"></label>' +
          '<input class="ent-champ" id="ent-code" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" required>' +
          '<p class="ent-msg" id="ent-msg" role="status" aria-live="polite"></p>' +
          '<button type="submit" class="ent-btn princ" id="ent-valider"></button>' +
          '<button type="button" class="ent-btn sec" id="ent-retour"></button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(porte);

    porte.querySelector(".ent-sous").textContent = T.sous;
    porte.querySelector(".ent-texte").textContent = revenant ? T.retour : T.bienvenue;
    g("ent-entrer").textContent = revenant ? T.continuer : T.commencer;
    g("ent-admin").textContent = T.admin;
    porte.querySelector("label").textContent = T.code;
    g("ent-valider").textContent = T.entrer;
    g("ent-retour").textContent = T.retourBtn;
    g("ent-msg").textContent = T.saisie;

    g("ent-entrer").addEventListener("click", function () {   // Commencer / Continuer : on entre dans l'application
      stockage("set", FLAG, "1");
      porte.hidden = true; liberer();
      try { window.scrollTo(0, 0); } catch (e) {}
    });
    g("ent-admin").addEventListener("click", function () { choix(false); });
    g("ent-retour").addEventListener("click", function () { choix(true); });
    g("ent-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var code = g("ent-code").value.trim();
      if (!code) return;
      jeton = code;
      msgPorte(T.attente, false);
      g("ent-valider").disabled = true;
      charger().then(function (ok) {
        g("ent-valider").disabled = false;
        if (ok) { g("ent-code").value = ""; montrerTdb(); } else { jeton = ""; g("ent-code").focus(); }
      });
    });
    g("ent-entrer").focus();
  }
  function choix(principal) {
    g("ent-choix").hidden = !principal; g("ent-form").hidden = principal;
    if (principal) { g("ent-code").value = ""; msgPorte(T.saisie, false); g("ent-entrer").focus(); }
    else g("ent-code").focus();
  }
  function msgPorte(t, err) { var m = g("ent-msg"); if (m) { m.textContent = t; m.className = "ent-msg" + (err ? " err" : ""); } }

  /* ================== TABLEAU DE BORD (statistiques seulement) ================== */
  function construireTdb() {
    tdb = el("div"); tdb.id = "admin-tdb"; tdb.hidden = true;
    tdb.setAttribute("role", "region"); tdb.setAttribute("aria-label", T.titreAdmin);
    tdb.innerHTML =
      '<div class="adm-in">' +
        '<div class="adm-tete"><h1></h1><button type="button" class="adm-btn sec" id="ad-quitter"></button></div>' +
        '<p class="adm-msg" id="ad-msg" role="status" aria-live="polite"></p>' +
        '<div id="ad-tableau">' +
          '<h2>Vue d\'ensemble</h2><div class="kpis" id="ad-kpis-global"></div>' +
          '<h2>Quiz</h2><div class="kpis" id="ad-kpis"></div>' +
          '<h3>Par thème</h3><div class="adm-wrap"><table id="ad-themes"></table></div>' +
          '<h3>30 derniers jours</h3><div id="ad-jours"></div>' +
          '<h3>Dernières tentatives</h3><div class="adm-wrap"><table id="ad-tentatives"></table></div>' +
          '<p><button type="button" class="adm-btn sec" id="ad-plus"></button></p>' +
          '<h2>Checklists</h2><div class="kpis" id="ad-ck-kpis"></div><div class="adm-wrap"><table id="ad-ck-themes"></table></div>' +
          '<h2>Rapports terrain (photos envoyées)</h2>' +
          '<p class="adm-note">Seuls les rapports dont l\'utilisateur a coché l\'envoi des photos dans le cloud apparaissent ici.</p>' +
          '<div class="adm-wrap"><table id="ad-terrain"></table></div>' +
          '<h2>Usage de l\'application</h2><p class="adm-note" id="ad-usage-msg"></p><div class="kpis" id="ad-usage-kpis"></div>' +
          '<h3>Par type d\'activité</h3><div class="adm-wrap"><table id="ad-usage-types"></table></div>' +
          '<h3>Écrans les plus visités</h3><div class="adm-wrap"><table id="ad-usage-ecrans"></table></div>' +
          '<h3>Outils les plus ouverts</h3><div class="adm-wrap"><table id="ad-usage-outils"></table></div>' +
          '<h3>Sujets les plus lus</h3><div class="adm-wrap"><table id="ad-usage-sujets"></table></div>' +
          '<h3>Documents les plus ouverts</h3><div class="adm-wrap"><table id="ad-usage-docs"></table></div>' +
          '<h3>30 derniers jours (actions)</h3><div id="ad-usage-jours"></div>' +
          '<p><button type="button" class="adm-btn sec" id="ad-rafraichir"></button></p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(tdb);
    tdb.querySelector("h1").textContent = "My-QHSE Tools – " + T.titreAdmin;
    ad("quitter").textContent = T.deconnexion;
    ad("plus").textContent = T.plus;
    ad("rafraichir").textContent = T.actualiser;
    ad("quitter").addEventListener("click", deconnecter);
    ad("rafraichir").addEventListener("click", function () { charger(); });
    ad("plus").addEventListener("click", plus);
  }
  function montrerTdb() {
    porte.hidden = true; tdb.hidden = false; tdb.scrollTop = 0;
    document.title = "My-QHSE Tools – " + T.titreAdmin;
  }
  function deconnecter() {
    jeton = ""; decalage = 0;
    tdb.hidden = true; ad("tableau").hidden = true;
    porte.hidden = false; choix(true);
    document.title = titrePage;
  }
  function msgTdb(t, err) { var m = ad("msg"); if (m) { m.textContent = t; m.className = "adm-msg" + (err ? " err" : ""); } }

  function nb(v, suffixe) { return (v === null || v === undefined) ? "–" : v + (suffixe || ""); }
  function duree(s) { if (s === null || s === undefined) return "–"; return s >= 60 ? Math.floor(s / 60) + " min " + (s % 60) + " s" : s + " s"; }

  function appel(chemin) {
    return fetch(API + chemin, { headers: { "Authorization": "Bearer " + jeton } }).then(function (r) {
      if (r.status === 401) throw new Error(T.invalide);
      if (r.status === 429) throw new Error(T.trop);
      if (r.status === 503) throw new Error(T.nonConf);
      if (!r.ok) throw new Error(T.serveur + r.status + ").");
      return r.json();
    });
  }
  function optionnel(chemin) { return appel(chemin).catch(function () { return null; }); }
  function erreur(e) { return e && e.message === "Failed to fetch" ? T.reseau : (e && e.message) || T.reseau; }

  function tableau(id, entetes, lignes) {
    var t = ad(id); t.textContent = "";
    var h = el("tr"); entetes.forEach(function (x) { h.appendChild(el("th", x)); }); t.appendChild(h);
    if (!lignes.length) { var v = el("tr"); var c = el("td", "Aucune donnée"); c.colSpan = entetes.length; v.appendChild(c); t.appendChild(v); }
    lignes.forEach(function (l) { var tr = el("tr"); l.forEach(function (x) { tr.appendChild(el("td", x)); }); t.appendChild(tr); });
  }
  function lignesTentatives(liste) {
    return (liste.attempts || []).map(function (a) {
      return [a.created_at, a.theme, a.score + " / " + a.total, nb(a.correct_count), nb(a.wrong_count), duree(a.duration_seconds), a.participant_id ? a.participant_id.slice(0, 6) : "–"];
    });
  }
  function kpis(id, paires) {
    var k = ad(id); k.textContent = "";
    paires.forEach(function (x) { var d = el("div", null, "kpi"); d.appendChild(el("b", x[1])); d.appendChild(el("span", x[0])); k.appendChild(d); });
  }
  function barres(id, jours, cle, vide) {
    var j = ad(id); j.textContent = "";
    var max = Math.max.apply(null, [1].concat(jours.map(function (d) { return d[cle]; })));
    if (!jours.length) j.appendChild(el("p", vide));
    jours.forEach(function (d) {
      var l = el("div", null, "adm-jour"); l.appendChild(el("span", d.day));
      var b = el("div", null, "adm-barre"); b.style.width = Math.max(2, Math.round(d[cle] / max * 100)) + "%"; l.appendChild(b);
      l.appendChild(el("span", d[cle])); j.appendChild(l);
    });
  }

  function plus() {
    msgTdb("Chargement…", false);
    appel("/api/admin/attempts?limit=" + PAGE + "&offset=" + decalage).then(function (liste) {
      var t = ad("tentatives");
      lignesTentatives(liste).forEach(function (l) { var tr = el("tr"); l.forEach(function (x) { tr.appendChild(el("td", x)); }); t.appendChild(tr); });
      decalage += (liste.attempts || []).length;
      if ((liste.attempts || []).length < PAGE) ad("plus").hidden = true;
      msgTdb("Données à jour.", false);
    }).catch(function (e) { msgTdb(erreur(e), true); });
  }

  var NOMS_ECRANS = { accueil: "Accueil", risques: "Risques (calculateur)", quiz: "Quiz", sujets: "Sujets", outils: "Outils", documents: "Documents", historique: "Historique", liens: "Liens", parametres: "Paramètres", apropos: "À propos" };
  var NOMS_OUTILS = { assistant: "Assistant QHSE (IA)", causes: "Analyse des causes", glossaire: "Glossaire", incident: "Rapport d'incident", inspection: "Inspection", epi: "EPI", checklists: "Checklists" };
  var NOMS_TYPES = { ecran: "Écrans visités", outil: "Outils ouverts", sujet: "Sujets lus", doc: "Documents ouverts", calcul: "Calculs de risque" };
  var NOMS_TERRAIN = { incident: "Incidents", inspection: "Inspections", epi: "EPI" };

  function afficher(stats, liste, ck, photos, usage) {
    var t = stats.totals || {};
    var cT = ck && ck.totals ? ck.totals : null, usageOk = !!(usage && usage.available), uT = usageOk ? usage.totals : {};
    var nbPhotos = photos && photos.byKind ? photos.byKind.reduce(function (a, r) { return a + r.photos; }, 0) : null;

    kpis("kpis-global", [
      ["Quiz terminés", nb(t.attempts)], ["Checklists envoyées", cT ? nb(cT.attempts) : "–"],
      ["Photos de rapports", nbPhotos === null ? "–" : nbPhotos], ["Actions suivies (usage)", usageOk ? nb(uT.events) : "–"],
      ["Visiteurs (usage)", usageOk ? nb(uT.participants) : "–"], ["Participants au quiz", nb(t.participants)]
    ]);
    kpis("kpis", [["Tentatives", nb(t.attempts)], ["Participants", nb(t.participants)], ["Score moyen", nb(t.avg_percent, " %")], ["Durée moyenne", duree(t.avg_duration_s)]]);
    tableau("themes", ["Thème", "Tentatives", "Score moyen"], (stats.byTheme || []).map(function (r) { return [r.theme, r.attempts, nb(r.avg_percent, " %")]; }));
    barres("jours", stats.last30Days || [], "attempts", "Aucune tentative sur les 30 derniers jours.");
    tableau("tentatives", ["Date (UTC)", "Thème", "Score", "Bonnes", "Mauvaises", "Durée", "Participant"], lignesTentatives(liste));
    decalage = (liste.attempts || []).length;
    ad("plus").hidden = decalage < PAGE;

    kpis("ck-kpis", cT ? [["Résultats", nb(cT.attempts)], ["Participants", nb(cT.participants)], ["Justesse moyenne", nb(cT.avg_accuracy_percent, " %")]] : [["Résultats", "–"]]);
    tableau("ck-themes", ["Checklist", "Résultats", "Justesse", "Conformité"], ck && ck.byTheme ? ck.byTheme.map(function (r) { return [r.theme_title, r.attempts, nb(r.avg_accuracy_percent, " %"), nb(r.avg_conformity_percent, " %")]; }) : []);
    tableau("terrain", ["Type", "Photos", "Rapports"], photos && photos.byKind ? photos.byKind.map(function (r) { return [NOMS_TERRAIN[r.kind] || r.kind, r.photos, r.reports]; }) : []);

    if (!usageOk) {
      ad("usage-msg").textContent = "Le suivi d'usage n'est pas encore activé sur le serveur (table activity_events à créer, voir outils-admin/schema-activite.sql).";
      kpis("usage-kpis", []);
    } else {
      ad("usage-msg").textContent = "Comptage anonyme : seuls le nom de l'écran, de l'outil, du sujet ou du document de la bibliothèque sont enregistrés.";
      kpis("usage-kpis", [["Actions suivies", nb(uT.events)], ["Visiteurs", nb(uT.participants)]]);
    }
    var top = usageOk ? usage.top || [] : [];
    function haut(kind, noms) { return top.filter(function (r) { return r.kind === kind; }).slice(0, 15).map(function (r) { return [noms ? (noms[r.label] || r.label) : r.label, r.n, r.visitors]; }); }
    tableau("usage-types", ["Type", "Actions"], usageOk ? (usage.byKind || []).map(function (r) { return [NOMS_TYPES[r.kind] || r.kind, r.n]; }) : []);
    tableau("usage-ecrans", ["Écran", "Visites", "Visiteurs"], haut("ecran", NOMS_ECRANS));
    tableau("usage-outils", ["Outil", "Ouvertures", "Visiteurs"], haut("outil", NOMS_OUTILS));
    tableau("usage-sujets", ["Sujet", "Lectures", "Visiteurs"], haut("sujet"));
    tableau("usage-docs", ["Document", "Ouvertures", "Visiteurs"], haut("doc"));
    barres("usage-jours", usageOk ? usage.last30Days || [] : [], "events", "Aucune activité sur les 30 derniers jours.");
    ad("tableau").hidden = false;
  }

  /* Charge toutes les statistiques ; renvoie true si le code est accepté et les données affichées. */
  function charger() {
    msgTdb("Chargement…", false);
    return Promise.all([appel("/api/admin/stats"), appel("/api/admin/attempts?limit=" + PAGE),
                        optionnel("/api/admin/checklists"), optionnel("/api/admin/photos"), optionnel("/api/admin/activity")])
      .then(function (r) { afficher(r[0], r[1], r[2], r[3], r[4]); msgTdb("Données à jour.", false); return true; })
      .catch(function (e) { ad("tableau").hidden = true; msgTdb(erreur(e), true); msgPorte(erreur(e), true); return false; });
  }

  /* ================== DÉMARRAGE ================== */
  var titrePage = document.title;
  function demarrer() {
    try {
      clearTimeout(secours);
      titrePage = document.title;
      var st = document.createElement("style"); st.id = "entree-css"; st.textContent = CSS; document.head.appendChild(st);
      construireTdb();
      construirePorte();
    } catch (e) { liberer(); }   // en cas de souci, l'application s'ouvre normalement
  }
  var feuille = document.createElement("style"); feuille.textContent = CSS.split("}")[0] + "}"; (document.head || racine).appendChild(feuille);   // masque l'application dès maintenant
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer); else demarrer();
})();
