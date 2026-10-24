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
})();
