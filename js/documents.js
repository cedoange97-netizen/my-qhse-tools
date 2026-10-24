/* ==========================================================
   My-QHSE Tools – documents.js (écran « Documents »)
   Bibliothèque + lecteur Word / Excel / pages (PDF converti) intégré.
   Documents réservés : chiffrés, ouverts seulement avec le code administrateur.
   Dépend de : lecteur-office.js, documents-liste.js, documents-acces.js
   ========================================================== */
(function () {
  "use strict";
  var docs = (window.QHSE_DOCUMENTS || []).slice();
  var $ = function (id) { return document.getElementById(id); };
  var zoneListe = $("doc-zone-liste"), lecture = $("doc-lecture");
  if (!zoneListe || !lecture || !window.QHSEOffice) return;
  var Acces = window.QHSEAcces || null;

  var champ = $("doc-recherche"), liste = $("doc-liste"), compte = $("doc-compte"), vide = $("doc-vide"), puces = $("doc-categories");
  var titre = $("doc-titre"), meta = $("doc-meta"), onglets = $("doc-onglets"), etat = $("doc-etat"), page = $("doc-page"), reessayer = $("doc-reessayer");
  var categorie = "", zoom = 1, ouvert = null, dernierBouton = null, jeton = 0, derniereSource = null;

  function normaliser(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function typeDe(d) {
    if (d.type) return d.type;
    var ext = (String(d.fichier && d.fichier.name ? d.fichier.name : d.fichier || "").split("?")[0].split(".").pop() || "").toLowerCase();
    return ext === "docx" ? "word" : (ext === "xlsx" || ext === "xlsm") ? "excel" : ext === "pdf" ? "pdf" : "autre";
  }
  var LIBELLES = { word: "Document Word", excel: "Classeur Excel", pages: "Document PDF", pdf: "Document PDF", autre: "Document" };
  var BADGES = { word: "W", excel: "X", pages: "PDF", pdf: "PDF", autre: "?" };
  function el(nom, classe, texte) { var e = document.createElement(nom); if (classe) e.className = classe; if (texte) e.textContent = texte; return e; }
  function admin() { return !!(Acces && Acces.actif()); }
  function reserve(d) { return d.acces === "admin"; }

  /* ----- Liste ----- */
  function categories() {
    var vues = {}, r = [];
    docs.forEach(function (d) { if (d.categorie && !vues[d.categorie]) { vues[d.categorie] = 1; r.push(d.categorie); } });
    return r;
  }
  function dessinerPuces() {
    puces.textContent = "";
    var cats = categories();
    puces.hidden = cats.length < 2;
    if (puces.hidden) return;
    [""].concat(cats).forEach(function (c) {
      var b = el("button", "doc-puce-cat", c || "Tous"); b.type = "button";
      b.setAttribute("aria-pressed", String(c === categorie));
      b.addEventListener("click", function () { categorie = c; dessinerPuces(); dessinerListe(); });
      puces.appendChild(b);
    });
  }
  function dessinerListe() {
    var q = normaliser(champ.value.trim());
    var res = docs.filter(function (d) {
      if (categorie && d.categorie !== categorie) return false;
      return !q || normaliser(d.titre + " " + (d.description || "") + " " + (d.categorie || "")).indexOf(q) >= 0;
    });
    liste.textContent = "";
    res.forEach(function (d) {
      var t = typeDe(d), li = el("li"), ferme = reserve(d) && !admin();
      var b = el(ferme ? "div" : "button", "doc-item" + (ferme ? " doc-item-bientot" : ""));
      if (!ferme) b.type = "button";
      var badge = el("span", "doc-badge doc-badge-" + t, BADGES[t] || "?"); badge.setAttribute("aria-hidden", "true");
      var corps = el("span", "doc-item-t"); corps.appendChild(el("strong", "", d.titre));
      if (d.description) corps.appendChild(el("span", "doc-item-d", d.description));
      corps.appendChild(el("small", "doc-item-m", (LIBELLES[t] || LIBELLES.autre) + (d.categorie ? " · " + d.categorie : "")));
      if (ferme) corps.appendChild(el("span", "doc-pastille doc-pastille-bientot", "Bientôt disponible"));
      else if (reserve(d)) corps.appendChild(el("span", "doc-pastille doc-pastille-admin", "Réservé à l’administrateur"));
      b.appendChild(badge); b.appendChild(corps);
      if (!ferme) b.addEventListener("click", function () { dernierBouton = b; ouvrir({ nom: d.titre, fichier: d.fichier, type: t, categorie: d.categorie, acces: d.acces }); });
      li.appendChild(b); liste.appendChild(li);
    });
    var nOuverts = res.filter(function (d) { return !(reserve(d) && !admin()); }).length, nBientot = res.length - nOuverts, parties = [];
    if (nOuverts) parties.push(nOuverts + (nOuverts > 1 ? " documents disponibles" : " document disponible"));
    if (nBientot) parties.push(nBientot + (nBientot > 1 ? " bientôt disponibles" : " bientôt disponible"));
    compte.textContent = parties.join(" · ");
    vide.hidden = res.length > 0;
    vide.textContent = docs.length ? "Aucun document ne correspond à votre recherche." : "Aucun document pour le moment. Ils seront ajoutés prochainement. Vous pouvez déjà ouvrir un fichier Word, Excel ou PDF de votre appareil ci-dessous.";
  }

  /* ----- Lecteur ----- */
  function appliquerZoom() { page.style.setProperty("--doc-zoom", zoom); $("doc-moins").disabled = zoom <= 0.8; $("doc-plus").disabled = zoom >= 1.8; }
  function nettoyer() {
    if (ouvert && ouvert.liberer) ouvert.liberer();
    ouvert = null; page.textContent = ""; onglets.textContent = ""; onglets.hidden = true; etat.textContent = ""; reessayer.hidden = true;
  }
  function message(texte, erreur, relancer) {
    etat.textContent = texte; etat.setAttribute("role", erreur ? "alert" : "status"); etat.className = "doc-etat" + (erreur ? " doc-etat-err" : "");
    reessayer.hidden = !relancer;
  }
  function fermer(rendreFocus) {
    jeton++; nettoyer();
    lecture.hidden = true; zoneListe.hidden = false; derniereSource = null;
    if (rendreFocus && dernierBouton && document.body.contains(dernierBouton)) dernierBouton.focus();
  }

  async function ouvrir(src) {
    var mon = ++jeton; derniereSource = src;
    nettoyer();
    zoneListe.hidden = true; lecture.hidden = false;
    titre.textContent = src.nom; meta.textContent = (LIBELLES[src.type] || LIBELLES.autre) + (src.categorie ? " · " + src.categorie : "");
    message("Ouverture du document…", false, false);
    appliquerZoom();
    try { history.pushState({ docOuvert: 1 }, "", location.href); } catch (e) {}
    titre.focus({ preventScroll: false });
    window.scrollTo(0, 0);
    var buffer;
    try {
      if (src.fichier instanceof File) buffer = await src.fichier.arrayBuffer();
      else {
        if (src.acces === "admin" && !admin()) throw new Error("Ce document est réservé à l’administrateur.");
        var rep = await fetch(encodeURI(src.fichier));
        if (!rep.ok) throw new Error(rep.status === 404 ? "Ce document est introuvable. Vérifiez qu’il se trouve bien dans le dossier « documents »." : "Le document n’a pas pu être chargé (erreur " + rep.status + ").");
        buffer = await rep.arrayBuffer();
        if (src.acces === "admin") buffer = await Acces.dechiffrer(buffer);
      }
    } catch (e) {
      if (mon !== jeton) return;
      var local = location.protocol === "file:";
      var msg = e && e.message;
      if (msg === "illisible") msg = "Ce document n’a pas pu être déchiffré. Verrouillez puis déverrouillez de nouveau l’accès administrateur.";
      else if (msg === "verrouille") msg = "Ce document est réservé à l’administrateur.";
      else if (e instanceof TypeError || local) msg = "Impossible de charger le document. Vérifiez votre connexion" + (local ? " et ouvrez l’application depuis son adresse en ligne (le chargement ne marche pas en ouvrant le fichier directement)." : ".");
      message(msg || "Ce document n’a pas pu être chargé.", true, !local && src.acces !== "admin" || (!!msg && /connexion/.test(msg)));
      return;
    }
    if (mon !== jeton) return;
    try {
      var t4 = new Uint8Array(buffer.slice(0, 4));
      var estPdf = t4[0] === 0x25 && t4[1] === 0x50 && t4[2] === 0x44 && t4[3] === 0x46;
      if (src.type === "pdf" || estPdf) { await afficherPdf(buffer, mon); if (mon === jeton) { etat.textContent = ""; reessayer.hidden = true; } return; }
      if (src.type === "pages") { afficherPages(buffer); etat.textContent = ""; reessayer.hidden = true; return; }
      var doc = await window.QHSEOffice.lire(buffer);
      if (mon !== jeton) { if (doc.liberer) doc.liberer(); return; }
      ouvert = doc; etat.textContent = ""; reessayer.hidden = true;
      if (doc.type === "word") { page.className = "doc-page doc-page-word"; page.appendChild(doc.element); }
      else await afficherExcel(doc, mon);
    } catch (e) {
      if (mon !== jeton) return;
      message((e && e.message) || "Ce document n’a pas pu être lu.", true, false);
    }
  }

  /* ----- Lecteur PDF (pdf.js, chargé seulement à l'ouverture d'un PDF) ----- */
  var PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/", pdfjsPret = null;
  function chargerPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (!pdfjsPret) pdfjsPret = new Promise(function (ok, ko) {
      var sc = document.createElement("script"); sc.src = PDFJS + "pdf.min.js"; sc.async = true;
      sc.onload = function () {
        if (window.pdfjsLib) { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js"; ok(window.pdfjsLib); }
        else { pdfjsPret = null; ko(new Error("pdfjs")); }
      };
      sc.onerror = function () { pdfjsPret = null; ko(new Error("pdfjs")); };
      document.head.appendChild(sc);
    });
    return pdfjsPret;
  }
  async function afficherPdf(buffer, mon) {
    var lib;
    try { lib = await chargerPdfJs(); }
    catch (e) { throw new Error("Le lecteur PDF n’a pas pu être chargé. Vérifiez votre connexion internet puis réessayez."); }
    if (mon !== jeton) return;
    var pdf;
    try { pdf = await lib.getDocument({ data: new Uint8Array(buffer) }).promise; }
    catch (e) { throw new Error(e && e.name === "PasswordException" ? "Ce PDF est protégé par un mot de passe : il ne peut pas être ouvert ici." : "Ce PDF n’a pas pu être lu. Il est peut-être endommagé."); }
    if (mon !== jeton) { try { pdf.destroy(); } catch (e) {} return; }
    var n = pdf.numPages, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var largeur = Math.min(1400, Math.round((page.clientWidth || 360) * dpr * 1.6));
    var premiere = await pdf.getPage(1), v1 = premiere.getViewport({ scale: 1 });
    var ratio = v1.width + " / " + v1.height, file = Promise.resolve(), obs = null, rendu = {};
    page.className = "doc-page doc-page-pages";
    ouvert = { liberer: function () { if (obs) obs.disconnect(); try { pdf.destroy(); } catch (e) {} } };
    function dessiner(i, cv) {
      file = file.then(async function () {
        if (mon !== jeton || rendu[i] || !cv._vu) return;
        try {
          var p = await pdf.getPage(i), v0 = p.getViewport({ scale: 1 }), v = p.getViewport({ scale: largeur / v0.width });
          cv.width = Math.round(v.width); cv.height = Math.round(v.height);
          cv.style.aspectRatio = v0.width + " / " + v0.height;
          await p.render({ canvasContext: cv.getContext("2d"), viewport: v }).promise;
          rendu[i] = true;
        } catch (e) { /* page ignorée : elle sera retentée au prochain passage */ }
      });
    }
    function liberer(i, cv) { if (rendu[i]) { rendu[i] = false; cv.width = 1; cv.height = 1; } }
    if (window.IntersectionObserver) {
      obs = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (en) {
          var cv = en.target, i = cv._num;
          cv._vu = en.isIntersecting;
          if (en.isIntersecting) dessiner(i, cv); else liberer(i, cv);
        });
      }, { rootMargin: "1200px 0px" });
    }
    for (var i = 1; i <= n; i++) {
      var fig = el("figure", "doc-feuillet"), cv = el("canvas", "doc-pageimg");
      cv._num = i; cv._vu = !obs; cv.style.aspectRatio = ratio;
      cv.setAttribute("role", "img"); cv.setAttribute("aria-label", "Page " + i + " sur " + n);
      fig.appendChild(cv); fig.appendChild(el("figcaption", "", "Page " + i + " / " + n));
      page.appendChild(fig);
      if (obs) obs.observe(cv); else dessiner(i, cv);
    }
  }

  function afficherPages(buffer) {
    var json = JSON.parse(new TextDecoder().decode(buffer)), pages = (json.pages || []).filter(function (p) { return /^data:image\/(jpeg|png);base64,/.test(p); });
    if (!pages.length) throw new Error("Ce document ne contient aucune page.");
    page.className = "doc-page doc-page-pages";
    pages.forEach(function (src, i) {
      var fig = el("figure", "doc-feuillet"), img = el("img", "doc-pageimg");
      img.src = src; img.alt = "Page " + (i + 1) + " sur " + pages.length;
      fig.appendChild(img); fig.appendChild(el("figcaption", "", "Page " + (i + 1) + " / " + pages.length));
      page.appendChild(fig);
    });
  }

  async function afficherExcel(doc, mon) {
    page.className = "doc-page doc-page-excel";
    var zone = el("div", "xl-zone"), boutons = [];
    page.appendChild(zone);
    async function choisir(i) {
      boutons.forEach(function (b, k) { b.setAttribute("aria-selected", String(k === i)); b.tabIndex = k === i ? 0 : -1; });
      zone.textContent = ""; zone.appendChild(el("p", "aide", "Chargement de la feuille…"));
      try { await doc.feuilles[i].rendre(zone, 300); }
      catch (e) { if (mon === jeton) { zone.textContent = ""; zone.appendChild(el("p", "doc-etat doc-etat-err", "Cette feuille n’a pas pu être lue.")); } }
    }
    onglets.hidden = doc.feuilles.length < 2;
    doc.feuilles.forEach(function (f, i) {
      var b = el("button", "xl-onglet", f.nom); b.type = "button"; b.setAttribute("role", "tab");
      b.addEventListener("click", function () { choisir(i); });
      b.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        var k = (i + d + boutons.length) % boutons.length; boutons[k].focus(); choisir(k); e.preventDefault();
      });
      boutons.push(b); onglets.appendChild(b);
    });
    await choisir(0);
  }

  /* ----- Accès administrateur ----- */
  var zoneAdmin = $("doc-admin"), barreAdmin = $("doc-admin-actif"), lienAdmin = $("doc-admin-ouvrir"), formAdmin = $("doc-admin-form"),
    codeAdmin = $("doc-admin-code"), msgAdmin = $("doc-admin-msg"), valider = $("doc-admin-valider");
  function majAdmin() {
    if (!zoneAdmin) return;
    zoneAdmin.hidden = !Acces;
    var on = admin();
    barreAdmin.hidden = !on; lienAdmin.hidden = on;
    if (on) { formAdmin.hidden = true; lienAdmin.setAttribute("aria-expanded", "false"); }
  }
  if (Acces && zoneAdmin) {
    lienAdmin.addEventListener("click", function () {
      formAdmin.hidden = !formAdmin.hidden; lienAdmin.setAttribute("aria-expanded", String(!formAdmin.hidden));
      if (!formAdmin.hidden) codeAdmin.focus();
    });
    async function tenter() {
      if (!codeAdmin.value.trim()) { msgAdmin.textContent = "Saisissez le code administrateur."; return; }
      valider.disabled = true; msgAdmin.className = "doc-etat"; msgAdmin.setAttribute("role", "status"); msgAdmin.textContent = "Vérification…";
      try {
        await Acces.deverrouiller(codeAdmin.value);
        codeAdmin.value = ""; msgAdmin.textContent = "";
      } catch (e) {
        msgAdmin.className = "doc-etat doc-etat-err"; msgAdmin.setAttribute("role", "alert");
        msgAdmin.textContent = e.message === "code" ? "Code incorrect." : e.message === "secure" ? "Le déverrouillage demande une connexion sécurisée (adresse en https)." : e.message === "reseau" ? "Impossible de vérifier le code : fichier d’accès introuvable ou pas de connexion." : "Vérification impossible. Réessayez.";
      }
      valider.disabled = false;
    }
    valider.addEventListener("click", tenter);
    codeAdmin.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); tenter(); } });
    $("doc-admin-verrou").addEventListener("click", function () { Acces.verrouiller(); });
    Acces.surChangement(function (actif) {
      majAdmin(); dessinerListe();
      if (!actif && !lecture.hidden && derniereSource && derniereSource.acces === "admin") fermer(false);
    });
    Acces.restaurer();
  }

  /* ----- Branchements ----- */
  champ.addEventListener("input", dessinerListe);
  $("doc-retour").addEventListener("click", function () { if (history.state && history.state.docOuvert) history.back(); else fermer(true); });
  $("doc-moins").addEventListener("click", function () { zoom = Math.max(0.8, Math.round((zoom - 0.1) * 10) / 10); appliquerZoom(); });
  $("doc-plus").addEventListener("click", function () { zoom = Math.min(1.8, Math.round((zoom + 0.1) * 10) / 10); appliquerZoom(); });
  reessayer.addEventListener("click", function () { if (derniereSource) ouvrir(derniereSource); });
  window.addEventListener("popstate", function () { if (!lecture.hidden) fermer(true); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lecture.hidden && !document.body.classList.contains("tiroir-ouvert")) $("doc-retour").click(); });

  var local = $("doc-fichier");
  $("doc-ouvrir-local").addEventListener("click", function () { dernierBouton = $("doc-ouvrir-local"); local.click(); });
  local.addEventListener("change", function () {
    var f = local.files && local.files[0];
    if (!f) return;
    ouvrir({ nom: f.name, fichier: f, type: typeDe({ fichier: f }), categorie: "Fichier de votre appareil" });
    local.value = "";
  });

  dessinerPuces(); dessinerListe(); appliquerZoom(); majAdmin();
})();
