// My-QHSE Tools — comptage d'usage anonyme (écrans, outils, sujets, documents, calculs).
// Aucune donnée saisie par l'utilisateur n'est envoyée : seulement le nom de l'écran / de l'outil / du sujet / du document de la bibliothèque.
// Désactivation : interrupteur « Statistiques d'usage » dans Paramètres (ou localStorage.setItem("qhse_stats_off", "1")).
(function () {
  "use strict";
  var API = "https://my-qhse-api-ci.myqhse2.workers.dev/api/events";
  var PID = "qhse_participant_id", OFF = "qhse_stats_off";
  var tampon = [], minuteur = null, dernier = {};

  function actif() { try { return localStorage.getItem(OFF) !== "1"; } catch (e) { return true; } }
  function rnd() {
    var s = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2));
    return s.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64);
  }
  function participantId() {
    try { var v = localStorage.getItem(PID); if (!v) { v = rnd(); localStorage.setItem(PID, v); } return v; }
    catch (e) { return undefined; }
  }

  function envoyer() {
    minuteur = null;
    if (!tampon.length || !actif()) { tampon = []; return; }
    var lot = tampon.splice(0, 20);
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = ctrl ? setTimeout(function () { ctrl.abort(); }, 10000) : null;
    try {
      fetch(API, {
        method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
        body: JSON.stringify({ participantId: participantId(), events: lot }),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function () { if (t) clearTimeout(t); }).catch(function () { if (t) clearTimeout(t); });   // perte acceptée : ce sont des statistiques
    } catch (e) {}
    if (tampon.length) minuteur = setTimeout(envoyer, 1000);
  }

  function noter(kind, label) {
    try {
      if (!actif()) return;
      label = String(label || "").replace(/\s+/g, " ").trim().slice(0, 100);
      var cle = kind + "|" + label, now = Date.now();
      if (dernier[cle] && now - dernier[cle] < 3000) return;   // évite les doublons rapprochés
      dernier[cle] = now;
      tampon.push({ kind: kind, label: label });
      if (tampon.length >= 20) envoyer();
      else if (!minuteur) minuteur = setTimeout(envoyer, 4000);
    } catch (e) { /* ne jamais gêner l'application */ }
  }

  function surveillerAffichage(id, cb) {
    var n = document.getElementById(id);
    if (!n || !window.MutationObserver) return;
    new MutationObserver(function () { if (!n.hidden) cb(n); }).observe(n, { attributes: true, attributeFilter: ["hidden"] });
  }

  function demarrer() {
    ["accueil", "risques", "quiz", "sujets", "outils", "documents", "historique", "liens", "parametres", "apropos"].forEach(function (nom) {
      surveillerAffichage("ecran-" + nom, function () { noter("ecran", nom); });
      var n = document.getElementById("ecran-" + nom);
      if (n && !n.hidden) noter("ecran", nom);   // écran affiché au chargement
    });
    ["causes", "glossaire", "incident", "inspection", "epi", "checklists"].forEach(function (nom) {
      surveillerAffichage("ecran-" + nom, function () { noter("outil", nom); });
      var n = document.getElementById("ecran-" + nom);
      if (n && !n.hidden) noter("outil", nom);   // page d'outil affichée au chargement
    });
    surveillerAffichage("sujets-lecture", function (n) {
      var h = n.querySelector("h1, h2, h3");
      noter("sujet", h ? h.textContent : "Sujet");
    });
    var f = document.getElementById("form-risque");
    if (f) f.addEventListener("submit", function () {
      setTimeout(function () { var r = document.getElementById("resultat"); if (r && !r.hidden) noter("calcul", "Calcul de risque"); }, 80);
    });
    var cb = document.getElementById("pref-stats");   // interrupteur dans Paramètres
    if (cb) {
      cb.checked = actif();
      cb.addEventListener("change", function () {
        try { if (cb.checked) localStorage.removeItem(OFF); else localStorage.setItem(OFF, "1"); } catch (e) {}
        if (!cb.checked) tampon = [];
      });
    }
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") envoyer(); });
    window.addEventListener("pagehide", envoyer);
  }

  window.QHSEActivite = { noter: noter };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer); else demarrer();
})();
