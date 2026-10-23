/* ==========================================================
   My-QHSE Tools – parametres.js
   Préférences de l'utilisateur, enregistrées sur l'appareil (localStorage) :
     - langue   : "fr" | "en"
     - theme    : "systeme" | "clair" | "sombre"
     - couleur  : "vert" | "bleu" | "violet" | "orange" | "noir"
     - taille   : "petit" | "normal" | "grand" | "tres-grand"
   Ce fichier est chargé dans <head> (après les feuilles de style) pour
   appliquer les préférences AVANT l'affichage, sans « flash » de couleur.

   TRADUCTION PROGRESSIVE
   - Un texte fixe de index.html se traduit en lui ajoutant data-i18n="cle"
     (ou data-i18n-aria="cle" pour un aria-label).
   - Un autre fichier JS peut ajouter ses textes :
       QHSEPrefs.ajouterTraductions("en", { "quiz.titre": "QHSE Quiz" });
       QHSEPrefs.t("quiz.titre")      // texte dans la langue courante
   - Une clé absente en anglais retombe sur le français : rien ne casse.
   - Un événement « qhse:prefs » est émis à chaque changement.
   ========================================================== */
(function () {
  "use strict";

  var CLE = "myqhse_tools_prefs_v1";
  var DEFAUT = { langue: "fr", theme: "systeme", couleur: "vert", taille: "normal" };
  var VALEURS = {
    langue: ["fr", "en"],
    theme: ["systeme", "clair", "sombre"],
    couleur: ["vert", "bleu", "violet", "orange", "noir"],
    taille: ["petit", "normal", "grand", "tres-grand"]
  };

  /* ---------- Dictionnaire (partie traduite à ce jour : navigation, en-tête, pied de page, Paramètres) ---------- */
  var DICO = {
    fr: {
      "titre.apropos": "À propos",
      "apropos.titre": "À propos de My-QHSE Afrique",
      "apropos.p1": "My-QHSE Afrique est une initiative consacrée à la diffusion d'informations, de bonnes pratiques et d'outils dans les domaines de la qualité, de l'hygiène, de la santé, de la sécurité et de l'environnement (QHSE).",
      "apropos.p2": "Notre objectif est de contribuer à la prévention des risques, à la protection des personnes et de l'environnement, ainsi qu'à l'amélioration continue des pratiques professionnelles.",
      "apropos.p3": "Nous partageons des ressources destinées aux professionnels, aux étudiants et aux passionnés du QHSE, notamment dans les secteurs du BTP, des mines et des industries.",
      "apropos.p4": "À travers My-QHSE Tools, nous développons des outils numériques pratiques pour faciliter l'apprentissage, l'analyse des risques et l'application des méthodes QHSE au quotidien.",
      "apropos.p5": "Notre ambition est de rendre les connaissances et les outils QHSE plus accessibles et de promouvoir une culture de prévention, de sécurité et d'amélioration continue.",
      "apropos.devise.label": "Notre devise",
      "apropos.devise": "Prévenir, protéger et progresser ensemble.",
      "apropos.retour.param": "Retour aux Paramètres",
      "apropos.retour.app": "Retour à l'application",
      "param.apropos": "À propos de My-QHSE Afrique",
      "param.apropos.aide": "Notre mission et notre application.",
      "doc.titre": "My-QHSE Tools – Calculateur de risques professionnels",
      "skip": "Aller au calculateur",
      "titre.risques": "Risques", "titre.quiz": "Quiz QHSE", "titre.sujets": "Sujets QHSE",
      "titre.outils": "Outils QHSE", "titre.historique": "Historique", "titre.parametres": "Paramètres",
      "nav.risques": "Risques", "nav.quiz": "Quiz", "nav.sujets": "Sujets", "nav.outils": "Outils", "nav.historique": "Historique",
      "nav.principale": "Navigation principale",
      "param.bouton": "Paramètres",
      "pied": "My-QHSE Afrique · Outil pédagogique, ne remplace pas l'évaluation d'un professionnel qualifié.",
      "param.titre": "Paramètres",
      "param.intro": "Vos préférences sont enregistrées sur cet appareil, dans ce navigateur. Elles sont conservées après la fermeture de l'application.",
      "param.langue": "Langue",
      "param.langue.aide": "Choisissez la langue de l'interface.",
      "param.langue.note": "Traduction en cours : pour l'instant, la navigation, l'en-tête, le pied de page, cette page Paramètres et la page À propos sont traduits. Le calculateur, le quiz, les sujets et les outils restent en français.",
      "param.theme": "Apparence",
      "param.theme.clair": "Mode clair",
      "param.theme.sombre": "Mode sombre",
      "param.theme.systeme": "Mode système",
      "param.theme.systeme.aide": "Suit le réglage de votre téléphone",
      "param.couleur": "Couleur principale",
      "param.couleur.aide": "Couleur de l'en-tête, des boutons et des éléments actifs.",
      "param.couleur.vert": "Vert", "param.couleur.bleu": "Bleu", "param.couleur.violet": "Violet", "param.couleur.orange": "Orange", "param.couleur.noir": "Noir",
      "param.taille": "Taille du texte",
      "param.taille.aide": "Agrandit ou réduit le texte de toute l'application.",
      "param.taille.petit": "Petit", "param.taille.normal": "Normal", "param.taille.grand": "Grand", "param.taille.tres-grand": "Très grand",
      "param.apercu": "Aperçu : voici la taille du texte de l'application.",
      "param.reset": "Rétablir les valeurs par défaut",
      "param.ok": "Préférences enregistrées.",
      "param.reset.ok": "Valeurs par défaut rétablies.",
      "param.erreur": "Impossible d'enregistrer sur cet appareil (stockage bloqué). Vos choix s'appliquent maintenant mais ne seront pas conservés."
    },
    en: {
      "titre.apropos": "About",
      "apropos.titre": "About My-QHSE Africa",
      "apropos.p1": "My-QHSE Africa is an initiative dedicated to sharing information, good practices and practical tools in Quality, Hygiene, Health, Safety and Environment (QHSE).",
      "apropos.p2": "Our goal is to contribute to risk prevention, the protection of people and the environment, and the continuous improvement of professional practices.",
      "apropos.p3": "We share resources for professionals, students and QHSE enthusiasts, particularly in construction, mining and industrial sectors.",
      "apropos.p4": "Through My-QHSE Tools, we develop practical digital tools to support learning, risk analysis and the everyday application of QHSE methods.",
      "apropos.p5": "Our ambition is to make QHSE knowledge and tools more accessible and to promote a culture of prevention, safety and continuous improvement.",
      "apropos.devise.label": "Our motto",
      "apropos.devise": "Prevent, protect and progress together.",
      "apropos.retour.param": "Back to Settings",
      "apropos.retour.app": "Back to the app",
      "param.apropos": "About My-QHSE Africa",
      "param.apropos.aide": "Our mission and our app.",
      "doc.titre": "My-QHSE Tools – Occupational risk calculator",
      "skip": "Skip to the calculator",
      "titre.risques": "Risks", "titre.quiz": "QHSE Quiz", "titre.sujets": "QHSE Topics",
      "titre.outils": "QHSE Tools", "titre.historique": "History", "titre.parametres": "Settings",
      "nav.risques": "Risks", "nav.quiz": "Quiz", "nav.sujets": "Topics", "nav.outils": "Tools", "nav.historique": "History",
      "nav.principale": "Main navigation",
      "param.bouton": "Settings",
      "pied": "My-QHSE Africa · Educational tool; it does not replace the assessment of a qualified professional.",
      "param.titre": "Settings",
      "param.intro": "Your preferences are saved on this device, in this browser. They are kept after you close the app.",
      "param.langue": "Language",
      "param.langue.aide": "Choose the interface language.",
      "param.langue.note": "Translation in progress: for now, the navigation, header, footer, this Settings page and the About page are translated. The calculator, quiz, topics and tools are still in French.",
      "param.theme": "Appearance",
      "param.theme.clair": "Light mode",
      "param.theme.sombre": "Dark mode",
      "param.theme.systeme": "System mode",
      "param.theme.systeme.aide": "Follows your phone's setting",
      "param.couleur": "Main colour",
      "param.couleur.aide": "Colour of the header, buttons and active items.",
      "param.couleur.vert": "Green", "param.couleur.bleu": "Blue", "param.couleur.violet": "Purple", "param.couleur.orange": "Orange", "param.couleur.noir": "Black",
      "param.taille": "Text size",
      "param.taille.aide": "Makes the text of the whole app larger or smaller.",
      "param.taille.petit": "Small", "param.taille.normal": "Normal", "param.taille.grand": "Large", "param.taille.tres-grand": "Extra large",
      "param.apercu": "Preview: this is the text size used in the app.",
      "param.reset": "Restore default settings",
      "param.ok": "Preferences saved.",
      "param.reset.ok": "Default settings restored.",
      "param.erreur": "Could not save on this device (storage blocked). Your choices apply now but will not be kept."
    }
  };

  /* ---------- Lecture / écriture ---------- */
  var stockageOk = true;
  var prefs = copie(DEFAUT);

  function copie(o) { return { langue: o.langue, theme: o.theme, couleur: o.couleur, taille: o.taille }; }

  /** Nettoie un objet lu depuis le stockage : toute valeur inconnue revient à la valeur par défaut. */
  function valider(brut) {
    var r = copie(DEFAUT);
    if (brut && typeof brut === "object") {
      Object.keys(VALEURS).forEach(function (k) {
        if (typeof brut[k] === "string" && VALEURS[k].indexOf(brut[k]) !== -1) r[k] = brut[k];
      });
    }
    return r;
  }

  function lire() {
    try { return valider(JSON.parse(localStorage.getItem(CLE) || "null")); }
    catch (e) { return copie(DEFAUT); }   // stockage illisible ou bloqué : valeurs par défaut
  }

  function ecrire() {
    try { localStorage.setItem(CLE, JSON.stringify(prefs)); stockageOk = true; }
    catch (e) { stockageOk = false; }
    return stockageOk;
  }

  /* ---------- Application à la page ---------- */
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function themeEffectif() {
    if (prefs.theme === "clair" || prefs.theme === "sombre") return prefs.theme;
    return mq && mq.matches ? "sombre" : "clair";
  }

  function t(cle) {
    var d = DICO[prefs.langue] || DICO.fr;
    if (d[cle] !== undefined) return d[cle];
    return DICO.fr[cle] !== undefined ? DICO.fr[cle] : cle;
  }

  function appliquerStyles() {
    var h = document.documentElement;
    h.setAttribute("data-theme", themeEffectif());
    h.setAttribute("data-couleur", prefs.couleur);
    h.setAttribute("data-taille", prefs.taille);
    h.setAttribute("lang", prefs.langue);
    /* Barre d'état d'Android : même couleur que l'en-tête */
    try {
      var c = getComputedStyle(h).getPropertyValue("--vert-fonce").trim();
      var m = document.querySelector('meta[name="theme-color"]');
      if (c && m) m.setAttribute("content", c);
    } catch (e) { /* sans importance */ }
  }

  function traduirePage() {
    if (!document.body) return;
    var i, el, n;
    n = document.querySelectorAll("[data-i18n]");
    for (i = 0; i < n.length; i++) { el = n[i]; el.textContent = t(el.getAttribute("data-i18n")); }
    n = document.querySelectorAll("[data-i18n-aria]");
    for (i = 0; i < n.length; i++) { el = n[i]; el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); }
    document.title = t("doc.titre");
  }

  function synchroniserFormulaire() {
    var radios = document.querySelectorAll("input[data-pref]");
    for (var i = 0; i < radios.length; i++) {
      var r = radios[i];
      r.checked = prefs[r.getAttribute("data-pref")] === r.value;
    }
  }

  function annoncer(cle, alerte) {
    var e = document.getElementById("param-etat");
    if (!e) return;
    e.textContent = stockageOk ? t(cle) : t("param.erreur");
    e.className = "pref-etat" + (stockageOk ? "" : " alerte");
  }

  function emettre() {
    try { window.dispatchEvent(new CustomEvent("qhse:prefs", { detail: copie(prefs) })); } catch (e) { /* ancien navigateur */ }
  }

  function toutAppliquer() {
    appliquerStyles();
    traduirePage();
    synchroniserFormulaire();
    emettre();
  }

  /** Modifie une préférence, l'applique tout de suite et l'enregistre. */
  function definir(cle, valeur) {
    if (!VALEURS[cle] || VALEURS[cle].indexOf(valeur) === -1) return false;
    prefs[cle] = valeur;
    ecrire();
    toutAppliquer();
    annoncer("param.ok");
    return true;
  }

  function reinitialiser() {
    prefs = copie(DEFAUT);
    ecrire();
    toutAppliquer();
    annoncer("param.reset.ok");
  }

  /* ---------- Démarrage ---------- */
  prefs = lire();
  appliquerStyles();   // immédiat : évite le flash de couleurs au chargement

  function brancherInterface() {
    toutAppliquer();
    document.addEventListener("change", function (e) {
      var c = e.target;
      if (c && c.getAttribute && c.getAttribute("data-pref")) definir(c.getAttribute("data-pref"), c.value);
    });
    var btn = document.getElementById("param-reset");
    if (btn) btn.addEventListener("click", reinitialiser);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", brancherInterface);
  else brancherInterface();

  /* Mode « système » : on suit le téléphone en direct */
  if (mq) {
    var surChangementSysteme = function () { if (prefs.theme === "systeme") { appliquerStyles(); emettre(); } };
    if (mq.addEventListener) mq.addEventListener("change", surChangementSysteme);
    else if (mq.addListener) mq.addListener(surChangementSysteme);
  }
  /* Préférences modifiées dans un autre onglet du même navigateur */
  window.addEventListener("storage", function (e) { if (e.key === CLE) { prefs = lire(); toutAppliquer(); } });

  /* ---------- API publique ---------- */
  window.QHSEPrefs = {
    t: t,
    get: function () { return copie(prefs); },
    set: definir,
    reset: reinitialiser,
    langue: function () { return prefs.langue; },
    ajouterTraductions: function (langue, dico) {
      if (!DICO[langue] || !dico) return;
      Object.keys(dico).forEach(function (k) { DICO[langue][k] = dico[k]; });
      traduirePage();
    },
    cle: CLE
  };
})();
