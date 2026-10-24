/* ==========================================================
   My-QHSE Tools – documents-acces.js
   Accès administrateur aux documents réservés.

   Les documents réservés sont CHIFFRÉS (AES-256) dans le dossier « documents » :
   sans le code administrateur, leur contenu est illisible, même en
   connaissant leur adresse. Le code n'est écrit nulle part dans le site.
   Le sel ci-dessous n'est pas secret.
   ========================================================== */
(function () {
  "use strict";
  var CONF = { sel: "m+yLKHcVd+DwexxWHWfK+w==", iterations: 310000, verification: "documents/acces.enc", attendu: "QHSE-OK" };
  var CLE_SESSION = "qhse-admin", cle = null, ecouteurs = [];

  function octets(b64) { var s = atob(b64), u = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; }
  function normaliser(t) { return String(t || "").trim().toUpperCase().replace(/\s+/g, ""); }
  function prevenir() { ecouteurs.forEach(function (f) { try { f(!!cle); } catch (e) {} }); }

  async function deriver(code) {
    if (!window.crypto || !crypto.subtle) throw new Error("secure");
    var base = await crypto.subtle.importKey("raw", new TextEncoder().encode(code), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt: octets(CONF.sel), iterations: CONF.iterations, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  }
  async function dechiffrerAvec(k, buffer) {
    var u = new Uint8Array(buffer);
    return crypto.subtle.decrypt({ name: "AES-GCM", iv: u.slice(0, 12) }, k, u.slice(12));
  }

  async function deverrouiller(texte) {
    var code = normaliser(texte);
    if (!code) throw new Error("vide");
    var k = await deriver(code);
    var rep = await fetch(CONF.verification, { cache: "no-store" });
    if (!rep.ok) throw new Error("reseau");
    var clair;
    try { clair = await dechiffrerAvec(k, await rep.arrayBuffer()); } catch (e) { throw new Error("code"); }
    if (new TextDecoder().decode(clair) !== CONF.attendu) throw new Error("code");
    cle = k;
    try { sessionStorage.setItem(CLE_SESSION, code); } catch (e) {}
    prevenir();
    return true;
  }

  window.QHSEAcces = {
    actif: function () { return !!cle; },
    deverrouiller: deverrouiller,
    /* Au rechargement de la page, rouvre l'accès tant que l'onglet du navigateur n'a pas été fermé */
    restaurer: async function () {
      var code = null;
      try { code = sessionStorage.getItem(CLE_SESSION); } catch (e) {}
      if (!code) return false;
      try { return await deverrouiller(code); } catch (e) { try { sessionStorage.removeItem(CLE_SESSION); } catch (e2) {} return false; }
    },
    verrouiller: function () { cle = null; try { sessionStorage.removeItem(CLE_SESSION); } catch (e) {} prevenir(); },
    dechiffrer: async function (buffer) {
      if (!cle) throw new Error("verrouille");
      try { return await dechiffrerAvec(cle, buffer); } catch (e) { throw new Error("illisible"); }
    },
    surChangement: function (f) { ecouteurs.push(f); }
  };
})();
