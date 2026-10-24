// My-QHSE Tools — envoi des résultats de quiz vers le backend (aucun secret ici).
// Usage : window.dispatchEvent(new CustomEvent("qhse:quiz-finished", { detail: { theme, score, total, correctCount, wrongCount, durationSeconds, answers } }))
(function () {
  "use strict";
  var API = "https://my-qhse-api-ci.cedoange97.workers.dev/api/quiz-results";
  var QUEUE = "qhse_pending_results";
  var PID = "qhse_participant_id";
  var flushing = false;

  function rnd() {
    var s = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2));
    return s.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64);
  }
  function participantId() {
    try {
      var v = localStorage.getItem(PID);
      if (!v) { v = rnd(); localStorage.setItem(PID, v); }
      return v;
    } catch (e) { return undefined; }
  }
  function readQueue() { try { return JSON.parse(localStorage.getItem(QUEUE) || "[]"); } catch (e) { return []; } }
  function writeQueue(q) { try { localStorage.setItem(QUEUE, JSON.stringify(q.slice(-20))); } catch (e) {} }

  // Résultat : "ok" (enregistré), "drop" (refusé définitivement, inutile de réessayer), "retry" (réseau / serveur / limite)
  function post(payload) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = ctrl ? setTimeout(function () { ctrl.abort(); }, 10000) : null;
    return fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (t) clearTimeout(t);
      if (r.ok) return "ok";
      if (r.status >= 400 && r.status < 500 && r.status !== 429 && r.status !== 408) return "drop";
      return "retry";
    }).catch(function () { if (t) clearTimeout(t); return "retry"; });
  }

  function enqueue(p) { writeQueue(readQueue().concat([p])); }

  // Renvoie les résultats en attente, un par un ; s'arrête au premier échec.
  function flush() {
    if (flushing) return;
    var q = readQueue();
    if (!q.length) return;
    flushing = true;
    (function next(i) {
      if (i >= q.length) { writeQueue([]); flushing = false; return; }
      post(q[i]).then(function (res) {
        if (res === "retry") { writeQueue(q.slice(i)); flushing = false; }
        else next(i + 1);
      });
    })(0);
  }

  // d = { theme, score, total, correctCount?, wrongCount?, durationSeconds?, answers? }
  function send(d) {
    try {
      d = d || {};
      var p = {
        theme: String(d.theme || "Quiz QHSE").slice(0, 100),
        score: d.score, total: d.total,
        correctCount: d.correctCount, wrongCount: d.wrongCount,
        durationSeconds: d.durationSeconds,
        answers: d.answers,
        participantId: participantId(),
        clientAttemptId: rnd().padEnd(8, "0")
      };
      return post(p).then(function (res) { if (res === "retry") enqueue(p); });
    } catch (e) { return Promise.resolve(); }   // ne jamais casser le quiz
  }

  window.MyQHSECloud = { send: send, flush: flush };
  window.addEventListener("qhse:quiz-finished", function (e) { send(e.detail || {}); });
  window.addEventListener("online", flush);
  window.addEventListener("load", flush);
  if (document.readyState === "complete") flush();   // script chargé après l’événement load
})();
