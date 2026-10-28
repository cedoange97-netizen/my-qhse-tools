// My-QHSE Tools — Assistant QHSE (IA). Envoie la question à l'API du Worker (Workers AI, plan gratuit).
// Aucune question ni réponse n'est enregistrée par l'application : tout reste affiché sur cet écran.
(function () {
  "use strict";
  var API = "https://my-qhse-api-ci.myqhse2.workers.dev/api/assistant";
  var $ = function (id) { return document.getElementById(id); };
  var q = $("ia-question"), btn = $("ia-envoyer"), efface = $("ia-effacer"), statut = $("ia-statut"), fil = $("ia-reponses"), nb = $("ia-n");
  if (!q || !btn) return;
  var enCours = false;

  /* ===== Interface « discussion » : fil des échanges en haut, saisie fixée en bas ===== */
  var ecran = $("ecran-assistant"), sec = $("assistant"), vide = null;
  (function construireChat() {
    if (!ecran || !fil) return;
    var en = (document.documentElement.getAttribute("lang") || "fr").slice(0, 2) === "en";
    var css = document.createElement("style");
    css.textContent =
      "#ecran-assistant .ia-echange{background:none;box-shadow:none;border:0;border-radius:0;padding:0;overflow:visible;scroll-margin-top:72px;margin:0}" +
      "#ia-reponses{display:flex;flex-direction:column;gap:22px;margin-top:6px}" +
      "#ecran-assistant .ia-q{background:none;padding:0;display:flex;justify-content:flex-end}" +
      "#ecran-assistant .ia-q .ia-etiquette{display:none}" +
      "#ecran-assistant .ia-q p{max-width:86%;margin:0;padding:10px 15px;border-radius:20px 20px 5px 20px;background:var(--vert-clair);color:var(--titre);font-weight:500;white-space:pre-wrap;overflow-wrap:anywhere}" +
      "#ecran-assistant .ia-r{padding:14px 2px 0;background:none;border-radius:0}" +
      "#ecran-assistant .ia-r.ia-erreur{padding:10px 14px;border-radius:12px}" +
      "#ecran-assistant .ia-texte{font-size:1.03rem;line-height:1.6}" +
      ".ia-vide{text-align:center;padding:18px 0 6px}" +
      ".ia-vide-t{margin:0 0 12px;font-size:1.15rem;font-weight:700;color:var(--titre)}" +
      ".ia-vide .ia-suggestions{justify-content:center;margin:0}" +
      "#ecran-assistant .ia-statut{margin:14px 2px 0;color:var(--gris);font-style:italic}" +
      ".ia-espace{height:190px}" +
      ".ia-composer{position:fixed;left:0;right:0;bottom:0;z-index:35;padding:10px 12px calc(8px + env(safe-area-inset-bottom,0px));background:linear-gradient(to top,var(--fond) 72%,transparent)}" +
      ".ia-composer-in{max-width:920px;margin:0 auto;display:flex;align-items:flex-end;gap:8px;padding:8px 8px 8px 18px;background:var(--surface);border:1px solid var(--bordure);border-radius:28px;box-shadow:0 4px 20px rgba(0,0,0,.14)}" +
      ".ia-composer #ia-question{flex:1;min-width:0;min-height:28px;max-height:140px;margin:0;padding:7px 0;border:0;outline:0;box-shadow:none;background:transparent;color:var(--texte);font:inherit;line-height:1.4;resize:none;overflow-y:auto}" +
      ".ia-composer .ia-send{flex:none;width:44px;height:44px;min-height:0;padding:0;border-radius:50%;display:grid;place-items:center}" +
      ".ia-send svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}" +
      ".ia-composer-bas{max-width:920px;margin:2px auto 0;padding:0 14px;display:flex;justify-content:space-between;align-items:center;font-size:.76rem;color:var(--gris)}" +
      ".ia-composer-bas .ia-compteur{margin:0;font-size:.76rem}" +
      ".ia-effacer-lien{appearance:none;background:none;border:0;padding:6px 0;font:inherit;font-size:.78rem;color:var(--titre);text-decoration:underline;cursor:pointer}" +
      "@media (max-width:819px){body.ia-actif .onglets,body.ia-actif .site-footer{display:none}body.ia-actif{padding-bottom:0}}" +
      "@media (min-width:820px){.ia-composer{bottom:0}}";
    document.head.appendChild(css);

    // Zone de saisie : on réutilise les mêmes éléments (mêmes id), seulement déplacés en bas
    var composer = el("div", "ia-composer"), dans = el("div", "ia-composer-in"), bas = el("div", "ia-composer-bas");
    var champ = q.closest(".field");
    q.rows = 1;
    q.setAttribute("aria-label", t("ia.label", "Votre question"));
    q.placeholder = en ? "Ask a QHSE question…" : "Posez votre question QHSE…";
    btn.className = "btn ia-send";
    btn.removeAttribute("data-i18n");
    btn.setAttribute("data-i18n-aria", "ia.envoyer");
    btn.setAttribute("aria-label", t("ia.envoyer", "Poser la question"));
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    efface.className = "ia-effacer-lien";
    dans.appendChild(q); dans.appendChild(btn);
    var compteur = nb && nb.parentNode;
    bas.appendChild(efface);
    if (compteur) bas.appendChild(compteur);
    composer.appendChild(dans); composer.appendChild(bas);
    if (champ && champ.parentNode) champ.parentNode.removeChild(champ);
    var vieuxActions = btn.parentNode && btn.parentNode.classList.contains("actions") ? btn.parentNode : null;
    ecran.appendChild(composer);
    if (sec) Array.prototype.forEach.call(sec.querySelectorAll(".actions"), function (a) { if (!a.children.length) a.parentNode.removeChild(a); });

    // État vide : invitation + suggestions (disparaît dès le premier échange)
    vide = el("div", "ia-vide");
    vide.appendChild(el("p", "ia-vide-t", en ? "What would you like to know?" : "Que voulez-vous savoir ?"));
    var sug = sec && sec.querySelector(".ia-suggestions");
    if (sug) vide.appendChild(sug);
    fil.parentNode.insertBefore(vide, fil);

    // Message d'attente sous les échanges + espace pour ne pas passer sous la zone de saisie
    fil.parentNode.insertBefore(statut, fil.nextSibling);
    var espace = el("div", "ia-espace"); espace.setAttribute("aria-hidden", "true");
    statut.parentNode.insertBefore(espace, statut.nextSibling);
    fil.setAttribute("aria-live", "polite");

    // La barre d'onglets du bas laisse la place à la zone de saisie (téléphone) tant que cet écran est ouvert
    function suivre() { document.body.classList.toggle("ia-actif", !ecran.hidden); }
    new MutationObserver(suivre).observe(ecran, { attributes: true, attributeFilter: ["hidden"] });
    suivre();
  })();

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
    var carte = el("div", "ia-echange");
    var qq = el("div", "ia-q"); qq.appendChild(el("span", "ia-etiquette", t("ia.q", "Votre question"))); qq.appendChild(el("p", null, question));
    var rr = el("div", "ia-r" + (erreur ? " ia-erreur" : ""));
    rr.appendChild(el("span", "ia-etiquette", erreur ? "" : t("ia.r", "Assistant (IA)")));
    rr.appendChild(erreur ? el("p", null, reponse) : rendre(reponse));
    carte.appendChild(qq); carte.appendChild(rr);
    if (vide) vide.hidden = true;
    fil.appendChild(carte);                                        // ordre chronologique : le plus récent en bas
    while (fil.children.length > 5) fil.removeChild(fil.firstChild);   // on garde les 5 derniers échanges seulement
    try {   // place la nouvelle question en haut de l'écran pour lire la réponse depuis le début
      var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      carte.scrollIntoView({ block: "start", behavior: reduit ? "auto" : "smooth" });
    } catch (e) {}
  }

  function maj() {
    nb.textContent = q.value.length;
    q.style.height = "auto";
    q.style.height = Math.min(q.scrollHeight, 140) + "px";   // la zone de saisie grandit avec le texte
  }
  q.addEventListener("input", maj);
  Array.prototype.forEach.call(document.querySelectorAll(".ia-chip"), function (b) {
    b.addEventListener("click", function () { q.value = b.textContent.trim(); maj(); q.focus(); });
  });
  efface.addEventListener("click", function () {   // « Effacer » : vide la saisie et la discussion
    q.value = ""; maj(); statut.textContent = "";
    while (fil.firstChild) fil.removeChild(fil.firstChild);
    if (vide) vide.hidden = false;
    q.focus();
  });

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
  q.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var souris = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    if (e.ctrlKey || e.metaKey || (souris && !e.shiftKey)) { e.preventDefault(); envoyer(); }
  });
  maj();
})();
