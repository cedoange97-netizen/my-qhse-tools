// My-QHSE Tools — page d'accueil : résumé de l'activité de cet appareil (aucun envoi, lecture locale uniquement).
(function () {
  "use strict";
  function compter(cle) {
    try { var v = JSON.parse(localStorage.getItem(cle) || "[]"); return Array.isArray(v) ? v.length : 0; }
    catch (e) { return 0; }
  }
  function maj() {
    var r = document.getElementById("accueil-n-risques"), q = document.getElementById("accueil-n-quiz");
    if (r) r.textContent = compter("myqhse_tools_historique_v1");
    if (q) q.textContent = compter("myqhse_quiz_historique");
  }
  var ec = document.getElementById("ecran-accueil");
  if (ec && window.MutationObserver) {
    new MutationObserver(function () { if (!ec.hidden) maj(); }).observe(ec, { attributes: true, attributeFilter: ["hidden"] });
  }
  maj();
})();
