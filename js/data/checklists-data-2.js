/* ==========================================================
   My-QHSE Tools – checklists-data-2.js : thèmes 5 à 7
   Même structure que checklists-data-1.js (voir l'explication en tête de ce fichier).
   C(question, situation, reponse "oui"|"non"|"na", explication, action corrective)
   ========================================================== */
(function () {
  "use strict";
  var L = window.QHSE_CHECKLISTS = window.QHSE_CHECKLISTS || [];
  function C(q, s, r, e, a) { return { q: q, s: s, r: r, e: e, a: a || "" }; }

  /* ---------------------------------------------------------- 5 */
  L.push({
    id: "machines", num: 5,
    titre: "Machines, équipements et manutention",
    presentation: "Les machines, les appareils de levage, la manutention manuelle et les engins de chantier sont à l'origine de nombreux accidents graves : écrasement, happement, coupure, chute de charge, renversement. La prévention repose sur des protections efficaces, une maintenance sûre, des opérateurs compétents et une circulation organisée.",
    objectif: "Vérifier que les machines sont protégées et utilisées par des personnes autorisées, que la maintenance se fait en sécurité, que le levage et la manutention sont maîtrisés et que la circulation des engins et des piétons est organisée.",
    contexte: "Vous auditez une usine de fabrication de produits métalliques comprenant des presses, des meuleuses, un pont roulant, des chariots élévateurs et une zone de chargement de camions.",
    infos: [
      "Une protection retirée ou neutralisée est un écart grave, même si la machine « marche mieux » ainsi.",
      "Un appareil de levage doit être vérifié périodiquement et sa charge maximale doit être indiquée.",
      "On ne se place jamais sous une charge suspendue."
    ],
    categories: [
      { id: "protection", nom: "Protection des machines", criteres: [
        C("Les parties mobiles dangereuses des machines sont-elles protégées par des carters ?",
          "La courroie d'entraînement d'un ventilateur industriel tourne sans carter ; les opérateurs passent à côté pour atteindre le tableau.",
          "non", "Une partie mobile accessible peut happer un vêtement ou une main : la protection fixe est la première barrière.",
          "Poser un carter fixe sur la transmission et interdire l'utilisation de la machine tant qu'il n'est pas en place."),
        C("Les arrêts d'urgence sont-ils visibles, accessibles et fonctionnels ?",
          "Chaque machine possède un arrêt d'urgence rouge sur fond jaune, accessible depuis le poste ; ils sont testés chaque mois, avec enregistrement.",
          "oui", "Un arrêt d'urgence testé permet d'arrêter la machine immédiatement en cas de danger."),
        C("Les dispositifs de sécurité sont-ils en place et jamais neutralisés ?",
          "Sur la presse, le capteur de la porte de protection est court-circuité avec un morceau de fil pour gagner du temps à chaque pièce.",
          "non", "Neutraliser un dispositif de sécurité expose directement l'opérateur : la machine doit être arrêtée et remise en état.",
          "Retirer le shunt, remettre le capteur en état, sanctionner la neutralisation et rappeler la règle à tous les opérateurs."),
        C("Seuls les opérateurs formés et autorisés utilisent-ils les machines ?",
          "Une liste d'opérateurs autorisés est affichée près de chaque machine ; les nouveaux opérateurs sont formés et accompagnés avant d'être autorisés.",
          "oui", "L'autorisation nominative garantit que seules les personnes compétentes utilisent les machines."),
        C("Les consignes de sécurité sont-elles affichées à chaque machine ?",
          "Les consignes d'utilisation sont affichées sur la meuleuse, avec les EPI obligatoires et les interdits sous forme de pictogrammes.",
          "oui", "Une consigne visible au poste rappelle les règles au moment où elles servent.")
      ]},
      { id: "maintenance", nom: "Maintenance et état des équipements", criteres: [
        C("La maintenance préventive est-elle planifiée et enregistrée ?",
          "Le pont roulant, la presse et les chariots sont entretenus selon un planning ; chaque intervention est consignée dans un registre.",
          "oui", "Une maintenance préventive tracée réduit les pannes et les accidents liés à l'usure."),
        C("Les interventions de maintenance se font-elles machine consignée ?",
          "Un mécanicien nettoie un rouleau de convoyeur pendant qu'il tourne, « parce que c'est plus rapide ».",
          "non", "Intervenir sur une machine en marche expose au happement : l'arrêt et la consignation sont obligatoires.",
          "Arrêter et consigner avant toute intervention, et former les mécaniciens à la procédure de consignation."),
        C("Les machines défectueuses sont-elles retirées du service et signalées ?",
          "Une meuleuse présentant un disque fissuré est étiquetée « Hors service » et rangée dans une zone dédiée en attendant sa réparation.",
          "oui", "Un équipement défectueux signalé et isolé ne peut plus être utilisé par erreur."),
        C("Les outils à main et portatifs sont-ils en bon état ?",
          "Des marteaux à manche fendu et des clés usées sont utilisés dans l'atelier ; aucune inspection des outils n'a lieu.",
          "non", "Un outil défectueux peut casser ou glisser et provoquer une blessure.",
          "Inspecter les outils périodiquement, jeter ou réparer les outils abîmés et prévoir un rangement adapté.")
      ]},
      { id: "levage", nom: "Levage", criteres: [
        C("Les appareils de levage sont-ils vérifiés périodiquement par une personne compétente ?",
          "Le pont roulant est contrôlé chaque année par un organisme compétent ; le rapport est classé et les écarts sont soldés.",
          "oui", "Un contrôle périodique détecte l'usure des câbles, freins et crochets avant la rupture."),
        C("La charge maximale d'utilisation est-elle marquée sur les appareils et accessoires de levage ?",
          "Les élingues en usage n'ont plus d'étiquette lisible : personne ne connaît leur charge maximale.",
          "non", "Sans charge maximale lisible, on risque de surcharger l'accessoire et de provoquer sa rupture.",
          "Retirer les élingues non identifiables et ne remettre en service que des accessoires marqués et vérifiés."),
        C("Les élingues et accessoires sont-ils inspectés avant usage ?",
          "Une élingue textile coupée sur un bord est utilisée pour lever un moteur.",
          "non", "Une élingue entaillée peut rompre sous la charge : tout accessoire endommagé doit être détruit.",
          "Détruire l'élingue endommagée et instaurer une inspection visuelle avant chaque utilisation."),
        C("Les opérateurs de levage sont-ils formés et autorisés ?",
          "Le pontier et l'élingueur ont suivi une formation spécifique ; une liste de personnes autorisées est tenue à jour.",
          "oui", "Le levage exige des compétences précises : sa mauvaise exécution a des conséquences très graves."),
        C("Le personnel évite-t-il de se placer sous une charge suspendue ?",
          "Pendant le levage d'une pièce de métal, deux ouvriers guident la charge à la main en se tenant sous la pièce.",
          "non", "Une charge peut tomber à tout moment : la zone sous la charge doit être interdite, et le guidage se fait à distance.",
          "Interdire l'accès sous la charge, utiliser des cordes de guidage ou des moyens à distance et rappeler la consigne.")
      ]},
      { id: "manutention", nom: "Manutention manuelle et mécanique", criteres: [
        C("Les charges lourdes sont-elles manutentionnées avec des aides mécaniques ?",
          "Des sacs de 50 kg sont portés à la main sur plusieurs dizaines de mètres alors qu'un chariot de transport est disponible.",
          "non", "La manutention manuelle de charges lourdes provoque des lésions du dos : il faut utiliser les aides disponibles.",
          "Mettre à disposition et imposer l'usage de chariots ou diables, et réduire le poids unitaire des charges si possible."),
        C("Les opérateurs ont-ils été formés aux gestes et postures de manutention ?",
          "Une formation « gestes et postures » a eu lieu cette année pour l'ensemble des magasiniers ; les présences sont enregistrées.",
          "oui", "Savoir se placer et porter limite les risques de lombalgie, sans pour autant remplacer l'aide mécanique."),
        C("Les zones de stockage sont-elles organisées pour limiter les chutes d'objets ?",
          "Les palettes sont empilées sur quatre niveaux, instables, dans une allée où passent les chariots.",
          "non", "Un empilement instable peut s'effondrer et blesser ou bloquer la circulation.",
          "Limiter la hauteur de stockage, utiliser des racks adaptés et respecter la charge maximale des rayonnages.")
      ]},
      { id: "circulation", nom: "Circulation des engins et des piétons", criteres: [
        C("Les cheminements piétons sont-ils séparés de la circulation des engins ?",
          "Des marquages au sol et des barrières séparent l'allée piétonne des voies de chariots ; des passages protégés sont prévus aux croisements.",
          "oui", "La séparation physique des flux est la mesure la plus efficace contre les collisions."),
        C("Les conducteurs d'engins sont-ils formés et autorisés ?",
          "Un chariot élévateur est conduit par un magasinier qui n'a jamais reçu d'autorisation de conduite.",
          "non", "Conduire un engin demande une formation et une autorisation : sans elles, le risque de collision ou de renversement augmente.",
          "Interdire la conduite à la personne non autorisée, la former, puis délivrer une autorisation écrite."),
        C("Les engins sont-ils équipés d'avertisseurs (klaxon de recul, gyrophare) ?",
          "Les chariots ont un avertisseur de recul fonctionnel et un gyrophare, testés avant chaque prise de poste.",
          "oui", "Les signaux sonores et lumineux préviennent les piétons de l'approche de l'engin."),
        C("Les vitesses de circulation sont-elles limitées et respectées ?",
          "Aucune limite de vitesse n'est affichée ; les chariots circulent vite dans les allées, y compris près des sorties.",
          "non", "La vitesse augmente la distance de freinage et la gravité des chocs.",
          "Fixer une limite de vitesse, la signaler et contrôler son respect, avec des ralentisseurs aux croisements.")
      ]}
    ]
  });

  /* ---------------------------------------------------------- 6 */
  L.push({
    id: "hauteur", num: 6,
    titre: "Travail en hauteur, échafaudages et échelles",
    presentation: "La chute de hauteur est l'une des principales causes de mort et d'accidents graves sur les chantiers. La prévention repose d'abord sur des protections collectives (garde-corps, plateformes), puis, en dernier recours, sur des protections individuelles contre les chutes.",
    objectif: "Vérifier que les travaux en hauteur sont planifiés, que les protections collectives sont en place, que les échafaudages et les échelles sont sûrs et inspectés, et que les protections individuelles et le secours sont organisés.",
    contexte: "Vous auditez un chantier de construction d'un immeuble de cinq étages avec échafaudages de façade, toiture, échelles et travaux de ferraillage en bordure de dalle.",
    infos: [
      "On évite d'abord le travail en hauteur, puis on le protège collectivement, puis seulement on utilise un harnais.",
      "Un échafaudage doit être monté, modifié et démonté par des personnes compétentes, et inspecté régulièrement.",
      "Une échelle est un moyen d'accès ou un poste de travail occasionnel de courte durée, pas une plateforme de travail durable."
    ],
    categories: [
      { id: "organisation", nom: "Organisation et planification", criteres: [
        C("Les travaux en hauteur sont-ils planifiés avec une analyse des risques ?",
          "Avant le ferraillage de la dalle du quatrième étage, une analyse de risques écrite a défini les protections, les accès et les secours.",
          "oui", "Penser les protections avant le début des travaux évite les improvisations dangereuses."),
        C("Un permis de travail en hauteur est-il établi pour les tâches à risque ?",
          "Une équipe répare une toiture fragile en tôle sans permis ni protection spécifique.",
          "non", "Une toiture fragile peut céder sous le poids : des mesures particulières et une autorisation sont nécessaires.",
          "Interrompre les travaux, établir un permis, installer des chemins de circulation et des filets de protection."),
        C("Les travailleurs en hauteur sont-ils formés et aptes ?",
          "Les ouvriers affectés aux travaux en hauteur ont suivi une formation et un contrôle médical d'aptitude ; leurs attestations sont classées.",
          "oui", "Le travail en hauteur exige des compétences et une aptitude physique vérifiée."),
        C("Les conditions météorologiques sont-elles prises en compte ?",
          "Un coffreur travaille sur l'échafaudage pendant un orage ; aucune consigne d'arrêt en cas de vent fort ou de pluie n'existe.",
          "non", "Le vent, la pluie et la foudre augmentent fortement le risque de chute.",
          "Définir des seuils d'arrêt (vent, orage, pluie) et faire respecter la consigne.")
      ]},
      { id: "protections", nom: "Protections collectives contre les chutes", criteres: [
        C("Les bords de dalle et les ouvertures sont-ils protégés par des garde-corps ?",
          "Le bord de dalle du troisième étage n'a aucune protection ; une trémie ouverte est seulement signalée par un ruban.",
          "non", "Un ruban n'empêche pas de tomber : les bords et trémies doivent être protégés par des garde-corps ou des couvercles solides.",
          "Installer des garde-corps rigides, des plinthes et des couvercles fixés et signalés sur les ouvertures."),
        C("Les garde-corps sont-ils complets (lisse haute, lisse intermédiaire, plinthe) et solides ?",
          "Les garde-corps de l'échafaudage ont une lisse haute, une lisse intermédiaire et une plinthe, tous fermement fixés.",
          "oui", "Un garde-corps complet empêche la chute de personnes et d'objets."),
        C("Les protections ne sont-elles retirées qu'avec une mesure de remplacement ?",
          "Un ouvrier retire un garde-corps pour faire passer du matériel et ne le remet pas après.",
          "non", "Une protection retirée même brièvement doit être remise immédiatement ou remplacée par une mesure équivalente.",
          "Remettre le garde-corps, définir une procédure pour le déplacement temporaire et sensibiliser les équipes."),
        C("Les chutes d'objets sont-elles prévenues (plinthes, filets, zone interdite en dessous) ?",
          "Une zone de passage située sous l'échafaudage n'est ni protégée ni interdite ; des outils sont posés sur les planches du bord.",
          "non", "Un objet qui tombe de plusieurs étages peut tuer : il faut protéger les passages et empêcher les objets de tomber.",
          "Poser plinthes et filets, délimiter les zones en dessous et interdire de poser des outils en bordure."),
        C("Les passerelles et accès sont-ils dégagés et sûrs ?",
          "Les circulations sur l'échafaudage sont libres, avec des planchers complets et antidérapants.",
          "oui", "Un accès dégagé et stable limite les chutes de plain-pied et les faux pas.")
      ]},
      { id: "echafaudages", nom: "Échafaudages", criteres: [
        C("L'échafaudage est-il monté par un personnel compétent selon les instructions du fabricant ?",
          "L'échafaudage de façade a été monté par des ouvriers sans formation ; certains éléments proviennent de marques différentes.",
          "non", "Mélanger des éléments et monter sans compétence compromet la stabilité de l'ensemble.",
          "Faire vérifier et reprendre le montage par une personne compétente et n'utiliser que des éléments compatibles."),
        C("Une vérification de l'échafaudage est-elle faite avant la première utilisation et régulièrement ?",
          "Une fiche de réception est signée par une personne compétente avant utilisation ; une étiquette « Utilisable » est apposée à l'accès.",
          "oui", "La réception et le suivi garantissent que l'échafaudage est utilisable en sécurité."),
        C("L'échafaudage repose-t-il sur un sol stable avec des semelles de répartition ?",
          "Les pieds de l'échafaudage reposent directement sur un sol meuble, avec des briques instables comme cales.",
          "non", "Un sol meuble s'enfonce et peut faire basculer l'échafaudage ; des semelles et un sol compacté sont nécessaires.",
          "Compacter le sol, utiliser des semelles adaptées et vérifier le calage avant utilisation."),
        C("L'échafaudage est-il ancré à la structure et contreventé ?",
          "Les ancrages sont posés aux intervalles prévus et les diagonales de contreventement sont en place, comme sur la note de calcul.",
          "oui", "L'ancrage et le contreventement évitent le renversement et la déformation."),
        C("La charge maximale est-elle respectée ?",
          "Des palettes de briques et de sacs de ciment s'accumulent sur un niveau de l'échafaudage, au-delà de la charge indiquée.",
          "non", "Un plancher surchargé peut céder : la charge admissible doit être affichée et respectée.",
          "Retirer l'excédent, afficher la charge maximale et approvisionner par petites quantités.")
      ]},
      { id: "echelles", nom: "Échelles et escabeaux", criteres: [
        C("Les échelles sont-elles en bon état, sans barreaux manquants ni déformations ?",
          "Une échelle en bois dont deux barreaux sont fissurés et un montant réparé avec du fil de fer est utilisée.",
          "non", "Une échelle abîmée peut céder : elle doit être retirée du service.",
          "Retirer et détruire l'échelle, la remplacer par un modèle conforme et inspecter toutes les échelles du site."),
        C("L'échelle est-elle placée avec un bon angle et dépasse-t-elle du plan d'accès ?",
          "Une échelle est posée avec une inclinaison correcte, attachée en haut et dépasse d'environ un mètre au-dessus de la dalle.",
          "oui", "Un bon angle, une fixation en haut et un dépassement facilitent un accès stable et sûr."),
        C("L'échelle est-elle utilisée uniquement pour un travail de courte durée ?",
          "Un peintre travaille toute la journée en haut d'une échelle, penché de côté pour atteindre la zone à peindre.",
          "non", "Une échelle n'est pas une plateforme de travail : une longue durée ou un travail en porte-à-faux provoque des chutes.",
          "Utiliser une plateforme de travail adaptée (échafaudage roulant, plateforme individuelle roulante)."),
        C("Les échelles fixes de grande hauteur sont-elles équipées d'une protection contre les chutes (crinoline ou ligne de vie) ?",
          "Le chantier ne comporte aucune échelle fixe : tous les accès permanents sont des escaliers.",
          "na", "Sans échelle fixe sur le site, ce critère ne s'applique pas à cette situation.")
      ]},
      { id: "antichute", nom: "Protections individuelles contre les chutes et secours", criteres: [
        C("Un harnais est-il utilisé lorsque la protection collective est impossible ?",
          "Pour poser des bardages en bordure de toiture sans garde-corps possible, les ouvriers portent un harnais relié à une ligne de vie.",
          "oui", "Le harnais devient la solution de dernier recours quand le collectif n'est pas possible."),
        C("Les harnais et longes sont-ils inspectés et stockés correctement ?",
          "Des longes sont effilochées et un harnais est stocké dans une caisse humide ; aucune inspection n'est réalisée.",
          "non", "Un équipement antichute abîmé peut céder lors d'une chute.",
          "Retirer les équipements endommagés, instaurer une inspection avant usage et une vérification périodique, et améliorer le stockage."),
        C("Un plan de secours en cas de chute est-il prévu ?",
          "Aucun plan de secours n'existe : personne ne sait comment dégager un travailleur suspendu dans son harnais.",
          "non", "Une personne suspendue peut subir une grave atteinte en quelques minutes : le secours doit être prévu et exercé.",
          "Rédiger un plan de secours, prévoir le matériel et former des équipes au sauvetage en hauteur.")
      ]}
    ]
  });

  /* ---------------------------------------------------------- 7 */
  L.push({
    id: "chimie", num: 7,
    titre: "Produits chimiques et matières dangereuses",
    presentation: "Les produits chimiques peuvent être toxiques, corrosifs, inflammables ou polluants. Une bonne gestion repose sur la connaissance des produits (étiquettes, fiches de données de sécurité), un stockage séparé et sûr, une manipulation maîtrisée avec les bons EPI, et la capacité à réagir en cas de déversement.",
    objectif: "Vérifier que les produits sont identifiés, étiquetés et accompagnés de leurs fiches de données de sécurité, qu'ils sont stockés et manipulés en sécurité, que les EPI adaptés sont portés et que les déversements sont maîtrisés.",
    contexte: "Vous auditez l'atelier de peinture et de traitement de surface d'une entreprise industrielle, avec un local de stockage de solvants, d'acides, de peintures et de produits de nettoyage.",
    infos: [
      "La fiche de données de sécurité (FDS) décrit les dangers, les EPI, les premiers secours et la conduite à tenir en cas de fuite.",
      "Un produit transvasé doit garder une étiquette : un flacon sans étiquette est un danger.",
      "Des produits incompatibles (acides et bases, oxydants et inflammables) ne se stockent pas ensemble."
    ],
    categories: [
      { id: "identification", nom: "Inventaire, étiquetage et fiches de données de sécurité", criteres: [
        C("Existe-t-il un inventaire à jour des produits chimiques présents sur le site ?",
          "Un registre liste chaque produit, sa quantité, son emplacement et sa date d'entrée ; il est mis à jour à chaque réception.",
          "oui", "On ne peut pas maîtriser ce que l'on ne connaît pas : l'inventaire sert aussi aux secours en cas d'incendie."),
        C("Chaque produit possède-t-il une fiche de données de sécurité (FDS) accessible ?",
          "Pour trois solvants récemment achetés, aucune FDS n'a été fournie ni demandée au fournisseur.",
          "non", "Sans FDS, on ignore les dangers, les EPI à porter et les secours à apporter.",
          "Demander les FDS aux fournisseurs, les classer dans l'atelier et les rendre accessibles à tous."),
        C("Les récipients sont-ils étiquetés avec le nom du produit et ses pictogrammes de danger ?",
          "Des bidons de solvant transvasés dans d'anciennes bouteilles d'eau minérale n'ont aucune étiquette.",
          "non", "Une bouteille d'eau contenant un solvant peut être bue par erreur : tout contenant doit être étiqueté.",
          "Étiqueter immédiatement chaque contenant, interdire les contenants alimentaires et prévoir des flacons adaptés."),
        C("Les pictogrammes de danger sont-ils compris par le personnel ?",
          "Le personnel de l'atelier sait expliquer la signification des pictogrammes les plus courants (inflammable, corrosif, toxique) lors de la visite.",
          "oui", "Reconnaître un pictogramme permet de réagir correctement avant même de lire la fiche."),
        C("Les produits sont-ils remplacés par des produits moins dangereux lorsque c'est possible ?",
          "L'entreprise a remplacé un solvant très toxique par un produit à base d'eau pour le dégraissage, après analyse comparative.",
          "oui", "La substitution est la meilleure prévention : supprimer le danger plutôt que s'en protéger.")
      ]},
      { id: "stockage", nom: "Stockage", criteres: [
        C("Les produits incompatibles sont-ils stockés séparément ?",
          "Un acide fort est stocké sur la même étagère qu'une base forte et un solvant inflammable.",
          "non", "Une fuite pourrait provoquer une réaction violente, un dégagement de gaz ou un incendie.",
          "Séparer les produits par famille de danger, avec bacs de rétention distincts et étagères identifiées."),
        C("Le local de stockage est-il ventilé, fermé à clé et réservé aux personnes autorisées ?",
          "Le local est ventilé, fermé à clé, signalé « Produits chimiques – Accès réservé » ; la clé est gérée par le responsable.",
          "oui", "Un accès contrôlé et une ventilation évitent l'exposition et l'accumulation de vapeurs."),
        C("Les produits liquides sont-ils placés sur des bacs de rétention ?",
          "Des fûts de solvant reposent directement sur le sol en béton, sans bac de rétention, à proximité d'une évacuation d'eaux pluviales.",
          "non", "Une fuite s'étendrait sur le sol et pourrait atteindre le réseau d'eaux pluviales.",
          "Installer des bacs de rétention de capacité adaptée et boucher ou protéger les évacuations proches."),
        C("Les quantités stockées sont-elles limitées au strict nécessaire ?",
          "Plusieurs mois de stock de peintures inflammables sont conservés dans l'atelier, près d'un poste de soudure.",
          "non", "Plus la quantité est élevée, plus l'incendie ou la fuite sera grave ; l'inflammable ne doit pas être près d'une source de chaleur.",
          "Limiter les quantités en atelier au besoin quotidien et stocker le reste dans un local adapté, loin des sources de chaleur."),
        C("Les produits inflammables sont-ils stockés dans une armoire adaptée ?",
          "Les solvants sont stockés dans une armoire de sécurité coupe-feu ventilée, éloignée des sources d'ignition.",
          "oui", "L'armoire coupe-feu protège les produits en cas d'incendie et limite la propagation.")
      ]},
      { id: "manipulation", nom: "Manipulation et protection du personnel", criteres: [
        C("Les EPI indiqués par la FDS sont-ils portés lors de la manipulation ?",
          "Un opérateur verse un acide sans gants ni lunettes, en manches courtes ; la FDS exige des gants résistants et des lunettes de protection.",
          "non", "Les EPI sont choisis d'après la FDS : sans eux, une projection provoque des brûlures graves.",
          "Fournir et imposer les EPI de la FDS (gants adaptés au produit, lunettes, tablier) et vérifier leur port."),
        C("Les gants fournis sont-ils adaptés au produit manipulé ?",
          "Pour manipuler du solvant, les opérateurs reçoivent des gants en latex fins, alors que la FDS recommande un autre matériau.",
          "non", "Un gant inadapté peut être traversé rapidement par le produit sans que l'on s'en aperçoive.",
          "Choisir les gants selon la FDS et la durée de contact, et les remplacer selon les consignes."),
        C("Une douche de sécurité et un lave-œil sont-ils disponibles et testés près des postes à risque ?",
          "Un lave-œil est installé à quelques mètres du poste de manipulation d'acide ; il est testé chaque semaine et l'accès est dégagé.",
          "oui", "En cas de projection, le rinçage immédiat limite fortement la gravité de la blessure."),
        C("Les transvasements se font-ils avec des moyens adaptés (entonnoirs, pompes, mise à la terre pour les inflammables) ?",
          "Pour transvaser du solvant inflammable, les opérateurs versent directement avec un seau, sans mise à la terre.",
          "non", "Le versement libre produit éclaboussures, vapeurs et électricité statique, qui peut enflammer le solvant.",
          "Utiliser des pompes ou robinets, des entonnoirs, et relier les fûts à la terre pour les produits inflammables."),
        C("Est-il interdit de manger, boire ou fumer dans les zones où les produits sont utilisés, et cette règle est-elle respectée ?",
          "L'interdiction est affichée et respectée ; un espace de repos propre est prévu à l'extérieur de l'atelier.",
          "oui", "Éviter de manger ou boire sur place empêche l'ingestion accidentelle de produits.")
      ]},
      { id: "deversement", nom: "Déversements et urgences", criteres: [
        C("Des kits antidéversement sont-ils disponibles près des zones de stockage et de manipulation ?",
          "Aucun matériau absorbant n'est disponible : en cas de fuite, le personnel utilise des chiffons ou jette de l'eau sur le sol.",
          "non", "L'eau étale le produit et le fait entrer dans les drains : il faut des absorbants adaptés.",
          "Installer des kits de dépollution (absorbants, boudins, sacs) signalés et vérifier leur contenu régulièrement."),
        C("Le personnel sait-il quoi faire en cas de déversement ?",
          "Une consigne affichée détaille les étapes : sécuriser la zone, informer, porter les EPI, contenir, absorber, éliminer ; un exercice a eu lieu.",
          "oui", "Une consigne connue permet une réaction rapide et correcte."),
        C("Les déchets de nettoyage des déversements sont-ils éliminés correctement ?",
          "Les absorbants souillés sont jetés dans la poubelle ordinaire de l'atelier.",
          "non", "Les absorbants souillés restent des déchets dangereux : ils doivent suivre une filière adaptée.",
          "Prévoir des contenants spécifiques pour les déchets souillés et les faire enlever par une filière agréée."),
        C("Les premiers secours en cas d'intoxication ou de brûlure chimique sont-ils connus ?",
          "Les coordonnées du centre antipoison ou de secours et les gestes de base (rincer, retirer les vêtements souillés) sont affichés avec chaque FDS.",
          "oui", "Les premiers gestes réalisés immédiatement réduisent beaucoup la gravité.")
      ]},
      { id: "formation", nom: "Formation", criteres: [
        C("Le personnel exposé a-t-il reçu une formation sur les dangers des produits utilisés ?",
          "Les opérateurs n'ont reçu aucune formation sur les produits de l'atelier ; ils apprennent « sur le tas ».",
          "non", "Sans formation, on ne sait pas lire une étiquette ni choisir l'EPI : l'erreur est probable.",
          "Organiser une formation sur les dangers, l'étiquetage, les FDS, les EPI et la conduite à tenir, et enregistrer les participants."),
        C("Une surveillance de l'exposition ou un suivi médical est-il prévu si nécessaire ?",
          "Les produits utilisés sont à faible danger et les évaluations n'indiquent aucune exposition significative ; aucune surveillance spécifique n'est requise.",
          "na", "L'évaluation montre une exposition non significative : le critère est justifié comme non applicable ici.")
      ]}
    ]
  });
})();
