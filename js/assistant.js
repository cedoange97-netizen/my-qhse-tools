// My-QHSE Tools — Assistant QHSE (IA). Envoie la question à l'API du Worker (Workers AI, plan gratuit).
// Aucune question ni réponse n'est enregistrée par l'application : tout reste affiché sur cet écran.
(function () {
  "use strict";
  var API = "https://my-qhse-api-ci.myqhse2.workers.dev/api/assistant";
  var $ = function (id) { return document.getElementById(id); };
  var q = $("ia-question"), btn = $("ia-envoyer"), efface = $("ia-effacer"), statut = $("ia-statut"), fil = $("ia-reponses"), nb = $("ia-n");
  if (!q || !btn) return;
  var enCours = false;

  function t(cle, defaut) {
    try { var v = window.QHSEPrefs && window.QHSEPrefs.t ? window.QHSEPrefs.t(cle) : cle; return v && v !== cle ? v : defaut; }
    catch (e) { return defaut; }
  }
  function langue() { return (document.documentElement.getAttribute("lang") || "fr").slice(0, 2) === "en" ? "en" : "fr"; }
  function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt !== undefined) n.textContent = txt; return n; }

  // Mise en forme sûre (aucun HTML injecté) : paragraphes, listes à puces ou numérotées, **gras**.
  function inline(parent, texte) {
    texte.split("**").forEach(function (morceau, i) {
      if (!morceau) return;
      parent.appendChild(i % 2 ? el("strong", null, morceau) : document.createTextNode(morceau.replace(/\*/g, "")));
    });
  }
  function rendre(texte) {
    var box = el("div", "ia-texte"), liste = null, type = "";
    texte.split(/\r?\n/).forEach(function (ligne) {
      var l = ligne.replace(/^\s+|\s+$/g, "");
      var puce = /^[-*•]\s+(.*)$/.exec(l), num = /^\d+[.)]\s+(.*)$/.exec(l);
      if (puce || num) {
        var voulu = puce ? "ul" : "ol";
        if (!liste || type !== voulu) { liste = el(voulu); type = voulu; box.appendChild(liste); }
        var li = el("li"); inline(li, (puce || num)[1]); liste.appendChild(li);
        return;
      }
      liste = null;
      if (!l) return;
      var titre = /^#{1,4}\s+(.*)$/.exec(l);
      var p = el("p", titre ? "ia-sous-titre" : null); inline(p, titre ? titre[1] : l); box.appendChild(p);
    });
    return box;
  }

  function ajouter(question, reponse, erreur) {
    var carte = el("section", "card ia-echange");
    var qq = el("div", "ia-q"); qq.appendChild(el("span", "ia-etiquette", t("ia.q", "Votre question"))); qq.appendChild(el("p", null, question));
    var rr = el("div", "ia-r" + (erreur ? " ia-erreur" : ""));
    rr.appendChild(el("span", "ia-etiquette", erreur ? "" : t("ia.r", "Assistant (IA)")));
    rr.appendChild(erreur ? el("p", null, reponse) : rendre(reponse));
    carte.appendChild(qq); carte.appendChild(rr);
    fil.insertBefore(carte, fil.firstChild);
    while (fil.children.length > 5) fil.removeChild(fil.lastChild);   // on garde les 5 derniers échanges seulement
    try {   // fait apparaître la réponse à l'écran (sans animation si l'appareil l'a demandé)
      var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      carte.scrollIntoView({ block: "start", behavior: reduit ? "auto" : "smooth" });
    } catch (e) {}
  }

  function maj() { nb.textContent = q.value.length; }
  q.addEventListener("input", maj);
  Array.prototype.forEach.call(document.querySelectorAll(".ia-chip"), function (b) {
    b.addEventListener("click", function () { q.value = b.textContent.trim(); maj(); q.focus(); });
  });
  efface.addEventListener("click", function () { q.value = ""; maj(); statut.textContent = ""; q.focus(); });

  function messageErreur(status, code) {
    if (status === 429) return code === "limite_jour_ip" ? t("ia.err.jour", "Limite du jour atteinte.") : t("ia.err.limite", "Trop de questions.");
    if (status === 503 && code === "limite_jour_site") return t("ia.err.jour", "Limite du jour atteinte.");
    if (status === 503 || status === 502) return t("ia.err.indispo", "Assistant indisponible.");
    return t("ia.err.generique", "Une erreur est survenue.");
  }

  function envoyer() {
    if (enCours) return;
    var question = q.value.replace(/\s+/g, " ").trim();
    if (question.length < 3) { statut.textContent = t("ia.court", "Question trop courte."); q.focus(); return; }
    enCours = true; btn.disabled = true; statut.textContent = t("ia.attente", "L'assistant réfléchit…");
    var ctrl = window.AbortController ? new AbortController() : null;
    var delai = setTimeout(function () { if (ctrl) ctrl.abort(); }, 40000);
    fetch(API, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "chat", question: question, langue: langue() }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, status: r.status, j: j }; });
    }).then(function (res) {
      if (res.ok && res.j && res.j.answer) { ajouter(question, res.j.answer, false); q.value = ""; maj(); statut.textContent = ""; }
      else { statut.textContent = ""; ajouter(question, messageErreur(res.status, res.j && res.j.code), true); }
    }).catch(function () {
      statut.textContent = ""; ajouter(question, t("ia.err.reseau", "Réseau indisponible."), true);
    }).then(function () { clearTimeout(delai); enCours = false; btn.disabled = false; });
  }
  btn.addEventListener("click", envoyer);
  q.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") envoyer(); });
  maj();
})();
