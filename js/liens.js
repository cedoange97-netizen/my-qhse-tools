/* ==========================================================
   My-QHSE Tools – liens.js (écran « Liens »)
   Partager la page et copier l'adresse e-mail.
   ========================================================== */
(function () {
  "use strict";
  var etat = document.getElementById("liens-etat");
  var EMAIL = "myqhse2@gmail.com";

  function dire(msg) {
    if (!etat) return;
    etat.textContent = msg;
    clearTimeout(dire.t);
    dire.t = setTimeout(function () { etat.textContent = ""; }, 3500);
  }

  function copier(texte, ok) {
    function secours() {
      var t = document.createElement("textarea");
      t.value = texte; t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(t); t.select();
      var reussi = false;
      try { reussi = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(t);
      dire(reussi ? ok : "Copie impossible. Sélectionnez le texte à la main.");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texte).then(function () { dire(ok); }, secours);
    } else { secours(); }
  }

  var btnMail = document.getElementById("liens-copier-mail");
  if (btnMail) btnMail.addEventListener("click", function () { copier(EMAIL, "Adresse e-mail copiée."); });

  var btnPartage = document.getElementById("liens-partager");
  if (btnPartage) btnPartage.addEventListener("click", function () {
    var url = location.href.split("#")[0] + "#liens";
    var titre = "My-QHSE Afrique";
    var texte = "Actualités, outils et bonnes pratiques QHSE : retrouvez tous nos liens.";
    if (navigator.share) {
      navigator.share({ title: titre, text: texte, url: url }).catch(function () { /* partage annulé */ });
    } else {
      copier(url, "Lien de la page copié.");
    }
  });

  /* ----- Menu latéral (3 traits) ----- */
  var burger = document.getElementById("btn-menu");
  var tiroir = document.getElementById("tiroir");
  var voile = document.getElementById("tiroir-voile");
  var fermer = document.getElementById("tiroir-fermer");

  function ouvrir() {
    document.body.classList.add("tiroir-ouvert");
    burger.setAttribute("aria-expanded", "true");
    setTimeout(function () { var p = tiroir.querySelector(".tiroir-item[aria-current='page']") || tiroir.querySelector(".tiroir-item"); if (p) p.focus(); }, 60);
  }
  function fermerTiroir(rendreFocus) {
    if (!document.body.classList.contains("tiroir-ouvert")) return;
    document.body.classList.remove("tiroir-ouvert");
    burger.setAttribute("aria-expanded", "false");
    if (rendreFocus) burger.focus();
  }
  if (burger && tiroir) {
    burger.addEventListener("click", ouvrir);
    voile.addEventListener("click", function () { fermerTiroir(true); });
    fermer.addEventListener("click", function () { fermerTiroir(true); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") fermerTiroir(true); });
    /* Choisir une page dans le menu : le menu se referme (la navigation est gérée par index.html) */
    Array.prototype.forEach.call(tiroir.querySelectorAll(".tiroir-item"), function (b) {
      b.addEventListener("click", function () { fermerTiroir(false); });
    });
  }
})();
