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
    hygiene: "Hygiène et environnement",
    methodes: "Méthodes d’analyse des risques",
    management: "Systèmes de management QHSE",
    reglementation: "Réglementation et prévention"
  };
  const NB_QUIZ = 15; // questions tirées au hasard par partie (toutes si le thème en contient moins)

  // Catalogue des 50 thèmes : [identifiant, nom]. Un thème apparaît dans le menu dès qu’il contient des questions.
  const FAMILLES = [
    ["base", "Thèmes de base", Object.keys(THEMES).map(k => [k, THEMES[k]])],
    ["mgmt", "Management QHSE", [["t01", "Systèmes de management intégrés"], ["t02", "Structure de haut niveau des normes ISO"], ["t03", "PDCA et amélioration continue"], ["t04", "Politique QHSE et leadership"], ["t05", "Approche processus et cartographie"], ["t06", "Indicateurs et tableaux de bord"], ["t07", "Informations documentées"], ["t08", "Audit interne"], ["t09", "Revue de direction"], ["t10", "Non-conformités et actions correctives"]]],
    ["qual", "Qualité", [["t11", "ISO 9001 : exigences"], ["t12", "Satisfaction client et réclamations"], ["t13", "Achats et évaluation des fournisseurs"], ["t14", "Contrôle qualité et produits non conformes"], ["t15", "Outils de la qualité"], ["t16", "Métrologie"], ["t17", "Lean et 5S"], ["t18", "Certification et accréditation"]]],
    ["sst", "Santé et sécurité", [["t19", "ISO 45001 : exigences"], ["t20", "Dangers et risques professionnels"], ["t21", "Évaluation des risques"], ["t22", "Hiérarchie de prévention"], ["t23", "EPI et signalisation"], ["t24", "Accidents du travail et maladies professionnelles"], ["t25", "Analyse d’accident (arbre des causes)"], ["t26", "Risques chimiques et FDS"], ["t27", "Risques électriques"], ["t28", "Travail en hauteur et levage"], ["t29", "Manutention, ergonomie et TMS"], ["t30", "Incendie et évacuation"], ["t31", "Permis de travail et consignation"], ["t32", "Risques psychosociaux"]]],
    ["hyg", "Hygiène", [["t33", "Hygiène des aliments (HACCP)"], ["t34", "Nettoyage et désinfection"], ["t35", "Eau potable et assainissement"], ["t36", "Ambiances de travail (bruit, éclairage, chaleur)"], ["t37", "Premiers secours"]]],
    ["env", "Environnement", [["t38", "ISO 14001 : exigences"], ["t39", "Aspects et impacts environnementaux"], ["t40", "Gestion des déchets"], ["t41", "Pollution de l’eau, de l’air et du sol"], ["t42", "Énergie"], ["t43", "Changement climatique et empreinte carbone"], ["t44", "Économie circulaire et 3R"]]],
    ["trans", "Transversal", [["t45", "Réglementation et veille"], ["t46", "Retour d’expérience (REX)"], ["t47", "Gestion de crise et plans d’urgence"], ["t48", "Culture de sécurité"], ["t49", "Compétences et formation"], ["t50", "Gestion des risques et opportunités"]]],
    ["img", "Quiz en images (Livret sécurité)", [["img01", "Livret sécurité : panneaux et pictogrammes"], ["img02", "Livret sécurité : gestes, postures et étiquettes"]]],
  ];
  FAMILLES.forEach(f => f[2].forEach(t => { THEMES[t[0]] = t[1]; }));

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
      e: "La FDS décrit les dangers du produit, les précautions de stockage et d’emploi, et les mesures à prendre en cas d’accident ou d’exposition." },

    /* ----- Sécurité au travail (suite) ----- */
    { t: "securite", q: "Un presque-accident déclaré est un indicateur « avancé » : il permet d’agir avant qu’un accident ne survienne.", v: true,
      e: "Les presque-accidents déclarés et les visites de sécurité sont des indicateurs avancés (voir le sujet 15 de la bibliothèque)." },
    { t: "securite", q: "Une culture de sécurité efficace repose sur la crainte d’être sanctionné lorsqu’on signale un incident.", v: false,
      e: "Il faut au contraire un climat de confiance : chacun doit pouvoir signaler un danger ou un presque-accident sans crainte de sanction (sujet 9)." },

    /* ----- Analyse des risques (suite) ----- */
    { t: "risques", q: "Avec les seuils provisoires de cette application, quel est le niveau d’un risque de probabilité 4 et de gravité 5 ?",
      o: ["Modéré", "Élevé", "Critique", "Faible"], r: 2,
      e: "4 × 5 = 20, ce qui correspond au niveau « Critique » (17 à 25) avec les seuils provisoires de l’application." },
    { t: "risques", q: "Laquelle de ces options ne fait PAS partie du traitement d’un risque ?",
      o: ["Éliminer", "Réduire", "Transférer", "L’ignorer volontairement"], r: 3,
      e: "On peut éliminer, réduire, transférer ou accepter un risque (de façon consciente), mais pas l’ignorer (sujet 3)." },

    /* ----- Hygiène et environnement (suite) ----- */
    { t: "hygiene", q: "Quelle hiérarchie de traitement des déchets est correcte ?",
      o: ["Éliminer, puis recycler, puis réutiliser", "Prévenir, réutiliser, recycler, valoriser, et éliminer en dernier recours", "Valoriser, éliminer, puis prévenir", "Recycler uniquement"], r: 1,
      e: "On agit d’abord pour ne pas produire de déchets, puis on réutilise, recycle et valorise ; l’élimination est le dernier recours (sujet 10)." },
    { t: "hygiene", q: "Les bordereaux de suivi permettent d’assurer la traçabilité des déchets dangereux.", v: true,
      e: "Avec le tri à la source, le stockage sur rétention et les filières agréées, ils font partie de la maîtrise des déchets (sujet 10)." },

    /* ----- Méthodes d’analyse des risques ----- */
    { t: "methodes", q: "À quoi sert la méthode des « 5 pourquoi » ?",
      o: ["À calculer le score d’un risque", "À planifier un audit", "À remonter du symptôme à la cause profonde en demandant « pourquoi ? » à plusieurs reprises", "À classer les produits chimiques"], r: 2,
      e: "On répète « pourquoi ? » pour dépasser le symptôme et atteindre la cause d’origine, sur laquelle on peut agir durablement." },
    { t: "methodes", q: "Quel outil représente les causes d’un problème en « arêtes de poisson » ?",
      o: ["Le diagramme de Pareto", "Le diagramme d’Ishikawa", "L’histogramme", "Le diagramme de Gantt"], r: 1,
      e: "Le diagramme d’Ishikawa classe les causes par familles, souvent les 5M : main-d’œuvre, matériel, méthode, milieu, matière." },
    { t: "methodes", q: "Le diagramme de Pareto aide à repérer les quelques causes qui expliquent l’essentiel des problèmes.", v: true,
      e: "Selon le principe des 80/20, une minorité de causes produit la majorité des effets : on concentre les actions sur elles." },
    { t: "methodes", q: "À quoi sert l’arbre des causes ?",
      o: ["À établir un organigramme", "À calculer le taux de fréquence", "À planifier la formation", "À analyser un accident en remontant à ses causes profondes"], r: 3,
      e: "Cette méthode d’analyse d’accident remonte aux causes profondes (sujet 5)." },
    { t: "methodes", q: "L’analyse d’un accident a pour but premier de trouver un coupable.", v: false,
      e: "Elle cherche les causes profondes pour les corriger, plutôt que de rechercher un coupable (sujet 5)." },
    { t: "methodes", q: "Que signifie la méthode QQOQCP ?",
      o: ["Qualité, Quantité, Organisation, Quotas, Coûts, Prix", "Quoi, Qui, Où, Quand, Comment, Pourquoi", "Quand, Quorum, Objectifs, Qualité, Coût, Planning", "Quel, Quoi, Ordre, Quota, Contrôle, Plan"], r: 1,
      e: "C’est un outil de questionnement qui permet de décrire complètement une situation ou un problème." },

    /* ----- Systèmes de management QHSE ----- */
    { t: "management", q: "Comment appelle-t-on l’architecture commune aux normes ISO 9001, 14001 et 45001 ?",
      o: ["La structure de haut niveau", "Le cycle de vie", "La matrice 5 × 5", "Le plan d’urgence"], r: 0,
      e: "Cette structure (contexte, leadership, planification, support, réalisation, évaluation, amélioration) facilite l’intégration des trois systèmes." },
    { t: "management", q: "Dans un système intégré, la politique, les audits internes et la revue de direction peuvent être mutualisés.", v: true,
      e: "Seules les exigences spécifiques de chaque norme restent distinctes (sujet 2)." },
    { t: "management", q: "Dans le cycle PDCA, quelle phase consiste à mesurer les résultats et à les comparer aux objectifs ?",
      o: ["Plan", "Do", "Check", "Act"], r: 2,
      e: "Plan : planifier. Do : mettre en œuvre. Check : mesurer et comparer. Act : standardiser ou corriger, puis relancer un cycle." },
    { t: "management", q: "Le leadership d’un système QHSE peut être entièrement délégué au responsable QHSE.", v: false,
      e: "Sans engagement visible et constant de la direction, aucun système ne peut durer (sujet 14)." },
    { t: "management", q: "Quel est le rôle de la revue de direction ?",
      o: ["Remplacer les audits internes", "Sanctionner les services peu performants", "Rédiger les fiches de poste", "Examiner à intervalles planifiés les résultats du système et décider des améliorations"], r: 3,
      e: "Elle examine les résultats, les ressources et les opportunités d’amélioration, puis prend des décisions (sujet 14)." },
    { t: "management", q: "Lequel de ces indicateurs est un indicateur de résultat en matière de sécurité ?",
      o: ["Le nombre de formations réalisées", "Le taux de fréquence des accidents", "Le nombre d’audits menés", "Le nombre d’actions closes dans les délais"], r: 1,
      e: "Le taux de fréquence (comme le taux de gravité) mesure un résultat. Les autres propositions sont des indicateurs de moyens ou de processus (sujet 15)." },

    /* ----- Réglementation et prévention ----- */
    { t: "reglementation", q: "Ignorer une obligation légale par méconnaissance exonère l’organisme de toute sanction.", v: false,
      e: "Même par méconnaissance, l’organisme s’expose à des sanctions, à des arrêts d’activité et à la mise en cause de la responsabilité de ses dirigeants (sujet 16)." },
    { t: "reglementation", q: "À quoi sert un registre réglementaire ?",
      o: ["À enregistrer les salaires du personnel", "À recenser les exigences applicables, leur statut et les responsables", "À lister les clients", "À archiver les factures"], r: 1,
      e: "Il permet de suivre les exigences légales et autres exigences, leur état d’application et les personnes responsables (sujet 16)." },
    { t: "reglementation", q: "À quelle fréquence minimale organiser des exercices d’évacuation ?",
      o: ["Une fois tous les cinq ans", "Seulement après un accident", "Jamais, si les plans sont affichés", "Au moins une fois par an"], r: 3,
      e: "Selon le sujet 12 de la bibliothèque, des exercices réguliers, au moins annuels, testent les procédures et révèlent les failles. Un retour d’expérience suit chaque exercice." },
    { t: "reglementation", q: "La veille réglementaire consiste à surveiller régulièrement les nouveaux textes applicables à l’organisme.", v: true,
      e: "Elle s’appuie sur des sources fiables et permet d’analyser l’impact de chaque texte, puis de le traduire en actions (sujet 16)." },
    { t: "reglementation", q: "Être certifié ISO dispense de respecter la réglementation applicable.", v: false,
      e: "Les normes de management exigent au contraire de respecter les obligations légales applicables : la certification ne remplace pas la loi." }
  ];

  (window.QHSE_BANQUES || []).forEach(b => b.forEach(q => QUESTIONS.push(q))); // questions des fichiers banque-*.js

  let serie = [], i = 0, score = 0, debut = 0, choix = { f: "tous", t: "tous" }, courant = null, reps = [], reprise = false;

  const $ = id => document.getElementById(id);
  const melanger = a => {
    const b = a.slice();
    for (let k = b.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [b[k], b[j]] = [b[j], b[k]];
    }
    return b;
  };

  /** Propositions d’une question : QCM mélangé (on suit la bonne réponse), Vrai/Faux toujours Vrai puis Faux. */
  function preparer(q) {
    if (!q.o) return { opts: ["Vrai", "Faux"], bon: q.v ? 0 : 1 };
    const ordre = melanger(q.o.map((_, n) => n));
    return { opts: ordre.map(n => q.o[n]), bon: ordre.indexOf(q.r) };
  }

  /** Mémoire des questions déjà vues sur cet appareil (facultative : si elle est indisponible, le tirage reste aléatoire). */
  const CLE_VUES = "myqhse_quiz_vues";
  const lireVues = () => { try { return JSON.parse(localStorage.getItem(CLE_VUES)) || []; } catch (e) { return []; } };
  const ecrireVues = v => { try { localStorage.setItem(CLE_VUES, JSON.stringify(v.slice(-300))); } catch (e) {} };

  /** Familles avec leurs thèmes qui contiennent au moins une question. */
  const disponibles = () => FAMILLES
    .map(f => [f[0], f[1], f[2].filter(t => QUESTIONS.some(q => q.t === t[0]))])
    .filter(f => f[2].length);
  const nbQ = th => QUESTIONS.filter(q => q.t === th).length;

  /* ---------- Historique des quiz terminés + relecture ---------- */
  const CLE_HIST = "myqhse_quiz_historique";
  /** Image d’une question : version intégrée (images-livret.js) sinon fichier du dossier img/. */
  const srcImg = p => (window.QHSE_IMAGES && window.QHSE_IMAGES[p]) || p;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = ts => { try { return new Date(ts).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }); } catch (e) { return ""; } };
  let histOk = true;   // false si le navigateur refuse d’enregistrer (navigation privée, stockage plein ou bloqué)
  const lireHist = () => {
    try {
      const h = JSON.parse(localStorage.getItem(CLE_HIST));
      return Array.isArray(h) ? h.filter(e => e && typeof e.date === "number" && e.total > 0 && Array.isArray(e.rep)) : [];
    } catch (e) { return []; }
  };
  const ecrireHist = h => {
    for (let n = h.length; n > 0; n--) {          // si le stockage est plein, on retire les plus anciens
      try { localStorage.setItem(CLE_HIST, JSON.stringify(h.slice(-n))); return true; } catch (e) { /* on réessaie avec moins */ }
    }
    return false;
  };
  /** Enregistre (ou met à jour) le quiz en cours : à chaque réponse, puis à la fin. La date de début sert d’identifiant. */
  function sauverHist(fini) {
    const fam = FAMILLES.find(f => f[0] === choix.f);
    const n = reps.length;
    const e = { date: debut, theme: (choix.t !== "tous" ? THEMES[choix.t] : (fam ? fam[1] : "Tous les thèmes")) + (reprise ? " (erreurs refaites)" : ""),
      score: score, total: n, prevu: serie.length, partiel: !fini || n < serie.length, rep: reps.slice() };
    if (n > 0) histOk = ecrireHist(lireHist().filter(x => x.date !== debut).concat([e]).slice(-30));
    majOnglet();
    return e;
  }

  /** Relecture : toutes les questions avec votre réponse, la bonne réponse et l’explication. */
  function relecture(e, retour) {
    let erreurs = false;
    const dessiner = () => {
      const l = e.rep.map((r, n) => [r, n]).filter(x => !erreurs || x[0].c !== x[0].b);
      zone.innerHTML =
        `<h3 id="quiz-rel" tabindex="-1">Relecture · ${esc(e.theme)}</h3>` +
        `<p class="aide">${fmt(e.date)} · Score ${e.score} / ${e.total}</p>` +
        '<div class="actions"><button id="rel-filtre" type="button" class="btn btn-sec">' +
        (erreurs ? "Voir toutes les questions" : "Voir mes erreurs seulement") + '</button>' +
        '<button id="rel-retour" type="button" class="btn btn-sec">Retour</button></div>' +
        (l.length ? l.map(([r, n]) =>
          `<div class="quiz-rel-item"><p class="aide">Question ${n + 1} · ${r.c === r.b ? "✔ juste" : "✘ à revoir"}</p><h4>${esc(r.q)}</h4>${r.i ? `<img class="quiz-img" src="${esc(srcImg(r.i))}" alt="Image non chargée">` : ""}<ul class="quiz-rel-opts">` +
          r.o.map((o, k) => `<li class="${k === r.b ? "juste" : k === r.c ? "faux" : ""}">${k === r.b ? "✔ " : k === r.c ? "✘ " : ""}${esc(o)}${k === r.c && k !== r.b ? " (votre réponse)" : ""}</li>`).join("") +
          `</ul><p class="quiz-expl ${r.c === r.b ? "juste" : "faux"}">${esc(r.e)}</p></div>`).join("")
          : '<p class="aide">Aucune erreur dans ce quiz : toutes les réponses étaient justes.</p>');
      $("rel-filtre").onclick = () => { erreurs = !erreurs; dessiner(); };
      $("rel-retour").onclick = retour;
      $("quiz-rel").focus();
    };
    dessiner();
  }

  /** Lignes de l’historique (les plus récentes d’abord) et boutons « Relire ». */
  const lignesHist = h => '<ul class="quiz-hist">' + h.map(e =>
    `<li><div><strong>${esc(e.theme)}</strong><br><span class="aide">${fmt(e.date)} · ${e.score} / ${e.total} (${Math.round(e.score / e.total * 100)} %)` +
    `${e.partiel ? " · arrêté (" + e.total + "/" + (e.prevu || e.total) + " questions)" : ""}</span></div>` +
    `<button type="button" class="btn btn-sec" data-d="${e.date}">Relire</button></li>`).join("") + '</ul>';
  const lierLignes = (cont, retour) => cont.querySelectorAll("[data-d]").forEach(b => { b.onclick = () => {
    const e = lireHist().find(x => String(x.date) === b.dataset.d);
    if (!e) return;
    const o = document.querySelector('.onglet[data-ecran="quiz"]'); if (o) o.click();   // ouvre l’onglet Quiz si on vient de Historique
    relecture(e, retour);
  }; });
  /** Copie de l’historique dans l’onglet « Historique » de l’application. */
  function majOnglet() {
    const c = $("hist-quiz-liste");
    if (!c) return;
    const h = lireHist().slice().reverse();
    c.innerHTML = h.length ? lignesHist(h) : '<p class="aide">Aucun quiz enregistré pour l’instant. Répondez à une question du quiz : il apparaîtra ici.</p>';
    lierLignes(c, historique);
  }

  /** Liste des quiz déjà terminés (les plus récents d’abord). */
  function historique() {
    const h = lireHist().slice().reverse();
    zone.innerHTML = '<h3 id="quiz-hh" tabindex="-1">Historique des quiz</h3>' +
      (h.length ? lignesHist(h) + '<button id="hist-vider" type="button" class="btn btn-sec">Effacer l’historique</button> '
        : '<p class="aide">Aucun quiz terminé pour l’instant. Terminez un quiz : il apparaîtra ici avec ses corrections.</p>') +
      '<button id="hist-retour" type="button" class="btn">Retour au quiz</button>';
    lierLignes(zone, historique);
    const v = $("hist-vider");
    if (v) v.onclick = () => { if (confirm("Effacer tout l’historique des quiz de cet appareil ?")) { try { localStorage.removeItem(CLE_HIST); } catch (e) {} majOnglet(); historique(); } };
    $("hist-retour").onclick = accueil;
    $("quiz-hh").focus();
  }

  /** Écran d’accueil : choix de la famille, puis du thème. */
  function accueil() {
    const fams = disponibles();
    const themesDe = fam => fam === "tous" ? [].concat(...fams.map(f => f[2])) : (fams.find(f => f[0] === fam) || [0, 0, []])[2];
    zone.innerHTML =
      '<div class="field"><label for="quiz-fam">Famille</label><select id="quiz-fam"><option value="tous">Toutes les familles</option>' +
      fams.map(f => `<option value="${f[0]}">${f[1]}</option>`).join("") + '</select></div>' +
      '<div class="field"><label for="quiz-theme">Thème</label><select id="quiz-theme"></select></div>' +
      '<div class="field"><label for="quiz-nb">Nombre de questions</label><select id="quiz-nb"><option value="10">10 questions</option><option value="15">15 questions</option><option value="20">20 questions</option></select></div>' +
      '<div class="actions"><button id="quiz-go" type="button" class="btn">Commencer le quiz</button>' +
      `<button id="quiz-hist" type="button" class="btn btn-sec">Historique (${lireHist().length})</button></div>`;
    const remplir = () => {
      const ths = themesDe($("quiz-fam").value);
      const total = ths.reduce((s, t) => s + nbQ(t[0]), 0);
      $("quiz-theme").innerHTML = `<option value="tous">Tous les thèmes (${Math.min(Number($("quiz-nb").value), total)} questions au hasard)</option>` +
        ths.map(t => `<option value="${t[0]}">${t[1]} (${nbQ(t[0])} questions)</option>`).join("");
    };
    $("quiz-nb").value = String(choix.n || NB_QUIZ);
    $("quiz-fam").value = choix.f; if (!$("quiz-fam").value) $("quiz-fam").value = "tous";
    remplir();
    $("quiz-theme").value = choix.t; if (!$("quiz-theme").value) $("quiz-theme").value = "tous";
    $("quiz-nb").onchange = () => { const t = $("quiz-theme").value; remplir(); $("quiz-theme").value = t; };
    $("quiz-fam").onchange = remplir;
    $("quiz-hist").onclick = historique;
    $("quiz-go").onclick = () => demarrer({ f: $("quiz-fam").value, t: $("quiz-theme").value, n: Number($("quiz-nb").value) });
  }

  /** Tirage aléatoire : questions jamais vues d’abord, puis les plus anciennes ; ordre de passage mélangé. */
  function demarrer(c, imposee) {
    choix = c;
    const ths = c.t !== "tous" ? [c.t] :
      [].concat(...disponibles().filter(f => c.f === "tous" || f[0] === c.f).map(f => f[2].map(t => t[0])));
    const base = QUESTIONS.filter(q => ths.indexOf(q.t) !== -1);
    const vues = lireVues();
    const rang = q => vues.lastIndexOf(q.q); // -1 = jamais vue
    const choisies = imposee || melanger(base).sort((a, b) => rang(a) - rang(b)).slice(0, Math.min(c.n || NB_QUIZ, base.length));
    serie = melanger(choisies);
    const ids = serie.map(q => q.q);
    ecrireVues(vues.filter(t => ids.indexOf(t) === -1).concat(ids));
    reprise = !!imposee;
    i = 0; score = 0; reps = []; debut = Date.now();
    question();
  }

  /** Affiche la question en cours. */
  function question() {
    const q = serie[i];
    courant = preparer(q);
    const opts = courant.opts;
    zone.innerHTML =
      `<p class="aide quiz-meta"><span class="pastille quiz-badge">${q.o ? "QCM" : "Vrai ou faux"}</span> ` +
      `${THEMES[q.t]} · Question ${i + 1} / ${serie.length}</p>` +
      `<h3 id="quiz-q" tabindex="-1">${q.q}</h3>` +
      (q.img ? `<img class="quiz-img" src="${esc(srcImg(q.img))}" alt="Image non chargée : vérifiez le dossier img/ ou images-livret.js">` : "") + '<div class="quiz-opts">' +
      opts.map((o, k) => `<button type="button" class="quiz-opt" data-k="${k}">${o}</button>`).join("") +
      '</div><div id="quiz-fb" aria-live="polite"></div>' +
      '<div class="actions quiz-fin"><button id="quiz-stop" type="button" class="btn btn-sec">Terminer le quiz</button></div>';
    $("quiz-stop").onclick = terminer;
    zone.querySelectorAll(".quiz-opt").forEach(b => { b.onclick = () => repondre(Number(b.dataset.k)); });
    $("quiz-q").focus();
  }

  /** Arrêt anticipé : le score porte sur les questions déjà traitées, et le quiz est conservé dans l’historique. */
  function terminer() {
    if (!reps.length) {
      if (confirm("Aucune question n’a encore reçu de réponse : rien ne sera enregistré. Quitter ce quiz ?")) accueil();
      return;
    }
    if (!confirm("Terminer maintenant ? Votre score sera enregistré avec les " + reps.length + " question(s) déjà traitée(s).")) return;
    afficherResultat(sauverHist(true));
  }

  /** Correction immédiate avec explication. */
  function repondre(k) {
    const q = serie[i];
    const bon = courant.bon;
    const ok = k === bon;
    if (ok) score++;
    reps.push({ q: q.q, o: courant.opts.slice(), b: bon, c: k, e: q.e, i: q.img || "" });
    sauverHist(false);
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

  /** Envoi anonyme du résultat au backend (via cloud-sync.js). Ne doit jamais perturber le quiz. */
  function envoyerResultat(n) {
    try {
      const fam = FAMILLES.find(f => f[0] === choix.f);
      const theme = choix.t !== "tous" ? THEMES[choix.t] : (fam ? fam[1] : "Tous les thèmes");
      window.dispatchEvent(new CustomEvent("qhse:quiz-finished", { detail: {
        theme: theme, score: score, total: n, correctCount: score, wrongCount: n - score,
        durationSeconds: Math.min(86400, Math.round((Date.now() - debut) / 1000)) } }));
    } catch (e) { /* le quiz continue sans synchronisation */ }
  }

  /** Score final. */
  function resultat() {
    const n = serie.length;
    if (!reprise) envoyerResultat(n);   // les séries « erreurs refaites » ou arrêtées ne faussent pas les statistiques
    afficherResultat(sauverHist(true));
  }

  function afficherResultat(entree) {
    const n = entree.total, sc = entree.score, pct = Math.round(sc / n * 100);
    const msg = pct >= 80 ? "Excellent travail !" : pct >= 50 ? "Bien, continuez à réviser." :
      "À revoir : relisez les explications et réessayez.";
    const nbErr = n - sc;
    zone.innerHTML =
      `<div class="resultat quiz-score"><p class="score" id="quiz-res" tabindex="-1">Score : ${sc} / ${n}</p>` +
      `<p>${pct} % · ${msg}</p>` + (entree.partiel ? `<p>Quiz arrêté : ${n} question(s) sur ${entree.prevu}.</p>` : "") + "</div>" +
      (histOk ? "" : '<p class="erreur" role="alert">Impossible d’enregistrer l’historique sur cet appareil (stockage bloqué ou plein, navigation privée ?). Le score reste affiché ici.</p>') +
      '<div class="actions"><button id="quiz-rel-go" type="button" class="btn">Relire mes réponses</button>' +
      (nbErr ? '<button id="quiz-err" type="button" class="btn">Refaire mes erreurs (' + nbErr + ')</button>' : '') +
      '<button id="quiz-again" type="button" class="btn btn-sec">Rejouer</button>' +
      '<button id="quiz-menu" type="button" class="btn btn-sec">Changer de thème</button></div>';
    $("quiz-rel-go").onclick = () => relecture(entree, () => afficherResultat(entree));
    if (nbErr) $("quiz-err").onclick = () => demarrer(choix, serie.filter((_, n) => reps[n] && reps[n].c !== reps[n].b));
    $("quiz-again").onclick = () => demarrer(choix);
    $("quiz-menu").onclick = accueil;
    $("quiz-res").focus();
  }

  accueil();
  majOnglet();   // affiche l’historique dans l’onglet « Historique »

  // Synchronisation centrale des résultats (facultative : le quiz fonctionne sans).
  try { const s = document.createElement("script"); s.src = "js/cloud-sync.js"; s.async = true; document.head.appendChild(s); } catch (e) { /* ignoré */ }
})();
