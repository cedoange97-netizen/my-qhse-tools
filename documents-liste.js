/* ==========================================================
   My-QHSE Tools – documents-liste.js
   Liste des documents de la bibliothèque (Word .docx / Excel .xlsx / pages).

   Chaque ligne = un document. Champs :
     titre, description (facultatif), categorie (facultatif), fichier,
     type   : "word" | "excel" | "pages"  (seulement si le nom du fichier ne suffit pas),
     acces  : "admin" = document RÉSERVÉ : fichier chiffré (.enc), les visiteurs voient
              « Bientôt disponible », l'administrateur l'ouvre avec son code.
              Sans « acces », le document est ouvert à tout le monde.

   Pour ajouter un document ouvert à tous :
     mettez le fichier dans le dossier « documents » et ajoutez une ligne ci-dessous.
   Pour un document réservé : chiffrez-le d'abord (outils-admin/chiffrer.mjs).
   ========================================================== */
window.QHSE_DOCUMENTS = [
  { titre: "Tableau de bord QHSE – Environnement", description: "Indicateurs environnementaux par type de gestion d’impacts, avec statuts de conformité.", categorie: "Modèles", fichier: "documents/tableau-de-bord-qhse-environnement.xlsx.enc", type: "excel", acces: "admin" },
  { titre: "HACCP – Guide de mise en œuvre", description: "Démarche de prévention sanitaire : équipe, audit, évaluation des risques et mesures correctives.", categorie: "Guides", fichier: "documents/haccp-guide-mise-en-oeuvre.pages.enc", type: "pages", acces: "admin" }
];
