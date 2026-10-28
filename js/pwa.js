/* My-QHSE Tools – pwa.js : enregistre le service worker et propose « Installer l'application ». */
(function () {
  "use strict";

  /* 1) Service worker (fonctionne seulement en https ou sur localhost) */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").then(function (reg) {
        reg.addEventListener("updatefound", function () {
          var n = reg.installing;
          if (!n) return;
          n.addEventListener("statechange", function () {
            if (n.state === "installed" && navigator.serviceWorker.controller) afficherBandeau("Une nouvelle version est disponible.", "Actualiser", function () { location.reload(); });
          });
        });
      }).catch(function () {});
    });
  }

  /* 2) Invitation à installer */
  function installee() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }
  function refuse() { try { return localStorage.getItem("qhse_pwa_refus") === "1"; } catch (e) { return false; } }
  function memoriserRefus() { try { localStorage.setItem("qhse_pwa_refus", "1"); } catch (e) {} }

  function afficherBandeau(texte, libelle, action, fermable) {
    if (document.getElementById("pwa-bandeau")) return;
    var b = document.createElement("div");
    b.id = "pwa-bandeau";
    b.setAttribute("role", "status");
    b.style.cssText = "position:fixed;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom,0px));z-index:70;display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:#075e54;color:#fff;box-shadow:0 6px 24px rgba(0,0,0,.3);font:15px/1.35 system-ui,sans-serif;max-width:520px;margin:0 auto";
    var t = document.createElement("span");
    t.style.flex = "1";
    t.textContent = texte;
    b.appendChild(t);
    if (libelle) {
      var o = document.createElement("button");
      o.type = "button";
      o.textContent = libelle;
      o.style.cssText = "border:0;border-radius:999px;padding:9px 16px;background:#25d366;color:#073b34;font-weight:700;font-size:14px;cursor:pointer";
      o.onclick = function () { b.remove(); if (action) action(); };
      b.appendChild(o);
    }
    if (fermable) {
      var x = document.createElement("button");
      x.type = "button";
      x.setAttribute("aria-label", "Fermer");
      x.textContent = "×";
      x.style.cssText = "border:0;background:transparent;color:#fff;font-size:24px;line-height:1;padding:0 4px;cursor:pointer";
      x.onclick = function () { b.remove(); memoriserRefus(); };
      b.appendChild(x);
    }
    document.body.appendChild(b);
  }

  var invite = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    invite = e;
    if (installee() || refuse()) return;
    afficherBandeau("Installez My-QHSE Tools sur votre téléphone.", "Installer", function () {
      invite.prompt();
      invite.userChoice.then(function () { invite = null; });
    }, true);
  });
  window.addEventListener("appinstalled", function () {
    var b = document.getElementById("pwa-bandeau");
    if (b) b.remove();
    invite = null;
  });

  /* iPhone / iPad (Safari) : pas d'invitation automatique, on explique le geste */
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  var safari = /safari/i.test(navigator.userAgent) && !/crios|fxios|edgios/i.test(navigator.userAgent);
  if (ios && safari && !installee() && !refuse()) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        afficherBandeau("Pour installer : touchez Partager, puis « Sur l'écran d'accueil ».", null, null, true);
      }, 2500);
    });
  }

  /* Bouton manuel possible ailleurs dans le site : window.QHSEInstaller() */
  window.QHSEInstaller = function () {
    if (invite) { invite.prompt(); return true; }
    return false;
  };
})();
