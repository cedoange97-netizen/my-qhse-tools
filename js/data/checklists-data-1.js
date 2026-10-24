/* ==========================================================
   My-QHSE Tools – checklists-data-1.js : thèmes 1 à 4
   Données des checklists pédagogiques (aucun code d'interface ici).

   Structure d'un critère, créé avec C(question, situation, reponse, explication, action) :
     q  = question d'audit
     s  = situation observée sur le terrain (c'est ce que l'utilisateur doit qualifier)
     r  = bonne qualification : "oui" (exigence respectée), "non" (non respectée) ou "na" (non applicable)
     e  = correction : pourquoi cette réponse est la bonne
     a  = action corrective proposée (affichée dans le bilan quand l'utilisateur répond « non » ; vide pour « oui » et « na »)

   Pour ajouter un thème ou un critère, copiez un bloc existant.
   Les situations sont fictives et pédagogiques : elles ne décrivent aucun site réel.
   ========================================================== */
(function () {
  "use strict";
  var L = window.QHSE_CHECKLISTS = window.QHSE_CHECKLISTS || [];
  function C(q, s, r, e, a) { return { q: q, s: s, r: r, e: e, a: a || "" }; }

  /* ---------------------------------------------------------- 1 */
  L.push({
    id: "sst", num: 1,
    titre: "Santé et sécurité au travail",
    presentation: "La santé et la sécurité au travail (SST) regroupent l'ensemble des moyens qui permettent d'éviter les accidents du travail et les maladies professionnelles : organisation, identification des dangers, prévention, suivi des accidents et protection des travailleurs.",
    objectif: "Vérifier que l'entreprise organise la prévention de façon structurée : qui est responsable de quoi, comment les dangers sont repérés et maîtrisés, comment les accidents sont traités et si les conditions de travail protègent réellement les personnes.",
    contexte: "Vous réalisez un audit interne mensuel sur un chantier de construction d'un bâtiment de bureaux employant une soixantaine de personnes, dont des sous-traitants, avec deux équipes de travail (jour et nuit).",
    infos: [
      "Un critère est « conforme » seulement si l'exigence est respectée en pratique, pas seulement prévue sur le papier.",
      "Une preuve peut être un document, une observation ou un témoignage concordant.",
      "N/A ne se choisit que si l'exigence ne peut pas exister dans la situation décrite."
    ],
    categories: [
      { id: "orga", nom: "Organisation et engagement", criteres: [
        C("La politique de santé et sécurité du site est-elle affichée et connue du personnel ?",
          "À l'accueil, une politique SST datée et signée par la direction est affichée. Trois ouvriers interrogés citent chacun au moins deux de ses engagements.",
          "oui", "La politique est visible et comprise : l'engagement de la direction est démontré et le personnel se l'approprie."),
        C("Un responsable de la sécurité est-il officiellement désigné ?",
          "Aucun nom ni fonction n'est désigné pour la sécurité. Le chef de chantier répond que « tout le monde s'en occupe un peu ».",
          "non", "Quand tout le monde est responsable, personne ne l'est : sans personne désignée, les actions de prévention ne sont ni suivies ni évaluées.",
          "Désigner par écrit un responsable sécurité, définir ses missions et ses moyens, puis l'annoncer à tout le personnel."),
        C("Des réunions de sécurité (causeries) sont-elles tenues régulièrement et enregistrées ?",
          "Une causerie de 10 minutes a lieu chaque matin. Les feuilles de présence signées des quatre dernières semaines sont classées.",
          "oui", "La régularité et les preuves de présence montrent que le sujet est suivi dans la durée."),
        C("Les responsabilités de sécurité de l'encadrement sont-elles définies ?",
          "Les fiches de poste des chefs d'équipe ne mentionnent aucune responsabilité en matière de sécurité.",
          "non", "L'encadrement de proximité est le premier relais de la prévention ; ses responsabilités doivent être écrites pour être exigibles.",
          "Compléter les fiches de poste de l'encadrement avec des responsabilités de sécurité précises et les faire signer."),
        C("Les sous-traitants sont-ils soumis aux règles de sécurité du site ?",
          "Une entreprise de maçonnerie sous-traitante travaille sur le site. Ses ouvriers n'ont reçu ni accueil sécurité ni règles du site.",
          "non", "Les sous-traitants sont exposés aux mêmes dangers et peuvent en créer pour les autres : ils doivent respecter les mêmes règles dès leur arrivée.",
          "Organiser un accueil sécurité obligatoire pour tout sous-traitant avant l'accès au chantier et lui remettre les règles du site."),
        C("Les documents de sécurité sont-ils à jour et facilement accessibles ?",
          "Le registre de sécurité, le plan d'urgence et les consignes sont dans un classeur identifié, au bureau. La dernière mise à jour date du mois dernier.",
          "oui", "Des documents classés, identifiés et à jour peuvent être consultés rapidement, notamment lors d'un contrôle ou d'une urgence.")
      ]},
      { id: "dangers", nom: "Identification des dangers et évaluation des risques", criteres: [
        C("Une évaluation des risques écrite couvre-t-elle les activités du site ?",
          "Un document d'évaluation des risques traite le coffrage, le terrassement et la manutention. Il a été révisé après le dernier accident.",
          "oui", "L'évaluation couvre les activités réelles et est mise à jour après un événement : c'est la logique d'amélioration continue."),
        C("Les risques sont-ils hiérarchisés et associés à des mesures de prévention ?",
          "La liste des dangers existe mais ne comporte ni niveau de risque ni mesure de prévention.",
          "non", "Lister les dangers ne suffit pas : sans niveau de risque et sans mesure, on ne sait pas quoi traiter en priorité ni comment.",
          "Compléter l'évaluation : coter chaque risque (probabilité × gravité) puis définir une mesure, un responsable et une échéance."),
        C("Les travailleurs participent-ils au repérage des dangers ?",
          "Des tours de site mensuels réunissent l'encadrement et deux représentants des ouvriers. Leurs remarques sont consignées dans un compte rendu.",
          "oui", "Les travailleurs connaissent les dangers réels de leur poste : leur participation rend l'évaluation plus fiable."),
        C("Existe-t-il un moyen simple de signaler une situation dangereuse ?",
          "Des fiches de signalement existent, mais personne ne sait où les remettre. Aucune fiche n'a été reçue depuis six mois.",
          "non", "Un dispositif que personne n'utilise ne protège pas : l'absence de signalement sur six mois montre que les situations dangereuses ne remontent pas.",
          "Expliquer le dispositif en causerie, installer une boîte identifiée et répondre à chaque signalement pour encourager son usage."),
        C("Un permis de travail est-il émis pour les travaux par point chaud (soudage, meulage) ?",
          "Le site ne réalise aucun travail par point chaud ce mois-ci : aucun soudage ni meulage n'est prévu au planning.",
          "na", "Sans travaux par point chaud, il n'y a pas de permis à émettre : l'exigence ne s'applique pas à la situation décrite.")
      ]},
      { id: "accidents", nom: "Accidents, incidents et premiers secours", criteres: [
        C("Les accidents et les presque accidents sont-ils enregistrés ?",
          "Le registre est à jour et mentionne l'accident du mois ainsi que trois presque accidents du trimestre.",
          "oui", "Enregistrer aussi les presque accidents permet d'agir avant qu'un accident grave ne survienne."),
        C("Les causes de chaque accident sont-elles analysées ?",
          "Après une chute de matériel ayant causé une blessure légère, la fiche mentionne seulement « maladresse du travailleur ». Aucune analyse n'a été faite.",
          "non", "Attribuer l'accident à la personne ne permet pas d'en corriger les causes réelles (organisation, matériel, méthode).",
          "Analyser chaque accident avec une méthode simple (5 pourquoi, arbre des causes) et définir des actions qui visent les causes."),
        C("La trousse de premiers secours est-elle complète et accessible ?",
          "La trousse est dans un bureau fermé à clé. Les pansements sont épuisés et le désinfectant est périmé depuis huit mois.",
          "non", "Une trousse inaccessible ou incomplète est inutile le jour où elle sert.",
          "Placer la trousse en accès libre, la vérifier chaque mois avec une liste et remplacer immédiatement les produits périmés."),
        C("Le nombre de secouristes formés est-il suffisant ?",
          "Six secouristes certifiés sont répartis sur les deux équipes de travail pour soixante personnes. Leurs noms sont affichés.",
          "oui", "Des secouristes présents à chaque poste de travail et identifiables permettent d'intervenir rapidement."),
        C("Les numéros d'urgence et la conduite à tenir sont-ils affichés ?",
          "Aucun numéro d'urgence ni centre de santé de référence n'est affiché. L'équipe de nuit ne sait pas qui appeler en cas d'accident grave.",
          "non", "En cas d'urgence, chaque minute compte : l'information doit être visible de tous, y compris la nuit.",
          "Afficher les numéros d'urgence et le centre de santé de référence dans les zones de travail et en informer chaque équipe.")
      ]},
      { id: "conditions", nom: "Conditions de travail et mesures de protection", criteres: [
        C("Chaque nouveau travailleur reçoit-il un accueil sécurité avant de commencer ?",
          "Chaque nouvel arrivant suit un accueil de 30 minutes et signe une fiche avant d'accéder aux zones de travail.",
          "oui", "L'accueil sécurité permet de présenter les dangers et les règles avant l'exposition, et la fiche signée en est la preuve."),
        C("Les horaires et les temps de repos limitent-ils la fatigue ?",
          "Des ouvriers enchaînent des équipes de 14 heures pendant trois semaines sans jour de repos.",
          "non", "La fatigue augmente fortement le risque d'erreur et d'accident ; les durées de travail et de repos doivent être maîtrisées.",
          "Réorganiser les équipes pour respecter des durées maximales et des jours de repos, et suivre le temps de travail réel."),
        C("Des mesures protègent-elles les travailleurs de la chaleur ?",
          "Chantier extérieur à 38 °C. Une seule fontaine à 200 mètres et aucune pause prévue à l'ombre.",
          "non", "La chaleur provoque épuisement et coup de chaleur : eau à proximité, pauses à l'ombre et adaptation des horaires sont nécessaires.",
          "Installer des points d'eau près des postes, prévoir des pauses à l'ombre et déplacer les tâches pénibles aux heures fraîches."),
        C("Les zones dangereuses sont-elles délimitées et signalées ?",
          "Une tranchée ouverte est entourée de barrières rigides et de panneaux « Danger – excavation ».",
          "oui", "Une délimitation physique et une signalisation claire empêchent l'accès involontaire à la zone dangereuse."),
        C("Les consignes de sécurité sont-elles compréhensibles par tous les travailleurs ?",
          "La moitié des ouvriers ne lit pas le français. Les consignes sont uniquement affichées en texte français, sans pictogramme.",
          "non", "Une consigne qui n'est pas comprise n'est pas appliquée : le message doit être adapté aux personnes (langue locale, pictogrammes, démonstration).",
          "Traduire les consignes dans les langues utilisées, ajouter des pictogrammes et vérifier la compréhension en causerie."),
        C("Une mesure protège-t-elle les travailleurs isolés ?",
          "Aucun travailleur n'est isolé : toutes les tâches sont réalisées par équipes de deux personnes au minimum.",
          "na", "Aucun travailleur n'étant seul, le critère ne s'applique pas à cette situation.")
      ]}
    ]
  });

  /* ---------------------------------------------------------- 2 */
  L.push({
    id: "epi", num: 2,
    titre: "Équipements de protection individuelle (EPI)",
    presentation: "Les EPI (casque, gants, chaussures, lunettes, protection auditive, harnais…) protègent le travailleur contre un danger qui n'a pas pu être supprimé à la source. Ils constituent la dernière barrière : ils doivent donc être adaptés, en bon état, portés et bien utilisés.",
    objectif: "Vérifier que les EPI sont choisis d'après les risques, fournis gratuitement, adaptés à chaque tâche, correctement portés, entretenus et stockés, et que les travailleurs savent les utiliser.",
    contexte: "Vous auditez l'utilisation des EPI dans une carrière de granulats où se trouvent un concasseur, des camions, un atelier de maintenance et un magasin d'équipements.",
    infos: [
      "L'EPI ne remplace pas la prévention collective : il s'ajoute aux protections collectives.",
      "Un EPI abîmé, périmé ou inadapté ne protège plus, même s'il est porté.",
      "L'employeur fournit les EPI ; le travailleur doit les porter et signaler tout défaut."
    ],
    categories: [
      { id: "besoin", nom: "Évaluation des besoins et disponibilité", criteres: [
        C("Les besoins en EPI ont-ils été définis à partir de l'évaluation des risques ?",
          "Une matrice « poste de travail / EPI obligatoires » a été établie à partir de l'évaluation des risques et validée par la direction.",
          "oui", "Définir les EPI poste par poste évite les oublis et les achats inadaptés."),
        C("Les EPI nécessaires sont-ils fournis gratuitement aux travailleurs ?",
          "Les ouvriers de l'atelier achètent eux-mêmes leurs gants et leurs lunettes de protection.",
          "non", "La fourniture des EPI est une obligation de l'employeur ; si le travailleur paie, les protections risquent de ne pas être utilisées.",
          "Fournir gratuitement tous les EPI requis et enregistrer chaque remise dans un registre."),
        C("Le stock d'EPI est-il suffisant, y compris pour les visiteurs et les sous-traitants ?",
          "Le magasin dispose d'un stock de casques, de lunettes et de gilets pour les visiteurs. Le stock minimum est contrôlé chaque semaine.",
          "oui", "Un stock minimum suivi évite l'argument « il n'y en avait plus » et protège aussi les personnes de passage."),
        C("Les EPI sont-ils disponibles dans toutes les tailles nécessaires ?",
          "Seules les tailles M et L de gants et de chaussures sont disponibles. Plusieurs ouvriers travaillent avec des chaussures trop grandes.",
          "non", "Un EPI mal ajusté gêne, expose à d'autres risques et sera mal porté.",
          "Recueillir les tailles de chacun et constituer un stock complet, avec essai à la remise.")
      ]},
      { id: "adequation", nom: "Adéquation et conformité", criteres: [
        C("Les EPI correspondent-ils au danger auquel le travailleur est exposé ?",
          "Au concassage, les ouvriers portent des lunettes simples à la place de lunettes fermées, alors que les poussières sont très abondantes.",
          "non", "Un EPI doit protéger contre le danger réel : lunettes simples et poussière fine n'offrent pas la même protection que des lunettes fermées.",
          "Remplacer par des lunettes fermées adaptées aux poussières et préciser le modèle dans la matrice des EPI."),
        C("Les EPI portent-ils un marquage de conformité et une notice du fabricant ?",
          "Les casques et les chaussures achetés portent un marquage de conformité lisible. Les notices sont conservées au magasin.",
          "oui", "Le marquage et la notice garantissent que l'EPI a été conçu pour l'usage prévu et donnent les limites d'emploi."),
        C("La protection auditive est-elle adaptée au niveau de bruit ?",
          "Devant le concasseur, le niveau de bruit est très élevé. Les ouvriers portent des bouchons d'oreilles adaptés, remplacés régulièrement.",
          "oui", "Une protection auditive adaptée au niveau de bruit et régulièrement renouvelée limite la perte d'audition."),
        C("Un harnais antichute est-il prévu pour les travaux en hauteur ?",
          "Le site ne comporte aucun travail en hauteur : toutes les tâches sont réalisées au sol, sans plateforme ni échelle.",
          "na", "Il n'y a aucun travail en hauteur, donc aucun besoin de harnais dans cette situation."),
        C("Les EPI sont-ils compatibles entre eux lorsqu'ils sont portés ensemble ?",
          "Un opérateur porte à la fois un casque, des lunettes et un masque anti-poussière. Les lunettes se rabattent mal et le masque ne ferme pas sur le visage.",
          "non", "Des EPI incompatibles perdent leur efficacité : chacun doit pouvoir rester étanche et en place.",
          "Choisir des modèles compatibles entre eux et tester l'ensemble avec le travailleur avant de généraliser.")
      ]},
      { id: "port", nom: "Port et discipline", criteres: [
        C("Les EPI obligatoires sont-ils réellement portés dans les zones concernées ?",
          "Lors de la visite, tous les travailleurs observés portent casque, chaussures de sécurité et gilet dans la zone d'exploitation.",
          "oui", "Le port constaté sur le terrain, et non les consignes affichées, est la preuve d'une prévention efficace."),
        C("Les zones à port obligatoire sont-elles signalées ?",
          "L'entrée du site comporte un panneau « Casque obligatoire ». Aucune signalisation n'indique le port de protection auditive aux abords du concasseur.",
          "non", "La signalisation doit être présente à l'endroit précis où l'EPI devient obligatoire.",
          "Poser des panneaux de port obligatoire à l'entrée de chaque zone concernée, avec le pictogramme de l'EPI."),
        C("Les manquements au port des EPI sont-ils traités ?",
          "Un ouvrier a été vu sans casque trois fois. Le superviseur n'a rien dit et aucune suite n'a été donnée.",
          "non", "Un manquement toléré devient une habitude : le superviseur doit corriger, expliquer, puis appliquer les mesures prévues.",
          "Rappeler la règle à la personne, appliquer la procédure disciplinaire si nécessaire et former les superviseurs à intervenir."),
        C("Les travailleurs signalent-ils les EPI abîmés ou inadaptés ?",
          "Dans l'atelier, un ouvrier a signalé un gant percé. Il a été remplacé le jour même et la remise a été enregistrée.",
          "oui", "Quand un défaut est signalé puis corrigé rapidement, les travailleurs ont confiance dans le dispositif.")
      ]},
      { id: "entretien", nom: "Entretien et stockage", criteres: [
        C("Les EPI sont-ils inspectés régulièrement ?",
          "Les casques sont fissurés ou décolorés par le soleil, certains datent de plus de cinq ans. Personne ne les inspecte.",
          "non", "Certains EPI vieillissent même sans accident (rayons du soleil, chaleur) : ils doivent être inspectés et remplacés selon les consignes du fabricant.",
          "Mettre en place une inspection périodique, retirer les EPI fissurés ou périmés et noter les dates de remplacement."),
        C("Les EPI sont-ils nettoyés et entretenus selon les instructions du fabricant ?",
          "Les masques réutilisables sont nettoyés après chaque poste, les filtres sont changés selon le calendrier prévu et la consigne est affichée.",
          "oui", "Un entretien régulier maintient l'efficacité et l'hygiène de l'équipement."),
        C("Les EPI sont-ils stockés dans un endroit propre, sec et protégé ?",
          "Les harnais et les masques sont rangés dans un conteneur chaud et poussiéreux, sans rayonnage, parfois au contact d'huile.",
          "non", "La chaleur, la poussière et les produits chimiques dégradent les EPI : le stockage doit les protéger.",
          "Aménager un local ou une armoire propre et ventilée, avec rayonnage, à l'abri du soleil et des produits."),
        C("Les EPI personnels sont-ils attribués à une seule personne lorsque l'hygiène l'exige ?",
          "Les casques et masques respiratoires sont attribués nominativement. Les lunettes et les gants sont désinfectés avant tout nouvel usage.",
          "oui", "Des EPI personnels évitent la transmission de maladies et assurent un bon ajustement.")
      ]},
      { id: "formation", nom: "Formation à l'utilisation", criteres: [
        C("Les travailleurs ont-ils été formés à l'utilisation de leurs EPI ?",
          "Les ouvriers ont reçu leurs gants et masques sans explication. Plusieurs ne savent pas ajuster les attaches du masque.",
          "non", "Un EPI mal utilisé ne protège pas : la formation inclut le choix, l'ajustement, les limites et l'entretien.",
          "Organiser une formation pratique avec démonstration et vérifier l'ajustement de chaque travailleur."),
        C("Les formations aux EPI sont-elles enregistrées ?",
          "Une feuille d'émargement signée est conservée pour chaque séance de formation sur les EPI, avec la date et le contenu.",
          "oui", "L'enregistrement prouve que la formation a eu lieu et permet de planifier les rappels."),
        C("Le personnel temporaire est-il formé avant de recevoir ses EPI ?",
          "Pour cette période, tous les travailleurs sont des employés permanents formés depuis plusieurs années. Aucun personnel temporaire n'est présent.",
          "na", "Aucun personnel temporaire n'étant présent, l'exigence ne s'applique pas à cette situation.")
      ]}
    ]
  });

  /* ---------------------------------------------------------- 3 */
  L.push({
    id: "incendie", num: 3,
    titre: "Incendie et situations d'urgence",
    presentation: "La prévention incendie vise à éviter le départ de feu, à le détecter rapidement, à l'éteindre à son début et à permettre une évacuation sûre. Elle s'inscrit dans la préparation générale aux situations d'urgence.",
    objectif: "Vérifier la prévention des départs de feu, la disponibilité et l'entretien des moyens de lutte, l'efficacité de l'alarme et de l'évacuation, et la préparation du personnel aux urgences.",
    contexte: "Vous auditez un entrepôt logistique de stockage de produits variés (cartons, palettes, huiles) qui emploie une quarantaine de personnes sur deux niveaux, avec un quai de chargement.",
    infos: [
      "Pour qu'un feu existe, il faut un combustible, un comburant (l'air) et une source d'énergie.",
      "Un extincteur n'est utile que s'il est accessible, vérifié et si les personnes savent s'en servir.",
      "Un exercice d'évacuation sert à découvrir les problèmes avant une vraie urgence."
    ],
    categories: [
      { id: "prevention", nom: "Prévention des départs de feu", criteres: [
        C("Le stockage des matières combustibles est-il organisé et limité ?",
          "Des palettes de cartons sont empilées contre les murs et sous les luminaires, sans espace de dégagement.",
          "non", "Le combustible entassé près des sources de chaleur et sans dégagement favorise un départ de feu et une propagation rapide.",
          "Ranger les palettes avec des allées et un dégagement par rapport aux murs et aux luminaires ; limiter les quantités stockées."),
        C("Les installations électriques sont-elles protégées contre les risques d'incendie ?",
          "Les tableaux électriques sont fermés, dégagés et portent une signalétique. Des prises multiples sont branchées à d'autres prises multiples.",
          "non", "Les prises multiples en cascade surchargent le circuit et peuvent chauffer jusqu'à l'incendie.",
          "Retirer les multiprises en cascade, ajouter des prises adaptées et faire contrôler l'installation."),
        C("L'interdiction de fumer est-elle respectée et les zones fumeurs organisées ?",
          "Une zone fumeurs extérieure est prévue avec un cendrier en métal et un extincteur. Aucun mégot n'est trouvé à l'intérieur.",
          "oui", "Une zone fumeurs organisée et respectée limite l'un des départs de feu les plus fréquents."),
        C("Les travaux par point chaud sont-ils encadrés par un permis de feu ?",
          "Un soudeur intervient sur un portail de l'entrepôt sans permis de feu, à quelques mètres de palettes de cartons.",
          "non", "Les travaux par point chaud sont une cause majeure d'incendie : ils exigent un permis, un périmètre dégagé et une surveillance après les travaux.",
          "Établir un permis de feu avant chaque intervention, dégager la zone, prévoir un extincteur et une surveillance post-travaux."),
        C("Les déchets combustibles sont-ils évacués régulièrement ?",
          "Les cartons et films plastiques sont évacués chaque jour vers un conteneur situé à l'extérieur, éloigné du bâtiment.",
          "oui", "Éliminer les déchets combustibles réduit la charge d'incendie à l'intérieur.")
      ]},
      { id: "moyens", nom: "Extincteurs et détection", criteres: [
        C("Les extincteurs sont-ils en nombre suffisant et adaptés aux risques ?",
          "Un extincteur à eau est placé près du tableau électrique et de la zone de stockage d'huiles.",
          "non", "L'eau est inadaptée aux feux électriques et aux feux d'huile : l'agent extincteur doit correspondre au type de feu.",
          "Installer des extincteurs adaptés (CO₂ pour l'électrique, poudre ou mousse pour les huiles) et former le personnel."),
        C("Les extincteurs sont-ils visibles, accessibles et signalés ?",
          "Les extincteurs sont fixés à hauteur d'homme près des issues, dégagés et repérés par un panneau.",
          "oui", "En cas de feu, l'extincteur doit être trouvé et saisi sans perdre de temps."),
        C("Les extincteurs sont-ils vérifiés périodiquement ?",
          "Les étiquettes de plusieurs extincteurs indiquent une dernière vérification il y a plus de deux ans.",
          "non", "Un extincteur non vérifié peut être vide ou défectueux au moment où l'on en a besoin.",
          "Faire contrôler tous les extincteurs par un organisme compétent et tenir un registre avec les dates de prochaine vérification."),
        C("Un système de détection incendie est-il installé et testé ?",
          "Les détecteurs de fumée installés dans l'entrepôt sont testés chaque trimestre ; les résultats sont consignés.",
          "oui", "Un détecteur testé permet de détecter le feu tôt, y compris en l'absence de personnel."),
        C("Un réseau de robinets d'incendie armés est-il disponible et entretenu ?",
          "Le bâtiment de petite taille est entièrement couvert par des extincteurs ; l'exigence de robinets d'incendie armés ne s'applique pas à ce bâtiment selon l'évaluation du risque.",
          "na", "Dans ce contexte précis, l'évaluation du risque n'impose pas ce moyen : le critère est justifié comme non applicable.")
      ]},
      { id: "evacuation", nom: "Alarme, évacuation et issues de secours", criteres: [
        C("L'alarme incendie est-elle audible dans tous les locaux ?",
          "Lors du dernier test, l'alarme n'était pas entendue dans l'atelier de conditionnement à cause du bruit des machines.",
          "non", "Une alarme non audible par tous ne remplit pas sa fonction.",
          "Ajouter des avertisseurs sonores et lumineux dans les zones bruyantes et refaire un test complet."),
        C("Les issues de secours sont-elles dégagées et déverrouillées pendant le travail ?",
          "Une porte de secours est bloquée par des palettes et fermée par un cadenas pendant les heures de travail.",
          "non", "Une issue bloquée ou verrouillée peut piéger les personnes en cas d'incendie.",
          "Dégager immédiatement l'issue, retirer le cadenas et interdire tout stockage devant les sorties."),
        C("Le plan d'évacuation est-il affiché et clair ?",
          "Chaque niveau comporte un plan d'évacuation avec « vous êtes ici », les issues et le point de rassemblement.",
          "oui", "Un plan lisible permet à chacun, même visiteur, de trouver son chemin."),
        C("Les issues et cheminements sont-ils signalés et éclairés, y compris en cas de coupure de courant ?",
          "Des panneaux de sortie lumineux sont installés au-dessus de chaque issue, avec une alimentation de secours testée chaque mois.",
          "oui", "En cas de coupure, l'éclairage de secours et la signalisation guident vers la sortie."),
        C("Un point de rassemblement est-il défini et connu ?",
          "Le personnel ne sait pas où se rassembler après une évacuation ; certains retournent chercher leurs affaires.",
          "non", "Sans point de rassemblement connu, on ne peut pas vérifier que tout le monde est sorti.",
          "Définir un point de rassemblement sûr, le signaler et l'expliquer à tous, y compris aux visiteurs.")
      ]},
      { id: "urgence", nom: "Préparation aux situations d'urgence", criteres: [
        C("Des exercices d'évacuation sont-ils réalisés régulièrement ?",
          "Un exercice d'évacuation a lieu chaque semestre. Le temps d'évacuation est mesuré et un compte rendu des améliorations est rédigé.",
          "oui", "Les exercices révèlent les points faibles et entretiennent les bons réflexes."),
        C("Le personnel est-il formé à l'usage des extincteurs ?",
          "Aucun employé n'a manipulé un extincteur. Plusieurs pensent qu'il suffit de « tirer la goupille et viser la fumée ».",
          "non", "On vise la base des flammes et non la fumée : sans entraînement, l'extincteur est mal utilisé.",
          "Organiser une formation pratique avec manipulation et consigner les participants."),
        C("Des équipiers d'intervention ou chefs d'évacuation sont-ils désignés ?",
          "Des chefs d'évacuation sont désignés par zone et par équipe ; leurs noms sont affichés et ils portent un gilet identifiable lors des exercices.",
          "oui", "Des personnes désignées organisent l'évacuation et vérifient qu'aucune personne n'est restée à l'intérieur."),
        C("Un plan d'urgence couvre-t-il les autres situations (déversement, malaise grave, alerte météo) ?",
          "Le plan d'urgence ne traite que l'incendie. Rien n'est prévu pour un déversement d'huile ni pour un malaise grave.",
          "non", "Une préparation complète couvre toutes les urgences réalistes du site.",
          "Compléter le plan d'urgence avec les scénarios réalistes, les rôles, les moyens et les contacts."),
        C("Les services de secours externes ont-ils un accès libre au site ?",
          "Le portail principal reste ouvert en journée et la clé du portail de service est dans un coffre signalé et accessible aux secours.",
          "oui", "L'accès rapide des secours réduit le temps d'intervention.")
      ]}
    ]
  });

  /* ---------------------------------------------------------- 4 */
  L.push({
    id: "electrique", num: 4,
    titre: "Risques électriques et consignation LOTO",
    presentation: "Le risque électrique provoque électrisation, électrocution, brûlures et incendies. La consignation (LOTO : Lock Out – Tag Out) consiste à mettre hors tension et à verrouiller les sources d'énergie dangereuses avant toute intervention, puis à vérifier l'absence d'énergie.",
    objectif: "Vérifier que les installations et équipements électriques sont sûrs, que seuls des travailleurs habilités interviennent et que la procédure de consignation est appliquée rigoureusement avant tout travail sur un équipement.",
    contexte: "Vous auditez l'atelier de maintenance d'une usine de transformation avec tableaux électriques, convoyeurs, pompes et un compresseur, où interviennent un électricien et trois mécaniciens.",
    infos: [
      "Une intervention sur une installation sous tension n'est acceptable que si elle est strictement encadrée.",
      "La consignation comporte : séparer, condamner (cadenas), vérifier l'absence de tension, puis intervenir.",
      "Chaque intervenant doit poser son propre cadenas : un cadenas = une personne."
    ],
    categories: [
      { id: "installations", nom: "Installations et équipements électriques", criteres: [
        C("Les installations électriques sont-elles vérifiées périodiquement par une personne compétente ?",
          "Le rapport de contrôle de l'installation date de moins d'un an et les écarts relevés ont été corrigés ; les justificatifs sont classés.",
          "oui", "Le contrôle périodique détecte les défauts d'isolement et d'échauffement avant qu'ils ne provoquent un accident."),
        C("Les armoires et tableaux électriques sont-ils fermés, signalés et dégagés ?",
          "Un tableau électrique reste ouvert, sans porte, avec des câbles à nu ; des cartons sont stockés devant.",
          "non", "Un tableau ouvert expose au contact direct et un accès obstrué empêche de couper rapidement le courant.",
          "Fermer et sécuriser le tableau, remettre la porte, signaler « Danger électrique » et libérer l'accès."),
        C("Les câbles et rallonges sont-ils en bon état ?",
          "Des rallonges dont la gaine est coupée et réparées au ruban adhésif traînent au sol dans l'atelier.",
          "non", "Une gaine abîmée laisse des conducteurs accessibles ; le ruban adhésif n'est pas une réparation fiable.",
          "Retirer et remplacer les câbles endommagés, ranger les rallonges hors des zones de passage."),
        C("Des protections différentielles et des mises à la terre sont-elles en place ?",
          "Les circuits des prises de l'atelier sont protégés par un dispositif différentiel testé chaque mois avec le bouton « test ».",
          "oui", "Le dispositif différentiel coupe le courant en cas de fuite et protège contre l'électrisation."),
        C("Les équipements utilisés dans les zones humides sont-ils adaptés ?",
          "Le nettoyage de l'atelier se fait à grande eau, et plusieurs prises standards non étanches sont installées à hauteur du sol.",
          "non", "Eau et électricité sont une association dangereuse : les matériels doivent avoir un degré de protection adapté.",
          "Remplacer les prises par des modèles étanches, les surélever et séparer les zones de lavage."),
        C("Les outils électriques portatifs sont-ils contrôlés avant usage ?",
          "Une étiquette de contrôle avec date est collée sur chaque outil et les outils sans étiquette sont retirés.",
          "oui", "Une étiquette de contrôle permet de savoir en un coup d'œil qu'un outil est vérifié.")
      ]},
      { id: "habilitations", nom: "Habilitations et compétences", criteres: [
        C("Seules les personnes habilitées effectuent-elles des travaux électriques ?",
          "Un mécanicien non habilité a remplacé un contacteur dans une armoire, sur la demande de son chef d'équipe.",
          "non", "Les opérations électriques exigent une formation et une habilitation : intervenir sans compétence expose à l'électrocution.",
          "Interdire toute intervention électrique aux personnes non habilitées et former le personnel concerné."),
        C("Les habilitations sont-elles à jour et adaptées aux tâches ?",
          "L'électricien est habilité pour les opérations réalisées ; son titre d'habilitation est valide et son niveau est précisé.",
          "oui", "Une habilitation à jour et précise garantit que la personne maîtrise les dangers de la tâche."),
        C("Le personnel non électricien connaît-il les règles de base du risque électrique ?",
          "Une sensibilisation annuelle de 45 minutes est donnée aux opérateurs et mécaniciens, avec émargement.",
          "oui", "Même non habilitée, une personne doit savoir reconnaître le danger et ne pas toucher."),
        C("Une procédure d'intervention d'urgence en cas d'électrisation est-elle connue ?",
          "Personne ne sait comment couper le courant ni comment secourir une victime d'électrisation sans se mettre en danger.",
          "non", "Toucher une victime encore en contact avec le courant peut électriser le sauveteur : il faut d'abord couper l'alimentation.",
          "Former le personnel à la conduite à tenir et afficher la consigne près des armoires, avec la localisation du coupe-circuit général.")
      ]},
      { id: "loto", nom: "Consignation LOTO et maîtrise des énergies dangereuses", criteres: [
        C("Une procédure écrite de consignation existe-t-elle et est-elle connue ?",
          "Une procédure LOTO écrite décrit les étapes pour chaque machine ; elle est affichée dans l'atelier et expliquée aux mécaniciens.",
          "oui", "Une procédure écrite et connue donne la même méthode à tous les intervenants."),
        C("Chaque source d'énergie dangereuse (électrique, pneumatique, hydraulique, mécanique) est-elle identifiée ?",
          "Pour le convoyeur, seule l'alimentation électrique est coupée. Le réservoir d'air comprimé reste sous pression pendant l'intervention.",
          "non", "Une énergie résiduelle (air, huile sous pression, ressort, pièce suspendue) peut faire redémarrer ou bouger la machine.",
          "Identifier toutes les énergies de chaque machine, prévoir leur purge ou leur blocage et les inscrire dans la fiche de consignation."),
        C("Chaque intervenant pose-t-il son propre cadenas personnel ?",
          "Deux mécaniciens travaillent sur une pompe. Un seul cadenas, posé par le chef d'équipe, protège les deux.",
          "non", "Chacun doit avoir son cadenas : tant que le sien est en place, personne ne peut remettre en service.",
          "Exiger un cadenas par intervenant, avec boîte de consignation collective si plusieurs personnes interviennent."),
        C("L'absence d'énergie est-elle vérifiée avant l'intervention ?",
          "Avant de démonter le moteur, l'électricien teste le démarrage de la machine et vérifie l'absence de tension avec un appareil adapté.",
          "oui", "La vérification d'absence d'énergie est l'étape qui confirme que la consignation est réellement efficace."),
        C("Les cadenas et étiquettes de consignation sont-ils identifiables et réservés à cet usage ?",
          "Des cadenas ordinaires, sans nom, servent aussi à fermer les armoires de vêtements. Aucune étiquette n'indique qui a consigné.",
          "non", "Un cadenas LOTO doit identifier son propriétaire et ne servir qu'à la consignation.",
          "Fournir des cadenas dédiés, nominatifs, d'une couleur distincte, et des étiquettes indiquant le nom, la date et le motif."),
        C("La déconsignation suit-elle une procédure ?",
          "Après l'intervention, le mécanicien enlève son cadenas, vérifie que les protections sont remises, que personne n'est dans la zone, et prévient l'équipe avant la remise sous tension.",
          "oui", "La remise en service doit être contrôlée : protections remises, zone dégagée et personnel informé."),
        C("Un travail sous tension est-il autorisé uniquement dans des conditions strictement encadrées ?",
          "Pour dépanner un circuit de commande, l'électricien intervient sous tension sans autorisation écrite ni mode opératoire, « pour gagner du temps ».",
          "non", "Le travail sous tension doit rester exceptionnel, avec autorisation, mode opératoire, matériel adapté et personnel spécialement formé.",
          "Interdire l'intervention sous tension sans autorisation écrite et consigner systématiquement tant que la consignation est possible.")
      ]}
    ]
  });
})();
