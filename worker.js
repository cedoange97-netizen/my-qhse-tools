// My-QHSE Tools API — Cloudflare Worker (liaison D1 : DB, secret : ADMIN_TOKEN)
const ALLOWED_ORIGIN = "https://cedoange97-netizen.github.io";
const MAX_BODY = 20000;
const MAX_PHOTO = 450000;                          // taille max d'une photo (JSON)
const PHOTO_LIMIT = { max: 30, windowSec: 600 };   // 30 photos / 10 min / IP
const POST_LIMIT = { max: 10, windowSec: 600 };   // 10 envois / 10 min / IP
const ADMIN_LIMIT = { max: 20, windowSec: 600 };  // 20 requêtes admin / 10 min / IP

const enc = new TextEncoder();
const sha256 = async (s) => new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(s)));
const hex = (u8) => [...u8].map((b) => b.toString(16).padStart(2, "0")).join("");
const isInt = Number.isInteger;

async function rateLimit(env, key, { max, windowSec }) {
  const now = Math.floor(Date.now() / 1000);
  const ws = now - (now % windowSec);
  await env.DB.prepare(
    "INSERT INTO rate_limits(key, window_start, hits) VALUES(?, ?, 1) " +
    "ON CONFLICT(key, window_start) DO UPDATE SET hits = hits + 1"
  ).bind(key, ws).run();
  const row = await env.DB.prepare(
    "SELECT hits FROM rate_limits WHERE key = ? AND window_start = ?"
  ).bind(key, ws).first();
  if (Math.random() < 0.02) {
    await env.DB.prepare("DELETE FROM rate_limits WHERE window_start < ?").bind(now - 86400).run();
  }
  return (row?.hits ?? 1) <= max;
}

async function isAdmin(request, env) {
  if (!env.ADMIN_TOKEN) return null; // non configuré
  const auth = request.headers.get("Authorization") || "";
  const m = auth.match(/^Bearer (.+)$/);
  if (!m) return false;
  const [a, b] = await Promise.all([sha256(m[1]), sha256(env.ADMIN_TOKEN)]);
  return crypto.subtle.timingSafeEqual(a, b);
}

function validate(d) {
  if (!d || typeof d !== "object") return "Corps JSON invalide";
  const { theme, score, total } = d;
  if (typeof theme !== "string" || !theme.trim() || theme.length > 100) return "theme invalide";
  if (!isInt(total) || total < 1 || total > 50) return "total invalide";
  if (!isInt(score) || score < 0 || score > total) return "score invalide";
  if (d.correctCount !== undefined && (!isInt(d.correctCount) || d.correctCount < 0 || d.correctCount > total)) return "correctCount invalide";
  if (d.wrongCount !== undefined && (!isInt(d.wrongCount) || d.wrongCount < 0 || d.wrongCount > total)) return "wrongCount invalide";
  if (d.correctCount !== undefined && d.wrongCount !== undefined && d.correctCount + d.wrongCount > total) return "bonnes + mauvaises > total";
  if (d.durationSeconds !== undefined && (!isInt(d.durationSeconds) || d.durationSeconds < 0 || d.durationSeconds > 86400)) return "durationSeconds invalide";
  if (d.answers !== undefined && (!Array.isArray(d.answers) || d.answers.length > 50)) return "answers invalide";
  if (d.participantId !== undefined && !/^[A-Za-z0-9_-]{1,64}$/.test(d.participantId)) return "participantId invalide";
  if (d.clientAttemptId !== undefined && !/^[A-Za-z0-9_-]{8,64}$/.test(d.clientAttemptId)) return "clientAttemptId invalide";
  return null;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Vary": "Origin",
      ...(origin === ALLOWED_ORIGIN ? {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
      } : {})
    };
    const respond = (data, status = 200, extra = {}) =>
      new Response(JSON.stringify(data), { status, headers: { ...headers, ...extra } });

    if (origin && origin !== ALLOWED_ORIGIN) return respond({ error: "Origine non autorisée" }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });

    const url = new URL(request.url);
    const path = url.pathname;
    const ipHash = hex(await sha256((request.headers.get("CF-Connecting-IP") || "?") + "|" + (env.HASH_SALT || "qhse"))).slice(0, 32);

    try {
      // ---- Santé ----
      if (request.method === "GET" && path === "/health") {
        return respond({ service: "My-QHSE Tools API", status: "online" });
      }
      if (request.method === "GET" && path === "/health/db") {
        const r = await env.DB.prepare("SELECT COUNT(*) AS n FROM quiz_attempts").first();
        return respond({ service: "My-QHSE Tools API", status: "online", database: "ok", attempts: r.n });
      }

      // ---- Enregistrement d'un résultat ----
      if (request.method === "POST" && (path === "/api/quiz-results" || path === "/api/quiz-attempt")) {
        if (!(request.headers.get("Content-Type") || "").includes("application/json")) return respond({ error: "Format JSON requis" }, 415);
        if (Number(request.headers.get("Content-Length") || 0) > MAX_BODY) return respond({ error: "Données trop volumineuses" }, 413);
        if (!(await rateLimit(env, "post:" + ipHash, POST_LIMIT))) return respond({ error: "Trop de requêtes, réessayez plus tard" }, 429, { "Retry-After": "600" });

        const raw = await request.text();
        if (raw.length > MAX_BODY) return respond({ error: "Données trop volumineuses" }, 413);
        let d;
        try { d = JSON.parse(raw); } catch { return respond({ error: "JSON invalide" }, 400); }
        const err = validate(d);
        if (err) return respond({ error: "Données de quiz invalides : " + err }, 400);

        const correct = d.correctCount ?? d.score;
        const wrong = d.wrongCount ?? (d.total - correct);
        const res = await env.DB.prepare(
          "INSERT OR IGNORE INTO quiz_attempts " +
          "(participant_id, theme, score, total, answers_json, correct_count, wrong_count, duration_seconds, client_attempt_id) " +
          "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(d.participantId ?? null, d.theme.trim(), d.score, d.total, JSON.stringify(d.answers ?? []),
               correct, wrong, d.durationSeconds ?? null, d.clientAttemptId ?? null).run();
        const created = res.meta.changes > 0;
        return respond({ success: true, message: created ? "Résultat enregistré" : "Résultat déjà enregistré" }, created ? 201 : 200);
      }

      // ---- Photos (copie cloud facultative, anonyme) ----
      if (request.method === "POST" && path === "/api/photos") {
        if (!(request.headers.get("Content-Type") || "").includes("application/json")) return respond({ error: "Format JSON requis" }, 415);
        if (Number(request.headers.get("Content-Length") || 0) > MAX_PHOTO) return respond({ error: "Photo trop volumineuse" }, 413);
        if (!(await rateLimit(env, "ph:" + ipHash, PHOTO_LIMIT))) return respond({ error: "Trop de requêtes, réessayez plus tard" }, 429, { "Retry-After": "600" });
        const raw = await request.text();
        if (raw.length > MAX_PHOTO) return respond({ error: "Photo trop volumineuse" }, 413);
        let d;
        try { d = JSON.parse(raw); } catch { return respond({ error: "JSON invalide" }, 400); }
        const okId = (s, min) => typeof s === "string" && new RegExp("^[A-Za-z0-9_-]{" + min + ",64}$").test(s);
        if (!d || !["incident", "inspection", "epi"].includes(d.kind)) return respond({ error: "kind invalide" }, 400);
        if (!okId(d.photoId, 8) || !okId(d.reportRef, 2)) return respond({ error: "identifiant invalide" }, 400);
        if (d.participantId !== undefined && !okId(d.participantId, 1)) return respond({ error: "participantId invalide" }, 400);
        if (typeof d.dataUrl !== "string" || !/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(d.dataUrl)) return respond({ error: "Image JPEG requise" }, 400);
        const res = await env.DB.prepare(
          "INSERT OR IGNORE INTO photos (participant_id, kind, report_ref, client_photo_id, data) VALUES (?, ?, ?, ?, ?)"
        ).bind(d.participantId ?? null, d.kind, d.reportRef, d.photoId, d.dataUrl).run();
        const created = res.meta.changes > 0;
        return respond({ success: true, message: created ? "Photo enregistrée" : "Photo déjà enregistrée" }, created ? 201 : 200);
      }

      // ---- Administration ----
      if (path.startsWith("/api/admin/")) {
        if (request.method !== "GET") return respond({ error: "Méthode non autorisée" }, 405);
        if (!(await rateLimit(env, "adm:" + ipHash, ADMIN_LIMIT))) return respond({ error: "Trop de requêtes" }, 429, { "Retry-After": "600" });
        const ok = await isAdmin(request, env);
        if (ok === null) return respond({ error: "Administration non configurée" }, 503);
        if (!ok) return respond({ error: "Non autorisé" }, 401, { "WWW-Authenticate": "Bearer" });

        if (path === "/api/admin/stats") {
          const [tot, byTheme, byDay] = await Promise.all([
            env.DB.prepare("SELECT COUNT(*) AS attempts, COALESCE(SUM(total),0) AS questions, COALESCE(SUM(score),0) AS correct, " +
              "ROUND(AVG(100.0*score/total),1) AS avg_percent, ROUND(AVG(duration_seconds),0) AS avg_duration_s, " +
              "COUNT(DISTINCT participant_id) AS participants FROM quiz_attempts").first(),
            env.DB.prepare("SELECT theme, COUNT(*) AS attempts, ROUND(AVG(100.0*score/total),1) AS avg_percent FROM quiz_attempts GROUP BY theme ORDER BY attempts DESC LIMIT 50").all(),
            env.DB.prepare("SELECT substr(created_at,1,10) AS day, COUNT(*) AS attempts, ROUND(AVG(100.0*score/total),1) AS avg_percent FROM quiz_attempts " +
              "WHERE created_at >= date('now','-30 day') GROUP BY day ORDER BY day").all()
          ]);
          return respond({ totals: tot, byTheme: byTheme.results, last30Days: byDay.results });
        }
        if (path === "/api/admin/attempts") {
          const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 1), 200);
          const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10) || 0, 0);
          const r = await env.DB.prepare(
            "SELECT id, participant_id, theme, score, total, correct_count, wrong_count, duration_seconds, created_at " +
            "FROM quiz_attempts ORDER BY id DESC LIMIT ? OFFSET ?").bind(limit, offset).all();
          return respond({ limit, offset, attempts: r.results });
        }
        if (path === "/api/admin/photos") {
          const r = await env.DB.prepare("SELECT id, participant_id, kind, report_ref, length(data) AS size, created_at FROM photos ORDER BY id DESC LIMIT 100").all();
          return respond({ photos: r.results });
        }
        if (path === "/api/admin/photo") {
          const id = parseInt(url.searchParams.get("id") || "", 10);
          const r = isInt(id) ? await env.DB.prepare("SELECT id, kind, report_ref, data, created_at FROM photos WHERE id = ?").bind(id).first() : null;
          return r ? respond(r) : respond({ error: "Photo introuvable" }, 404);
        }
        return respond({ error: "Route introuvable" }, 404);
      }

      return respond({ error: "Route introuvable" }, 404);
    } catch (e) {
      return respond({ error: "Erreur serveur. Vérifiez la liaison D1 (DB)." }, 500);
    }
  }
};
