/* ==========================================================
   My-QHSE Tools – checklists-data-3.js : thèmes 8 à 10
   Même structure que checklists-data-1.js (voir l'explication en tête de ce fichier).
   C(question, situation, reponse "oui"|"non"|"na", explication, action corrective)
   ========================================================== */
(function () {
  "use strict";
  var L = window.QHSE_CHECKLISTS = window.QHSE_CHECKLISTS || [];
  function C(q, s, r, e, a) { return { q: q, s: s, r: r, e: e, a: a || "" }; }

  /* ---------------------------------------------------------- 8 */
  L.push({
    id: "environnement", num: 8,
    titre: "Environnement et gestion des déchets",
    presentation: "La gestion environnementale d'un site consiste à connaître ses déchets, ses rejets et ses émissions, à les réduire, à les trier, à les stocker et les éliminer par des filières adaptées, et à prévenir la pollution des sols, de l'eau et de l'air.",
    objectif: "Vérifier que les déchets sont triés, stockés et éliminés correctement avec traçabilité, que les sols et les eaux sont protégés, que les émissions sont maîtrisées et que les déversements sont prévenus.",
    contexte: "Vous auditez une unité de production agroalimentaire et mécanique avec une zone de stockage de déchets, une cuve de carburant, un atelier de maintenance et des rejets d'eaux de lavage.",
    infos: [
      "Hiérarchie de gestion des déchets : réduire, réutiliser, recycler, valoriser, puis éliminer.",
      "Les déchets dangereux (huiles usagées, batteries, solvants) ne se mélangent pas avec les déchets ordinaires.",
      "Un bordereau ou une preuve d'enlèvement permet de justifier la destination d'un déchet."
    ],
    categories: [
      { id: "tri", nom: "Tri et stockage des déchets", criteres: [
        C("Les déchets sont-ils triés à la source en catégories identifiées ?",
          "Des bacs distincts et étiquetés (papier, plastique, métal, organique, dangereux) sont installés dans chaque zone, avec des pictogrammes.",
          "oui", "Le tri à la source facilite le recyclage et évite que des déchets dangereux souillent des déchets ordinaires."),
        C("Les déchets dangereux sont-ils séparés des déchets ordinaires ?",
          "Des chiffons imbibés d'huile et des batteries usagées sont jetés dans la benne des ordures ménagères.",
          "non", "Les déchets dangereux polluent les déchets ordinaires et exposent le personnel et l'environnement.",
          "Prévoir des contenants dédiés pour déchets dangereux, former le personnel et les faire enlever par une filière agréée."),
        C("Le lieu de stockage des déchets est-il aménagé (sol étanche, couvert, accès limité) ?",
          "Les fûts d'huile usagée sont stockés à l'air libre, sur de la terre nue, sans toit ni bac de rétention.",
          "non", "La pluie et les fuites entraînent l'huile dans le sol et les eaux.",
          "Aménager une aire de stockage étanche, couverte, avec rétention et accès contrôlé."),
        C("Les contenants de déchets sont-ils étiquetés et en bon état ?",
          "Chaque contenant porte une étiquette (nature du déchet, date de début de stockage) et reste fermé quand il n'est pas utilisé.",
          "oui", "Un contenant étiqueté, fermé et en bon état évite les erreurs de tri et les nuisances."),
        C("Les quantités de déchets sont-elles suivies et réduites ?",
          "Le site pèse ses déchets chaque mois et a réduit les emballages à usage unique grâce à un accord avec ses fournisseurs.",
          "oui", "Mesurer permet de fixer un objectif et de vérifier que la réduction à la source progresse.")
      ]},
      { id: "elimination", nom: "Élimination et traçabilité", criteres: [
        C("Les déchets sont-ils confiés à des prestataires autorisés ?",
          "Les huiles usagées sont reprises par un transporteur occasionnel qui n'a pas d'autorisation ; l'entreprise ignore où elles sont déposées.",
          "non", "L'entreprise reste responsable de ses déchets jusqu'à leur élimination finale : un prestataire non autorisé peut les déverser illégalement.",
          "Choisir un prestataire autorisé, contrôler son agrément et demander une preuve d'élimination."),
        C("Des bordereaux ou preuves d'enlèvement sont-ils conservés ?",
          "Pour chaque enlèvement de déchets dangereux, un bordereau signé est classé avec la date, la nature et la quantité.",
          "oui", "Le bordereau prouve que le déchet a été pris en charge par une filière adaptée."),
        C("Les déchets organiques et les déchets biodégradables sont-ils valorisés ou traités ?",
          "Les déchets organiques de la cantine sont envoyés vers un composteur surveillé et le compost est réutilisé pour les espaces verts.",
          "oui", "Valoriser les déchets organiques réduit les volumes à éliminer et les nuisances."),
        C("Les déchets sont-ils brûlés à l'air libre ?",
          "Des plastiques et des chiffons sont brûlés régulièrement derrière l'atelier pour « faire de la place ».",
          "non", "Le brûlage à l'air libre émet des fumées toxiques et pollue l'air et les sols.",
          "Interdire le brûlage, mettre en place des filières de collecte et sensibiliser le personnel.")
      ]},
      { id: "sols_eaux", nom: "Protection des sols et des eaux", criteres: [
        C("Les eaux usées sont-elles traitées ou évacuées selon les exigences applicables ?",
          "Les eaux de lavage de l'atelier, chargées d'huile et de détergents, s'écoulent directement dans un fossé voisin.",
          "non", "Les eaux de lavage polluées contaminent les eaux et les sols : elles doivent être traitées avant rejet.",
          "Installer un séparateur d'hydrocarbures ou un bassin de décantation et contrôler la qualité des rejets."),
        C("Les cuves de carburant sont-elles sur rétention et protégées ?",
          "La cuve de gasoil est installée dans une cuvette de rétention étanche, avec un dispositif anti-débordement et un extincteur à proximité.",
          "oui", "La rétention garde le contenu d'une cuve en cas de fuite et limite la pollution."),
        C("Les opérations de ravitaillement et de vidange sont-elles réalisées sur des surfaces étanches ?",
          "Les vidanges d'huile des engins se font sur la terre nue, derrière le hangar.",
          "non", "Les huiles s'infiltrent dans le sol et peuvent atteindre la nappe.",
          "Réaliser les vidanges sur une aire étanche avec rétention et récupérer les huiles usagées."),
        C("Les eaux de pluie sont-elles séparées des zones polluées ?",
          "Le réseau d'eaux pluviales est distinct des eaux de lavage et protégé par un regard avec vanne d'isolement près de la zone de stockage.",
          "oui", "Séparer les réseaux évite que de l'eau propre ne transporte des polluants."),
        C("La consommation d'eau est-elle suivie et limitée ?",
          "Les compteurs d'eau sont relevés chaque mois et les fuites sont réparées après détection.",
          "oui", "Suivre la consommation permet de repérer rapidement les fuites et le gaspillage.")
      ]},
      { id: "emissions", nom: "Émissions, bruit et poussières", criteres: [
        C("Les émissions de poussières sont-elles limitées ?",
          "Le chargement des camions de sable se fait sans arrosage, un nuage de poussières se répand jusqu'au village voisin.",
          "non", "Les poussières affectent la santé des riverains et des travailleurs ; elles doivent être limitées à la source.",
          "Arroser les pistes et les tas, bâcher les camions et installer des systèmes de captage si nécessaire."),
        C("Les équipements à moteur sont-ils entretenus pour limiter fumées et émissions ?",
          "Le groupe électrogène du site dégage une fumée noire épaisse ; son entretien n'a pas eu lieu depuis deux ans.",
          "non", "Une fumée noire traduit une mauvaise combustion : pollution, gaspillage de carburant et risque pour la santé.",
          "Entretenir le groupe (filtres, injecteurs), planifier l'entretien périodique et suivre la consommation."),
        C("Le bruit émis vers l'extérieur est-il maîtrisé ?",
          "Le site est isolé, sans riverain à proximité ; aucune plainte n'est enregistrée et le registre le confirme.",
          "oui", "L'absence de plainte et de voisinage proche montre que le niveau d'exposition externe est maîtrisé.")
      ]},
      { id: "prevention", nom: "Prévention des déversements et urgences environnementales", criteres: [
        C("Un plan d'intervention en cas de pollution accidentelle existe-t-il ?",
          "Aucun plan n'existe et le personnel ne sait pas qui prévenir en cas de fuite de gasoil vers le fossé.",
          "non", "Une réaction rapide est déterminante pour limiter la pollution.",
          "Rédiger un plan d'urgence environnemental avec rôles, contacts et moyens, et organiser un exercice."),
        C("Des matériaux absorbants et des barrages sont-ils disponibles ?",
          "Des kits antidéversement avec absorbants, boudins et sacs sont placés près de la cuve et de l'atelier, et contrôlés chaque mois.",
          "oui", "Intervenir dans les premières minutes avec les bons moyens évite l'extension de la pollution."),
        C("Les incidents environnementaux sont-ils enregistrés et analysés ?",
          "Une fuite d'huile a eu lieu le mois dernier ; elle n'a pas été notée et personne n'a cherché la cause.",
          "non", "Enregistrer et analyser permet d'éviter que l'incident se reproduise.",
          "Tenir un registre des incidents environnementaux et analyser les causes pour définir des actions."),
        C("Les produits et déchets dangereux sont-ils protégés des intempéries et des vols ?",
          "Les produits sont dans un local fermé, sur rétention, à l'abri de la pluie et du soleil.",
          "oui", "Un stockage protégé réduit les fuites, les dégradations et les vols.")
      ]}
    ]
  });

  /* ---------------------------------------------------------- 9 */
  L.push({
    id: "qualite", num: 9,
    titre: "Qualité et conformité",
    presentation: "La qualité consiste à réaliser de façon fiable ce que l'on a promis au client et à respecter les exigences applicables. Elle repose sur des procédures claires, des documents maîtrisés, des contrôles, la traçabilité et le traitement des non-conformités par des actions correctives.",
    objectif: "Vérifier que les procédures sont connues et appliquées, que les documents sont maîtrisés, que les contrôles sont réalisés et enregistrés, que la traçabilité est assurée et que les non-conformités sont traitées jusqu'à l'efficacité des actions.",
    contexte: "Vous auditez l'atelier de production et le service qualité d'une entreprise de fabrication de composants en béton préfabriqué, avec un laboratoire de contrôle, un magasin et des expéditions.",
    infos: [
      "Une procédure n'a de valeur que si elle est à jour, accessible et réellement appliquée.",
      "Une non-conformité est un écart par rapport à une exigence ; l'action corrective traite sa cause, pas seulement le symptôme.",
      "La traçabilité permet de retrouver l'origine et la destination d'un produit."
    ],
    categories: [
      { id: "documents", nom: "Procédures et maîtrise documentaire", criteres: [
        C("Les procédures de travail sont-elles écrites, approuvées et accessibles au poste ?",
          "Les instructions de coulage et de décoffrage sont affichées au poste, approuvées par le responsable qualité et portent un indice de révision.",
          "oui", "Une instruction accessible et approuvée garantit des pratiques uniformes."),
        C("Seules les versions à jour des documents sont-elles disponibles ?",
          "Dans l'atelier, deux versions différentes de la même procédure de malaxage sont affichées, l'une datant de trois ans.",
          "non", "L'usage d'une version périmée entraîne des erreurs et des produits non conformes.",
          "Retirer les versions périmées, tenir une liste des documents en vigueur et vérifier les affichages à chaque révision."),
        C("Les modifications de procédures sont-elles approuvées et communiquées ?",
          "Le chef d'équipe a modifié seul la durée de cure du béton, sans validation ni information aux autres équipes.",
          "non", "Une modification non maîtrisée peut dégrader la qualité du produit et rendre les résultats incomparables.",
          "Instituer un processus de modification avec validation, révision du document et information du personnel."),
        C("Les enregistrements qualité sont-ils conservés, lisibles et protégés ?",
          "Les fiches de contrôle sont classées par date, lisibles, et conservées selon la durée définie par l'entreprise.",
          "oui", "Un enregistrement lisible et conservé apporte la preuve que le contrôle a été fait."),
        C("Les exigences légales et celles des clients applicables sont-elles identifiées et suivies ?",
          "Une liste des exigences applicables est tenue à jour et revue chaque année ; les responsables y sont associés.",
          "oui", "Connaître les exigences est le préalable pour les respecter.")
      ]},
      { id: "controles", nom: "Contrôles et surveillance", criteres: [
        C("Les contrôles prévus sont-ils réalisés à la fréquence définie ?",
          "Le plan de contrôle exige un essai d'affaissement à chaque gâchée ; l'opérateur ne le fait qu'une fois par jour.",
          "non", "Une fréquence moindre que prévue laisse passer des produits non conformes sans détection.",
          "Respecter la fréquence du plan de contrôle, former les opérateurs et vérifier par audit de poste."),
        C("Les instruments de mesure sont-ils étalonnés ou vérifiés ?",
          "La balance du laboratoire porte une étiquette d'étalonnage dont la date est dépassée de huit mois.",
          "non", "Un instrument non vérifié peut donner des résultats faux et fausser toute la décision.",
          "Retirer l'instrument ou le faire étalonner, tenir un planning d'étalonnage et réévaluer les mesures faites depuis la date dépassée."),
        C("Les critères d'acceptation des produits sont-ils définis et connus ?",
          "Les tolérances dimensionnelles et les critères d'aspect sont indiqués dans le plan de contrôle, et affichés à l'atelier.",
          "oui", "Un critère clair évite les décisions subjectives d'acceptation ou de rebut."),
        C("Les produits reçus des fournisseurs sont-ils contrôlés à la réception ?",
          "Le ciment livré est contrôlé (bon de livraison, état des sacs, date) avant d'être accepté au magasin.",
          "oui", "Un contrôle à la réception évite d'introduire une matière non conforme dans la production."),
        C("Les fournisseurs critiques sont-ils évalués ?",
          "Aucun fournisseur n'a été évalué depuis la création de l'entreprise ; les retards et défauts ne sont pas enregistrés.",
          "non", "Évaluer les fournisseurs permet de maintenir ceux qui sont fiables et de traiter les défaillances.",
          "Définir des critères (qualité, délais, conformité), évaluer chaque année les fournisseurs critiques et agir sur les écarts.")
      ]},
      { id: "tracabilite", nom: "Traçabilité", criteres: [
        C("Les lots de produits sont-ils identifiés de manière unique ?",
          "Chaque pièce porte un numéro de lot et la date de fabrication, enregistrés dans le dossier de production.",
          "oui", "L'identification des lots permet de retrouver rapidement les pièces concernées en cas de problème."),
        C("Peut-on retrouver les matières premières utilisées dans un lot donné ?",
          "Un client signale un défaut sur un lot ; l'entreprise est incapable de retrouver les lots de ciment et de granulats utilisés.",
          "non", "Sans lien lot-produit/matière, on ne peut pas isoler le problème ni limiter le rappel.",
          "Enregistrer les lots de matières à chaque fabrication et relier chaque lot de produit à ses matières."),
        C("Les produits non conformes sont-ils identifiés et isolés ?",
          "Les pièces défectueuses sont étiquetées « Non conforme » et placées dans une zone délimitée en attente de décision.",
          "oui", "L'isolement évite que le produit non conforme soit livré par erreur.")
      ]},
      { id: "nc", nom: "Non-conformités et actions correctives", criteres: [
        C("Les non-conformités sont-elles enregistrées ?",
          "Les défauts trouvés en fin de ligne sont réparés sans être notés, « pour ne pas faire de paperasse ».",
          "non", "Sans enregistrement, on ne connaît ni la fréquence ni l'origine des défauts, et on ne peut pas progresser.",
          "Enregistrer chaque non-conformité (date, produit, nature, quantité) et analyser les tendances."),
        C("Une décision est-elle prise pour chaque produit non conforme (retouche, rebut, dérogation) ?",
          "Pour chaque pièce non conforme, une fiche mentionne la décision, la personne qui l'a prise et le résultat du nouveau contrôle.",
          "oui", "Une décision tracée garantit que le produit n'est pas livré tant qu'il n'est pas conforme."),
        C("Les causes des non-conformités répétitives sont-elles analysées ?",
          "Les fissures des mêmes pièces reviennent tous les mois ; on les corrige à chaque fois sans chercher la cause.",
          "non", "Corriger sans traiter la cause garantit le retour du problème.",
          "Analyser la cause (méthode 5 pourquoi, Ishikawa), définir une action corrective, la suivre et la vérifier."),
        C("L'efficacité des actions correctives est-elle vérifiée ?",
          "Après l'action sur le dosage d'eau, l'équipe a suivi les résultats pendant un mois et constaté la disparition du défaut, puis l'a consigné.",
          "oui", "Vérifier l'efficacité évite de considérer un problème comme résolu alors qu'il persiste."),
        C("Les étapes de production sous-traitées sont-elles maîtrisées (exigences transmises, contrôle à réception) ?",
          "L'entreprise réalise toute sa fabrication en interne et ne sous-traite aucune étape de production.",
          "na", "Sans étape sous-traitée, le critère ne s'applique pas à cette situation.")
      ]},
      { id: "amelioration", nom: "Audit et amélioration continue", criteres: [
        C("Des audits internes sont-ils planifiés et réalisés ?",
          "Un programme annuel d'audits internes existe et a été réalisé ; les rapports sont présentés à la direction.",
          "oui", "L'audit interne vérifie l'application des procédures et révèle des améliorations."),
        C("Les résultats de la qualité sont-ils suivis par des indicateurs ?",
          "Le taux de rebut, les retours clients et les délais sont suivis chaque mois et affichés ; aucun objectif n'a été défini.",
          "non", "Un indicateur sans objectif ne permet pas de savoir si le résultat est acceptable.",
          "Fixer des objectifs mesurables pour chaque indicateur et revoir les résultats en réunion."),
        C("La direction revoit-elle périodiquement le système qualité ?",
          "Une revue de direction annuelle examine les indicateurs, les audits, les réclamations et décide des actions ; un compte rendu est conservé.",
          "oui", "La revue de direction assure l'engagement des dirigeants et l'amélioration continue.")
      ]}
    ]
  });

  /* ---------------------------------------------------------- 10 */
  L.push({
    id: "hygiene", num: 10,
    titre: "Hygiène, propreté et conditions de travail",
    presentation: "Un lieu de travail propre, rangé, doté de sanitaires, d'eau potable et d'espaces de repos, avec un poste de travail bien conçu, protège la santé et améliore la sécurité. Les troubles musculosquelettiques, les glissades et les maladies liées à l'hygiène sont fréquents quand ces conditions ne sont pas réunies.",
    objectif: "Vérifier la propreté et le rangement, la qualité des installations sanitaires et de l'eau, l'ergonomie des postes et l'organisation des espaces et des ambiances de travail.",
    contexte: "Vous auditez un site de production avec ateliers, bureaux, vestiaires, sanitaires, réfectoire et cour extérieure, employant une cinquantaine de personnes en horaires de jour.",
    infos: [
      "Un poste de travail en désordre est un poste dangereux : trébuchement, chute d'objets, accès bloqué.",
      "L'eau potable, les sanitaires propres et un lieu de repos font partie des conditions minimales de travail.",
      "L'ergonomie vise à adapter le travail à la personne, et non l'inverse."
    ],
    categories: [
      { id: "nettoyage", nom: "Nettoyage et rangement", criteres: [
        C("Les sols sont-ils propres, secs et dégagés ?",
          "Une flaque d'huile reste plusieurs jours au sol près de la presse et des cartons traînent dans l'allée.",
          "non", "Les sols glissants et encombrés provoquent des chutes de plain-pied, qui sont l'une des premières causes d'accident.",
          "Nettoyer immédiatement, réparer la fuite, prévoir un nettoyage régulier et dégager les allées."),
        C("Un planning de nettoyage est-il défini et suivi ?",
          "Un planning affiché définit qui nettoie quoi et quand ; un responsable le vérifie et signe chaque semaine.",
          "oui", "Un nettoyage planifié et contrôlé évite que la propreté dépende de la bonne volonté de chacun."),
        C("Le matériel est-il rangé à sa place après usage ?",
          "Les outils sont rangés sur des panneaux avec contour dessiné ; un opérateur peut voir à tout moment s'il en manque un.",
          "oui", "Un rangement visible fait gagner du temps et évite d'oublier un outil sur une machine."),
        C("Les déchets sont-ils évacués régulièrement des postes de travail ?",
          "Les poubelles de l'atelier débordent et sont vidées une fois par semaine seulement ; des nuisibles sont aperçus.",
          "non", "Des déchets accumulés attirent les nuisibles et créent un risque d'hygiène et d'incendie.",
          "Augmenter la fréquence de vidage, prévoir des contenants fermés et lutter contre les nuisibles."),
        C("Les produits de nettoyage sont-ils stockés et utilisés en sécurité ?",
          "Des bidons de produit d'entretien sans étiquette sont rangés à côté de bouteilles d'eau dans le réfectoire.",
          "non", "Un produit non identifié près de l'eau ou de la nourriture peut être ingéré par erreur.",
          "Étiqueter tous les produits, les ranger dans un local à part et les séparer des denrées.")
      ]},
      { id: "sanitaires", nom: "Sanitaires, eau, vestiaires et repos", criteres: [
        C("L'eau potable est-elle disponible en permanence à proximité des postes ?",
          "Des fontaines d'eau potable sont installées dans chaque atelier ; leurs filtres sont changés et les gobelets individuels sont fournis.",
          "oui", "L'accès à l'eau protège de la déshydratation, notamment par forte chaleur."),
        C("Les toilettes sont-elles propres, en nombre suffisant et équipées de lavabos avec savon ?",
          "Les toilettes sont sales, sans eau courante au lavabo ni savon ; elles ne sont nettoyées qu'une fois par semaine.",
          "non", "Des sanitaires insalubres favorisent les infections et dégradent la dignité des travailleurs.",
          "Réparer l'arrivée d'eau, fournir savon et papier, nettoyer plusieurs fois par jour et augmenter le nombre de toilettes si besoin."),
        C("Les toilettes sont-elles séparées pour les hommes et les femmes lorsque le site emploie des deux ?",
          "Le site emploie des hommes et des femmes ; des toilettes séparées avec verrou intérieur sont prévues pour chacun.",
          "oui", "La séparation et l'intimité sont des conditions de base du respect des travailleurs."),
        C("Un vestiaire propre permet-il de ranger les vêtements de travail et de ville séparément ?",
          "Le vestiaire est partagé sans casiers ; les vêtements de travail souillés sont rangés avec les vêtements de ville.",
          "non", "Mélanger vêtements souillés et vêtements de ville expose à la contamination des familles.",
          "Fournir des casiers séparés pour tenues de travail et vêtements personnels et organiser le lavage des tenues."),
        C("Un local de repas propre est-il prévu, distinct des postes de travail ?",
          "Les ouvriers prennent leur repas à leur poste de travail, au milieu des poussières, car il n'y a pas d'endroit prévu.",
          "non", "Manger dans la zone de travail expose à l'ingestion de poussières et de substances.",
          "Aménager un local de repas propre, ventilé, équipé de tables et sièges, et interdire de manger aux postes."),
        C("Les installations de premiers secours et de repos à l'ombre sont-elles prévues ?",
          "Des zones ombragées avec bancs et ventilateurs sont aménagées dans la cour ; une infirmerie équipée est ouverte pendant les horaires de travail.",
          "oui", "Un lieu de repos permet de récupérer et réduit les accidents liés à la fatigue et à la chaleur.")
      ]},
      { id: "ergonomie", nom: "Ergonomie des postes de travail", criteres: [
        C("Les postes de travail sont-ils adaptés aux tâches et aux personnes ?",
          "Un établi est trop bas pour la taille des ouvriers qui s'y penchent huit heures par jour ; aucune hauteur réglable n'est prévue.",
          "non", "Un poste mal dimensionné provoque des douleurs du dos et des troubles musculosquelettiques.",
          "Régler ou remplacer l'établi à la bonne hauteur et prévoir des postes réglables."),
        C("Les sièges sont-ils adaptés et en bon état pour le travail assis ?",
          "Les agents de bureau disposent de sièges réglables en hauteur avec dossier, et les écrans sont placés à hauteur des yeux.",
          "oui", "Un siège et un écran bien réglés réduisent les douleurs de la nuque et du dos."),
        C("Les tâches répétitives sont-elles organisées pour limiter les troubles ?",
          "Les opérateurs de conditionnement répètent le même geste pendant toute la journée, sans rotation ni pause.",
          "non", "Les gestes répétés sans variation provoquent des troubles des mains, des poignets et des épaules.",
          "Instaurer des rotations de poste, des pauses courtes et réorganiser la tâche pour varier les gestes."),
        C("Les objets fréquemment utilisés sont-ils à portée de main ?",
          "Les pièces et outils les plus utilisés sont placés entre la hauteur des coudes et des épaules, à portée sans torsion.",
          "oui", "Éviter les étirements et torsions réduit la fatigue et les risques de blessure."),
        C("Des mesures particulières encadrent-elles le travail de nuit (éclairage renforcé, repos, surveillance) ?",
          "Le site travaille uniquement en horaires de jour : aucun poste de nuit n'est organisé.",
          "na", "Sans travail de nuit, ce critère ne s'applique pas à la situation décrite.")
      ]},
      { id: "espaces", nom: "Organisation des espaces et ambiances de travail", criteres: [
        C("L'éclairage est-il suffisant et adapté aux tâches ?",
          "L'atelier de contrôle est éclairé de façon insuffisante : les contrôleurs rapprochent leurs yeux des pièces pour voir les défauts.",
          "non", "Un mauvais éclairage fatigue la vue, provoque des erreurs et augmente le risque d'accident.",
          "Mesurer l'éclairage, ajouter des lampes de poste et nettoyer ou remplacer les luminaires défaillants."),
        C("La ventilation et la température permettent-elles de travailler sans inconfort excessif ?",
          "L'atelier est équipé de ventilateurs, d'ouvertures hautes et basses et d'un suivi de la température ; des pauses sont prévues en cas de forte chaleur.",
          "oui", "Une bonne ventilation maintient le confort et limite l'accumulation de vapeurs et de chaleur."),
        C("Le bruit est-il limité dans les zones de travail ?",
          "Un compresseur très bruyant fonctionne dans l'atelier à côté des postes de montage, sans capot ni isolation.",
          "non", "Le bruit prolongé endommage l'audition et gêne la communication, donc la sécurité.",
          "Isoler ou déplacer le compresseur, ajouter un capot insonorisant et mesurer le niveau de bruit."),
        C("Les cheminements piétons sont-ils tracés et dégagés ?",
          "Des allées piétonnes marquées au sol relient l'entrée, les ateliers et le réfectoire ; elles sont libres de tout stockage.",
          "oui", "Des allées claires permettent de circuler en sécurité et d'évacuer rapidement."),
        C("L'espace de travail est-il suffisant pour les tâches réalisées ?",
          "Les trois opérateurs d'une ligne de montage travaillent coude à coude dans un espace très étroit, avec du stock entassé derrière eux.",
          "non", "Un espace trop réduit limite les mouvements, augmente les contacts et empêche une évacuation rapide.",
          "Réaménager la zone, évacuer le stock excédentaire et prévoir un espace libre autour de chaque poste.")
      ]}
    ]
  });
})();
