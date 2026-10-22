/* ==========================================================
   My-QHSE Tools – quiz.js : rubrique Quiz QHSE
   Indépendant d'app.js (le calculateur n'est pas touché).
   Ajouter une question = ajouter une ligne dans QUESTIONS :
   - Vrai/Faux : { t: thème, q: énoncé, v: true|false, e: explication }
   - QCM       : { t: thème, q: énoncé, o: [propositions], r: index de la bonne (0 = première), e: explication }
   ========================================================== */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  const zone = document.getElementById("quiz-zone");
  if (!zone) return;

  const THEMES = {
    securite: "Sécurité au travail",
    risques: "Analyse des risques",
    iso9001: "ISO 9001",
    iso14001: "ISO 14001",
    iso45001: "ISO 45001",
    hygiene: "Hygiène et environnement"
  };
  const NB_MIXTE = 10; // nombre de questions pour « Tous les thèmes »

  const QUESTIONS = [
    /* ----- Sécurité au travail ----- */
    { t: "securite", q: "Les équipements de protection individuelle (EPI) sont une mesure de protection collective.", v: false,
      e: "Un EPI protège une seule personne. Les protections collectives (garde-corps, ventilation…) sont prioritaires sur les EPI." },
    { t: "securite", q: "Dans la hiérarchie de prévention, quelle action est prioritaire ?",
      o: ["Fournir des EPI", "Supprimer le danger à la source", "Former le personnel", "Afficher des consignes"], r: 1,
      e: "On élimine d’abord le danger. Les EPI viennent en dernier recours, quand le risque ne peut pas être supprimé ou réduit autrement." },
    { t: "securite", q: "Un accident bénin doit quand même être signalé et enregistré.", v: true,
      e: "Même sans gravité, il révèle des causes qu’on peut corriger avant qu’un accident plus grave ne survienne." },
    { t: "securite", q: "Quelle couleur est utilisée pour les panneaux d’interdiction ?",
      o: ["Rouge", "Bleu", "Vert", "Jaune"], r: 0,
      e: "Rouge : interdiction. Bleu : obligation. Vert : secours ou sauvetage. Jaune : avertissement de danger." },
    { t: "securite", q: "Un presque-accident n’a pas besoin d’être analysé puisque personne n’a été blessé.", v: false,
      e: "Un presque-accident est un signal d’alerte : l’analyser permet de corriger la cause avant qu’il ne devienne un accident." },

    /* ----- Analyse des risques ----- */
    { t: "risques", q: "Comment calcule-t-on le score d’un risque dans une matrice 5 × 5 ?",
      o: ["Probabilité × Gravité", "Probabilité + Gravité", "Gravité seulement", "Nombre d’accidents passés"], r: 0,
      e: "Score = probabilité × gravité, de 1 à 25. C’est le calcul utilisé par le calculateur de cette application." },
    { t: "risques", q: "Danger et risque sont deux mots pour la même chose.", v: false,
      e: "Le danger est une source potentielle de dommage. Le risque combine la probabilité qu’il se produise et la gravité de ses conséquences." },
    { t: "risques", q: "Quelle est la première étape d’une évaluation des risques ?",
      o: ["Rédiger le plan d’action", "Identifier les dangers", "Acheter des EPI", "Calculer le coût des mesures"], r: 1,
      e: "On commence par identifier les dangers et les situations dangereuses, puis on estime et on hiérarchise les risques." },
    { t: "risques", q: "Dans une matrice 5 × 5, quel est le score d’un risque de probabilité 4 et de gravité 4 ?",
      o: ["8", "9", "16", "20"], r: 2,
      e: "4 × 4 = 16. Avec les seuils provisoires de cette application, ce score correspond au niveau « Élevé »." },
    { t: "risques", q: "Une fois évalué, un risque n’a plus besoin d’être réévalué.", v: false,
      e: "L’évaluation doit être mise à jour après un changement (procédé, équipement), un accident, ou à intervalles réguliers." },

    /* ----- ISO 9001 ----- */
    { t: "iso9001", q: "L’ISO 9001 est une norme de management de quoi ?",
      o: ["De l’environnement", "De la santé et sécurité au travail", "De la qualité", "De la sécurité de l’information"], r: 2,
      e: "ISO 9001 : qualité. ISO 14001 : environnement. ISO 45001 : santé et sécurité au travail." },
    { t: "iso9001", q: "L’ISO 9001 s’appuie sur le cycle PDCA (Planifier, Déployer, Contrôler, Agir).", v: true,
      e: "Le PDCA, avec l’approche processus et la pensée basée sur les risques, structure la norme et l’amélioration continue." },
    { t: "iso9001", q: "Lequel de ces éléments est un principe de management de la qualité ?",
      o: ["L’orientation client", "La réduction maximale des effectifs", "Le profit à court terme", "La suppression des audits"], r: 0,
      e: "Parmi les principes : orientation client, leadership, implication du personnel, approche processus, amélioration, décisions fondées sur les preuves." },
    { t: "iso9001", q: "La version 2015 de l’ISO 9001 impose obligatoirement un manuel qualité.", v: false,
      e: "Le manuel qualité n’est plus exigé en tant que tel depuis 2015. La norme demande des informations documentées adaptées à l’organisme." },
    { t: "iso9001", q: "À quoi sert un audit interne ?",
      o: ["À sanctionner les employés", "À vérifier la conformité et l’efficacité du système", "À remplacer la certification", "À fixer les salaires"], r: 1,
      e: "L’audit interne vérifie, à l’aide de preuves, que le système respecte les exigences et qu’il est efficacement mis en œuvre." },

    /* ----- ISO 14001 ----- */
    { t: "iso14001", q: "L’ISO 14001 définit les exigences d’un système de management…",
      o: ["de la qualité", "environnemental", "de l’énergie", "de la santé au travail"], r: 1,
      e: "ISO 14001 aide un organisme à maîtriser ses impacts sur l’environnement et à améliorer sa performance environnementale." },
    { t: "iso14001", q: "Un aspect environnemental est un élément des activités, produits ou services qui peut interagir avec l’environnement.", v: true,
      e: "L’aspect est la cause (ex. : rejet d’eaux usées). L’impact est la modification de l’environnement qui en résulte (ex. : pollution d’un cours d’eau)." },
    { t: "iso14001", q: "Lequel de ces exemples est un impact environnemental (et non un aspect) ?",
      o: ["Le rejet d’eaux usées", "La consommation de carburant", "La pollution d’une rivière", "Les émissions de fumées"], r: 2,
      e: "La pollution de la rivière est la modification subie par le milieu : c’est l’impact. Les autres propositions sont des aspects (causes)." },
    { t: "iso14001", q: "L’ISO 14001 impose les mêmes seuils de pollution dans tous les pays.", v: false,
      e: "La norme n’impose pas de niveau de performance : elle exige le respect des obligations légales applicables et l’amélioration continue." },
    { t: "iso14001", q: "La version 2015 demande de considérer…",
      o: ["Uniquement le site de production", "Le cycle de vie du produit ou service", "Uniquement les déchets", "Uniquement les clients"], r: 1,
      e: "La perspective de cycle de vie (extraction, production, usage, fin de vie) fait partie des exigences de l’ISO 14001:2015." },

    /* ----- ISO 45001 ----- */
    { t: "iso45001", q: "Quelle norme l’ISO 45001:2018 a-t-elle remplacée ?",
      o: ["OHSAS 18001", "ISO 9000", "ISO 26000", "ISO 50001"], r: 0,
      e: "ISO 45001 a remplacé la spécification OHSAS 18001 comme référence internationale du management de la santé et sécurité au travail (SST)." },
    { t: "iso45001", q: "L’ISO 45001 exige la consultation et la participation des travailleurs.", v: true,
      e: "Les travailleurs, à tous les niveaux, doivent être consultés et participer à l’élaboration et à l’amélioration du système SST." },
    { t: "iso45001", q: "Quel rôle la direction doit-elle jouer dans le système SST ?",
      o: ["Tout déléguer au responsable HSE", "Faire preuve de leadership et d’engagement", "Signer la politique, sans plus", "Laisser les travailleurs gérer seuls"], r: 1,
      e: "La direction (la « direction » au sens de la norme) doit s’impliquer et rendre compte de l’efficacité du système SST." },
    { t: "iso45001", q: "Être certifié ISO 45001 garantit l’absence d’accidents.", v: false,
      e: "La norme donne un cadre pour prévenir les atteintes à la santé et réduire les risques, mais elle ne garantit pas zéro accident." },
    { t: "iso45001", q: "Parmi ces exigences, laquelle figure dans l’ISO 45001 ?",
      o: ["Identifier les dangers et évaluer les risques SST", "Calculer les impôts de l’entreprise", "Mesurer uniquement la satisfaction client", "Certifier tous les produits"], r: 0,
      e: "L’identification des dangers et l’évaluation des risques et opportunités SST sont au cœur de la planification du système." },

    /* ----- Hygiène et environnement ----- */
    { t: "hygiene", q: "Quel geste limite la contamination croisée en cuisine collective ?",
      o: ["Mélanger aliments crus et cuits", "Séparer aliments crus et cuits", "Utiliser le même couteau pour tout", "Laisser les aliments à l’air libre"], r: 1,
      e: "Séparer les crus des cuits (ustensiles, planches, stockage) évite le transfert de microbes vers des aliments prêts à consommer." },
    { t: "hygiene", q: "Les déchets dangereux peuvent être jetés avec les ordures ménagères.", v: false,
      e: "Ils doivent être triés, étiquetés, stockés à part et éliminés par une filière autorisée pour protéger les personnes et l’environnement." },
    { t: "hygiene", q: "Que signifie la règle des 3R ?",
      o: ["Réduire, Réutiliser, Recycler", "Réparer, Remplacer, Racheter", "Retirer, Rejeter, Remplir", "Rincer, Ranger, Reporter"], r: 0,
      e: "Réduire d’abord les déchets à la source, puis réutiliser, enfin recycler ce qui ne peut être ni évité ni réutilisé." },
    { t: "hygiene", q: "Un aliment périssable peut rester plusieurs heures à température ambiante sans risque.", v: false,
      e: "Les bactéries se multiplient vite à température ambiante. Il faut respecter la chaîne du froid pour les denrées périssables." },
    { t: "hygiene", q: "Que trouve-t-on dans une fiche de données de sécurité (FDS) ?",
      o: ["Les dangers d’un produit chimique et la conduite à tenir", "Le prix du produit", "Le planning de maintenance", "Les horaires de travail"], r: 0,
      e: "La FDS décrit les dangers du produit, les précautions de stockage et d’emploi, et les mesures à prendre en cas d’accident ou d’exposition." }
  ];

  let serie = [], i = 0, score = 0, themeCourant = "tous";

  const $ = id => document.getElementById(id);
  const melanger = a => {
    const b = a.slice();
    for (let k = b.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [b[k], b[j]] = [b[j], b[k]];
    }
    return b;
  };

  /** Écran d’accueil : choix du thème. */
  function accueil() {
    zone.innerHTML =
      '<div class="field"><label for="quiz-theme">Thème</label><select id="quiz-theme">' +
      `<option value="tous">Tous les thèmes (${NB_MIXTE} questions au hasard)</option>` +
      Object.keys(THEMES).map(k =>
        `<option value="${k}">${THEMES[k]} (${QUESTIONS.filter(q => q.t === k).length} questions)</option>`).join("") +
      '</select></div><button id="quiz-go" type="button" class="btn">Commencer le quiz</button>';
    $("quiz-theme").value = themeCourant;
    $("quiz-go").onclick = () => demarrer($("quiz-theme").value);
  }

  function demarrer(theme) {
    themeCourant = theme;
    const base = theme === "tous" ? QUESTIONS : QUESTIONS.filter(q => q.t === theme);
    serie = melanger(base).slice(0, theme === "tous" ? NB_MIXTE : base.length);
    i = 0; score = 0;
    question();
  }

  /** Affiche la question en cours. */
  function question() {
    const q = serie[i];
    const opts = q.o || ["Vrai", "Faux"];
    zone.innerHTML =
      `<p class="aide quiz-meta"><span class="pastille quiz-badge">${q.o ? "QCM" : "Vrai ou faux"}</span> ` +
      `${THEMES[q.t]} · Question ${i + 1} / ${serie.length}</p>` +
      `<h3 id="quiz-q" tabindex="-1">${q.q}</h3><div class="quiz-opts">` +
      opts.map((o, k) => `<button type="button" class="quiz-opt" data-k="${k}">${o}</button>`).join("") +
      '</div><div id="quiz-fb" aria-live="polite"></div>';
    zone.querySelectorAll(".quiz-opt").forEach(b => { b.onclick = () => repondre(Number(b.dataset.k)); });
    $("quiz-q").focus();
  }

  /** Correction immédiate avec explication. */
  function repondre(k) {
    const q = serie[i];
    const bon = q.o ? q.r : (q.v ? 0 : 1);
    const ok = k === bon;
    if (ok) score++;
    zone.querySelectorAll(".quiz-opt").forEach((b, n) => {
      b.disabled = true;
      if (n === bon) { b.classList.add("juste"); b.insertAdjacentText("afterbegin", "✔ "); }
      else if (n === k) { b.classList.add("faux"); b.insertAdjacentText("afterbegin", "✘ "); }
    });
    const fin = i === serie.length - 1;
    const bonneRep = q.o ? q.o[q.r] : (q.v ? "Vrai" : "Faux");
    $("quiz-fb").innerHTML =
      `<div class="quiz-expl ${ok ? "juste" : "faux"}"><p><strong>${ok ? "Bonne réponse !" : "Mauvaise réponse."}</strong>` +
      `${ok ? "" : " Réponse correcte : " + bonneRep + "."}</p><p>${q.e}</p></div>` +
      `<button id="quiz-next" type="button" class="btn">${fin ? "Voir mon score" : "Question suivante"}</button>`;
    $("quiz-next").onclick = () => { if (fin) resultat(); else { i++; question(); } };
    $("quiz-next").focus();
  }

  /** Score final. */
  function resultat() {
    const n = serie.length, pct = Math.round(score / n * 100);
    const msg = pct >= 80 ? "Excellent travail !" : pct >= 50 ? "Bien, continuez à réviser." :
      "À revoir : relisez les explications et réessayez.";
    zone.innerHTML =
      `<div class="resultat quiz-score"><p class="score" id="quiz-res" tabindex="-1">Score : ${score} / ${n}</p>` +
      `<p>${pct} % · ${msg}</p></div>` +
      '<div class="actions"><button id="quiz-again" type="button" class="btn">Rejouer</button>' +
      '<button id="quiz-menu" type="button" class="btn btn-sec">Changer de thème</button></div>';
    $("quiz-again").onclick = () => demarrer(themeCourant);
    $("quiz-menu").onclick = accueil;
    $("quiz-res").focus();
  }

  accueil();
})();
