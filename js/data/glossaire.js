/* ==========================================================
   My-QHSE Tools – glossaire.js : « Glossaire QHSE »
   Indépendant d'app.js.

   AJOUTER UN TERME : copiez une ligne { ... } de GLOSSAIRE, collez-la
   n'importe où dans la liste (le tri est automatique), séparez-la des
   autres par une virgule, puis changez :
     t = terme ou sigle, n = signification (facultatif), d = définition.
   Définitions volontairement générales : la réglementation précise
   varie selon les pays.
   ========================================================== */
const GLOSSAIRE = [
  { t: "5 pourquoi", d: "Méthode qui consiste à demander « pourquoi ? » plusieurs fois de suite pour passer du symptôme d’un problème à sa cause profonde." },
  { t: "5M", d: "Les cinq familles de causes du diagramme d’Ishikawa : Main-d’œuvre, Matériel, Méthode, Milieu, Matière." },
  { t: "Accident du travail", d: "Événement survenu par le fait ou à l’occasion du travail et entraînant une lésion. La définition légale précise varie selon les pays." },
  { t: "Action corrective", d: "Action menée pour éliminer la cause d’une non-conformité et empêcher qu’elle ne se reproduise." },
  { t: "Action préventive", d: "Action visant à éliminer la cause d’une non-conformité potentielle. Dans les normes ISO récentes, elle est remplacée par l’approche par les risques et opportunités." },
  { t: "Amélioration continue", d: "Démarche permanente visant à élever le niveau de performance de l’organisme, souvent structurée par le cycle PDCA." },
  { t: "Arbre des causes", d: "Méthode d’analyse d’accident qui remonte aux causes profondes plutôt que de rechercher un coupable." },
  { t: "Aspect environnemental", d: "Élément des activités, produits ou services d’un organisme qui peut interagir avec l’environnement (exemple : rejet d’eaux usées). L’impact est la modification de l’environnement qui en résulte." },
  { t: "Audit de certification", d: "Audit réalisé par un organisme de certification indépendant pour vérifier la conformité du système à une norme avant de délivrer le certificat." },
  { t: "Audit interne", d: "Vérification, menée par l’organisme lui-même, de la conformité et de l’efficacité de son système de management, à l’aide de preuves objectives." },
  { t: "Cause racine", d: "Cause d’origine d’un problème : celle qu’il faut éliminer pour éviter qu’il ne revienne." },
  { t: "Correction", d: "Action immédiate pour éliminer une non-conformité détectée (exemple : isoler un produit défectueux). Elle ne traite pas forcément la cause." },
  { t: "Criticité", d: "Score d’un risque, obtenu en multipliant la probabilité par la gravité (de 1 à 25 dans une matrice 5 × 5)." },
  { t: "Danger", d: "Source potentielle de dommage pour les personnes, les biens ou l’environnement." },
  { t: "Document unique", d: "Document qui consigne les résultats de l’évaluation des risques professionnels, avec le plan d’actions de prévention." },
  { t: "EPI", n: "Équipement de protection individuelle", d: "Équipement qui protège une seule personne (casque, gants, chaussures…). Il vient en dernier recours, après la suppression du danger et les protections collectives." },
  { t: "Évaluation des risques", d: "Démarche structurée pour identifier les dangers, estimer les risques et hiérarchiser les actions de prévention." },
  { t: "FDS", n: "Fiche de données de sécurité", d: "Document qui décrit les dangers d’un produit chimique, les précautions de stockage et d’emploi et la conduite à tenir en cas d’accident." },
  { t: "Gravité", d: "Importance du dommage possible si le risque se réalise. Avec la probabilité, elle sert à calculer le score d’un risque." },
  { t: "Indicateur", d: "Mesure destinée à suivre l’atteinte d’un objectif (exemples : taux de fréquence, nombre d’actions closes dans les délais)." },
  { t: "Ishikawa (diagramme d’)", d: "Diagramme en arêtes de poisson qui classe les causes possibles d’un problème par familles, souvent les 5M." },
  { t: "ISO 9001", n: "Management de la qualité", d: "Norme internationale qui définit les exigences d’un système de management de la qualité." },
  { t: "ISO 14001", n: "Management environnemental", d: "Norme internationale qui définit les exigences d’un système de management environnemental." },
  { t: "ISO 19011", n: "Audit des systèmes de management", d: "Norme qui donne des lignes directrices pour auditer les systèmes de management : principes, programme d’audit, conduite de l’audit, compétence des auditeurs." },
  { t: "ISO 45001", n: "Santé et sécurité au travail", d: "Norme internationale d’exigences pour un système de management de la santé et de la sécurité au travail ; elle a remplacé OHSAS 18001." },
  { t: "Maladie professionnelle", d: "Maladie causée par l’exposition prolongée à un risque lié au métier (bruit, poussières, agents chimiques…). La reconnaissance légale varie selon les pays." },
  { t: "Matrice des risques", d: "Tableau croisant la probabilité et la gravité pour classer les risques par niveau (faible, modéré, élevé, critique)." },
  { t: "Non-conformité (NC)", d: "Non-satisfaction d’une exigence (norme, réglementation, procédure, client). Elle doit être enregistrée, corrigée, puis sa cause doit être analysée." },
  { t: "Pareto (diagramme de)", d: "Diagramme qui classe les causes par importance pour repérer les quelques-unes qui expliquent l’essentiel des problèmes (principe 80/20)." },
  { t: "Parties intéressées", d: "Personnes ou organismes qui peuvent influencer les activités de l’organisme ou en être affectés : clients, personnel, autorités, riverains…" },
  { t: "PDCA", n: "Plan – Do – Check – Act", d: "Cycle d’amélioration continue (roue de Deming) : planifier, mettre en œuvre, vérifier les résultats, puis agir pour standardiser ou corriger." },
  { t: "Politique QHSE", d: "Engagement formel de la direction sur ses intentions et ses orientations en matière de qualité, de santé-sécurité et d’environnement." },
  { t: "Presque-accident", d: "Événement qui aurait pu causer un dommage mais n’en a pas causé. Sa déclaration et son analyse permettent d’agir avant l’accident." },
  { t: "Probabilité", d: "Chance qu’un événement dangereux se produise. Avec la gravité, elle sert à calculer le score d’un risque." },
  { t: "Protection collective", d: "Mesure qui protège plusieurs personnes à la fois (garde-corps, ventilation…). Elle est prioritaire sur les EPI." },
  { t: "QHSE", n: "Qualité, Hygiène, Sécurité, Environnement", d: "Ensemble des démarches visant à maîtriser ces quatre dimensions au sein d’une organisation." },
  { t: "QQOQCP", n: "Quoi, Qui, Où, Quand, Comment, Pourquoi", d: "Outil de questionnement pour décrire complètement une situation ou un problème." },
  { t: "Revue de direction", d: "Réunion planifiée où la direction examine les résultats du système de management, les ressources et les opportunités d’amélioration, puis prend des décisions." },
  { t: "Risque", d: "Combinaison de la probabilité qu’un événement dangereux se produise et de la gravité de ses conséquences. À ne pas confondre avec le danger." },
  { t: "SGH", n: "Système général harmonisé", d: "Système international de classification et d’étiquetage des produits chimiques (pictogrammes, mentions de danger)." },
  { t: "SMI", n: "Système de management intégré", d: "Système qui regroupe plusieurs référentiels (qualité, environnement, SST) avec une politique, des audits internes et une revue de direction communs." },
  { t: "SST", n: "Santé et sécurité au travail", d: "Ensemble des mesures qui protègent la santé physique et mentale des personnes au travail." },
  { t: "Structure de haut niveau", d: "Architecture commune des normes ISO de management (contexte, leadership, planification, support, réalisation, évaluation, amélioration) qui facilite leur intégration." },
  { t: "Taux de fréquence (TF)", d: "Nombre d’accidents avec arrêt par million d’heures travaillées. Formule usuelle : TF = nombre d’accidents × 1 000 000 ÷ heures travaillées." },
  { t: "Taux de gravité (TG)", d: "Nombre de journées d’arrêt par millier d’heures travaillées. Formule usuelle : TG = journées perdues × 1 000 ÷ heures travaillées." },
  { t: "Veille réglementaire", d: "Surveillance régulière des textes applicables à l’organisme pour détecter les nouveautés et en déduire des actions." }
];

(function () {
  "use strict";
  if (typeof document === "undefined") return;
  const liste = document.getElementById("gl-liste");
  if (!liste) return;
  const $ = id => document.getElementById(id);
  /** Minuscules sans accents : « evaluation » trouve « Évaluation ». */
  const norm = t => String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const tries = GLOSSAIRE.slice().sort((a, b) => norm(a.t).localeCompare(norm(b.t), "fr", { numeric: true }));

  function afficher() {
    const mot = norm($("gl-recherche").value.trim());
    const ok = tries.filter(g => !mot || norm(g.t + " " + (g.n || "") + " " + g.d).includes(mot));
    liste.textContent = "";
    ok.forEach(g => {
      const det = document.createElement("details"); det.className = "gl-item";
      const sum = document.createElement("summary");
      const b = document.createElement("strong"); b.textContent = g.t;
      sum.appendChild(b);
      if (g.n) sum.append(" – " + g.n);
      const p = document.createElement("p"); p.textContent = g.d;
      det.append(sum, p); liste.appendChild(det);
    });
    $("gl-vide").hidden = ok.length > 0;
    $("gl-compte").textContent = ok.length + " terme" + (ok.length > 1 ? "s" : "") + (mot ? " trouvé" + (ok.length > 1 ? "s" : "") : " dans le glossaire");
  }
  $("gl-recherche").addEventListener("input", afficher);
  afficher();
})();
