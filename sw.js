/* My-QHSE Tools – sw.js : service worker (fonctionnement hors ligne + installation).
   Pour publier une nouvelle version du site : changer le numéro VERSION ci-dessous. */
var VERSION = "v1";
var CACHE = "myqhse-" + VERSION;

/* Fichiers mis en cache dès l'installation (le site fonctionne ensuite sans réseau) */
var COEUR = [
  "./", "./index.html", "./offline.html", "./manifest.webmanifest",
  "css/style.css", "css/quiz.css", "css/bibliotheque.css", "css/outils.css", "css/terrain.css",
  "css/checklists.css", "css/parametres.css", "css/liens.css", "css/documents.css", "css/premium.css",
  "js/parametres.js", "js/app.js", "js/bibliotheque.js", "js/terrain.js", "js/checklists.js",
  "js/quiz.js", "js/quiz-cartes.js", "js/cloud-sync.js", "js/documents.js", "js/documents-acces.js",
  "js/lecteur-office.js", "js/liens.js", "js/accueil.js", "js/assistant.js", "js/activite.js", "js/pwa.js",
  "js/data/sujets.js", "js/data/banque-management.js", "js/data/banque-qualite.js",
  "js/data/banque-sante-securite.js", "js/data/banque-hygiene.js", "js/data/banque-environnement.js",
  "js/data/banque-transversal.js", "js/data/images-livret.js", "js/data/banque-livret.js",
  "js/data/causes.js", "js/data/glossaire.js", "js/data/checklists-data-1.js",
  "js/data/checklists-data-2.js", "js/data/checklists-data-3.js", "js/data/logo-myqhse.js",
  "js/data/documents-liste.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      /* un fichier absent ne doit pas faire échouer toute l'installation */
      return Promise.all(COEUR.map(function (u) { return c.add(u).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (noms) {
      return Promise.all(noms.filter(function (n) { return n.indexOf("myqhse-") === 0 && n !== CACHE; })
        .map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("message", function (e) {
  if (e.data === "skipWaiting") self.skipWaiting();
});

function memoriser(req, rep) {
  if (rep && (rep.ok || rep.type === "opaque")) {
    var copie = rep.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copie); });
  }
  return rep;
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  /* L'API (Cloudflare Worker : assistant IA, résultats de quiz, activité) n'est jamais mise en cache */
  if (url.hostname.indexOf("workers.dev") > -1) return;
  /* La page d'administration reste toujours en direct */
  if (url.origin === location.origin && /\/admin\.html$/.test(url.pathname)) return;

  /* Pages : réseau d'abord (toujours la dernière version), sinon cache, sinon page hors ligne */
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (rep) { return memoriser("./index.html", rep.clone()), rep; })
        .catch(function () {
          return caches.match("./index.html").then(function (r) { return r || caches.match("./offline.html"); });
        })
    );
    return;
  }

  /* Ressources du site + bibliothèque PDF (cdnjs) : cache d'abord, mise à jour en arrière-plan */
  var memeOrigine = url.origin === location.origin;
  var cdn = url.hostname === "cdnjs.cloudflare.com";
  if (!memeOrigine && !cdn) return;
  e.respondWith(
    caches.match(req).then(function (enCache) {
      var reseau = fetch(req).then(function (rep) { return memoriser(req, rep); }).catch(function () { return enCache; });
      return enCache || reseau;
    })
  );
});
