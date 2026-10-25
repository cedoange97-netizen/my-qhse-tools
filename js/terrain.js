/* ==========================================================
   My-QHSE Tools – terrain.js : Incident, Inspection, Registre EPI
   Fiches et photos enregistrées sur l'appareil (IndexedDB).
   Copie facultative des photos dans le cloud (cases à cocher, anonyme).
   Indépendant d'app.js. Pour modifier les listes : tableaux GR, CL, EL.
   ========================================================== */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  var API = "https://my-qhse-api-ci.myqhse2.workers.dev/api/photos";
  var GR = ["Quasi-accident", "Accident sans arrêt", "Accident avec arrêt", "Dégât matériel", "Incident environnemental"];
  var CL = ["Issues de secours dégagées", "Extincteurs accessibles et vérifiés", "EPI portés par le personnel", "Sols propres, sans obstacle", "Installations électriques en bon état", "Produits chimiques étiquetés et rangés", "Signalisation de sécurité visible", "Trousse de premiers secours complète"];
  var EL = ["Casque", "Gants", "Chaussures de sécurité", "Lunettes de protection", "Protection auditive", "Harnais antichute", "Masque respiratoire", "Formation secourisme", "Habilitation électrique", "Autre"];
  var TYPES = {
    incident: { zone: "incident-zone", bouton: "Enregistrer l’incident", oblig: ["lieu", "desc"],
      champs: [["quand", "Date et heure", "datetime-local"], ["lieu", "Lieu", "text"], ["gravite", "Type d’événement", "select", GR], ["desc", "Description des faits", "textarea"], ["mesures", "Mesures immédiates", "textarea"]] },
    inspection: { zone: "inspection-zone", bouton: "Enregistrer l’inspection", oblig: ["lieu"], check: true,
      champs: [["date", "Date", "date"], ["lieu", "Zone inspectée", "text"], ["insp", "Inspecteur", "text"]],
      apres: [["remarques", "Remarques", "textarea"]] },
    epi: { zone: "epi-zone", bouton: "Enregistrer dans le registre", oblig: ["personne", "exp"],
      champs: [["personne", "Personne", "text"], ["element", "Équipement ou formation", "select", EL], ["debut", "Remis ou obtenu le", "date"], ["exp", "Expire le", "date"]] }
  };
  var db = null, mem = [], listes = {};

  function e(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function jour(v) { try { return new Date(v).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: v.length > 10 ? "short" : undefined }); } catch (x) { return v || ""; } }

  /* ----- Stockage local (IndexedDB, avec repli en mémoire) ----- */
  function ouvrir() {
    return new Promise(function (ok) {
      try {
        var r = indexedDB.open("myqhse_terrain", 1);
        r.onupgradeneeded = function () { r.result.createObjectStore("fiches", { keyPath: "id", autoIncrement: true }); };
        r.onsuccess = function () { db = r.result; ok(); };
        r.onerror = function () { ok(); };
      } catch (x) { ok(); }
    });
  }
  function st(m) { return db.transaction("fiches", m).objectStore("fiches"); }
  function rq(r) { return new Promise(function (ok) { r.onsuccess = function () { ok(r.result); }; r.onerror = function () { ok(null); }; }); }
  function tous() { return db ? rq(st("readonly").getAll()) : Promise.resolve(mem.slice()); }
  function ajouter(f) { if (!db) { f.id = Date.now(); mem.push(f); return Promise.resolve(f); } return rq(st("readwrite").add(f)).then(function (id) { f.id = id; return f; }); }
  function maj(f) { return db ? rq(st("readwrite").put(f)) : Promise.resolve(); }
  function suppr(id) { if (!db) { mem = mem.filter(function (x) { return x.id !== id; }); return Promise.resolve(); } return rq(st("readwrite").delete(id)); }

  /* ----- Photos : réduites à 1024 px max, JPEG ----- */
  function reduire(file) {
    return new Promise(function (ok) {
      var img = new Image(), u = URL.createObjectURL(file);
      img.onload = function () {
        var s = Math.min(1, 1024 / Math.max(img.width, img.height)), c = document.createElement("canvas");
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(u); ok(c.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = function () { URL.revokeObjectURL(u); ok(null); };
      img.src = u;
    });
  }

  /* ----- Envoi cloud des photos (facultatif, repris plus tard en cas d'échec) ----- */
  function pid() { try { return localStorage.getItem("qhse_participant_id") || undefined; } catch (x) { return undefined; } }
  function envoyer(f) {
    if (!f.cloud || !f.photos) return Promise.resolve();
    var p = Promise.resolve();
    f.photos.forEach(function (ph, i) {
      if (ph.sent || ph.refus) return;
      p = p.then(function () {
        return fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: false,
          body: JSON.stringify({ kind: f.type, reportRef: "r" + f.cree, photoId: "p" + f.cree + "_" + i, participantId: pid(), dataUrl: ph.d }) })
          .then(function (r) { if (r.ok) ph.sent = true; else if (r.status >= 400 && r.status < 500 && r.status !== 429) ph.refus = true; })
          .catch(function () {});
      });
    });
    return p.then(function () { return maj(f); });
  }
  function reprendre() {
    tous().then(function (l) {
      var a = l.filter(function (f) { return f.cloud && f.photos && f.photos.some(function (p) { return !p.sent && !p.refus; }); });
      return a.reduce(function (p, f) { return p.then(function () { return envoyer(f); }); }, Promise.resolve());
    }).then(function () { Object.keys(listes).forEach(function (t) { listes[t](); }); });
  }

  /* ----- Interface ----- */
  function champ(t, c) {
    var id = t + "-" + c[0], h = '<div class="field"><label for="' + id + '">' + c[1] + "</label>";
    if (c[2] === "select") h += '<select id="' + id + '">' + c[3].map(function (o) { return "<option>" + e(o) + "</option>"; }).join("") + "</select>";
    else if (c[2] === "textarea") h += '<textarea id="' + id + '" maxlength="1000"></textarea>';
    else h += '<input id="' + id + '" type="' + c[2] + '" maxlength="120">';
    return h + "</div>";
  }
  function statutEpi(exp) {
    var j = Math.floor((new Date(exp + "T23:59:59") - new Date()) / 864e5);
    if (isNaN(j)) return ["?", "#eee"];
    return j < 0 ? ["Expiré", "#f5b3b0"] : j <= 30 ? ["Expire dans " + (j + 1) + " j", "#ffd2a3"] : ["Valide", "#cfeedd"];
  }
  function miniatures(a, sup) {
    return a.length ? '<div class="t-photos">' + a.map(function (p, i) {
      return "<div><img src=\"" + p.d + '" alt="Photo jointe">' + (sup ? '<button type="button" data-ph="' + i + '" aria-label="Retirer la photo">×</button>' : "") + "</div>";
    }).join("") + "</div>" : "";
  }
  function fiche(f) {
    var v = f.v || {}, h = '<div class="t-fiche">';
    if (f.type === "incident") h += "<p><strong>" + e(v.gravite) + "</strong> · " + e(v.lieu) + "</p><p>" + e(jour(v.quand || new Date(f.cree).toISOString())) + "</p><p>" + e(v.desc) + "</p>" + (v.mesures ? "<p><em>Mesures : " + e(v.mesures) + "</em></p>" : "");
    if (f.type === "inspection") {
      var ok = 0, nok = 0, nc = [];
      (f.check || []).forEach(function (c) { if (c.r === "ok") ok++; if (c.r === "nok") { nok++; nc.push(c.l); } });
      h += "<p><strong>" + e(v.lieu) + "</strong> · " + e(jour(v.date || new Date(f.cree).toISOString())) + (v.insp ? " · " + e(v.insp) : "") + "</p>";
      h += "<p>Conformité : " + (ok + nok ? Math.round(100 * ok / (ok + nok)) + " % (" + ok + "/" + (ok + nok) + ")" : "non évaluée") + "</p>";
      if (nc.length) h += "<p>À corriger : " + nc.map(e).join(" ; ") + "</p>";
      if (v.remarques) h += "<p><em>" + e(v.remarques) + "</em></p>";
    }
    if (f.type === "epi") {
      var s = statutEpi(v.exp);
      h += "<p><strong>" + e(v.personne) + "</strong> · " + e(v.element) + '</p><p><span class="pastille" style="background:' + s[1] + '">' + s[0] + "</span> expire le " + e(jour(v.exp)) + "</p>";
    }
    h += miniatures(f.photos || [], false);
    if (f.cloud && f.photos && f.photos.length) h += '<p class="aide">Cloud : ' + f.photos.filter(function (p) { return p.sent; }).length + "/" + f.photos.length + " photo(s) envoyée(s)</p>";
    return h + '<button type="button" class="t-sup" data-id="' + f.id + '">Supprimer</button></div>';
  }
  function monter(t) {
    var C = TYPES[t], z = document.getElementById(C.zone), photos = [];
    if (!z) return;
    z.innerHTML = "<form novalidate>" + C.champs.map(function (c) { return champ(t, c); }).join("") +
      (C.check ? '<div class="t-check">' + CL.map(function (l, i) {
        return '<label>' + e(l) + '<select data-c="' + i + '"><option value="">Non évalué</option><option value="ok">Conforme</option><option value="nok">Non conforme</option><option value="na">Sans objet</option></select></label>';
      }).join("") + "</div>" : "") + (C.apres || []).map(function (c) { return champ(t, c); }).join("") +
      '<div class="field"><label for="' + t + '-photo">Photos</label><input id="' + t + '-photo" type="file" accept="image/*" multiple><div data-mini></div></div>' +
      '<div class="t-cloud"><input type="checkbox" id="' + t + '-cloud"><label for="' + t + '-cloud">Envoyer aussi les photos dans le cloud (anonyme). Elles restent toujours sur cet appareil.</label></div>' +
      '<p class="erreur" role="alert" hidden></p><div class="actions"><button type="submit" class="btn">' + C.bouton + '</button></div></form>' +
      '<h3>Enregistrés sur cet appareil</h3><div data-liste></div>';
    var form = z.querySelector("form"), mini = z.querySelector("[data-mini]"), err = z.querySelector(".erreur"), liste = z.querySelector("[data-liste]");
    var $ = function (k) { return document.getElementById(t + "-" + k); };
    function dessinerMini() { mini.innerHTML = miniatures(photos, true); }
    function dessinerListe() {
      tous().then(function (l) {
        l = l.filter(function (f) { return f.type === t; }).sort(function (a, b) { return b.cree - a.cree; });
        liste.innerHTML = l.length ? l.map(fiche).join("") : '<p class="aide">Aucune fiche pour l’instant. Remplissez le formulaire ci-dessus.</p>';
      });
    }
    listes[t] = dessinerListe;
    $("photo").addEventListener("change", function (ev) {
      var fs = Array.prototype.slice.call(ev.target.files).slice(0, 6 - photos.length);
      Promise.all(fs.map(reduire)).then(function (r) {
        r.forEach(function (d) { if (d) photos.push({ d: d }); });
        ev.target.value = ""; dessinerMini();
      });
    });
    mini.addEventListener("click", function (ev) { var i = ev.target.getAttribute && ev.target.getAttribute("data-ph"); if (i !== null && i !== undefined) { photos.splice(+i, 1); dessinerMini(); } });
    liste.addEventListener("click", function (ev) {
      var id = ev.target.getAttribute && ev.target.getAttribute("data-id");
      if (id && confirm("Supprimer cette fiche et ses photos de cet appareil ?")) suppr(+id).then(dessinerListe);
    });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var v = {};
      C.champs.concat(C.apres || []).forEach(function (c) { v[c[0]] = $(c[0]).value.trim(); });
      if (C.oblig.some(function (k) { return !v[k]; })) { err.textContent = "Renseignez les champs obligatoires (lieu, description ou dates selon la fiche)."; err.hidden = false; return; }
      err.hidden = true;
      var f = { type: t, cree: Date.now(), v: v, photos: photos.slice(), cloud: $("cloud").checked && photos.length > 0 };
      if (C.check) f.check = Array.prototype.map.call(form.querySelectorAll("[data-c]"), function (s) { return { l: CL[+s.getAttribute("data-c")], r: s.value }; });
      ajouter(f).then(function () { form.reset(); photos = []; dessinerMini(); dessinerListe(); return envoyer(f); }).then(dessinerListe);
    });
    dessinerListe();
  }

  ouvrir().then(function () { Object.keys(TYPES).forEach(monter); reprendre(); });
  window.addEventListener("online", reprendre);
})();
