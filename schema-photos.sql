-- À exécuter une fois sur la base D1 « my-qhse-db » (console Cloudflare > D1 > Console)
CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT,
  kind TEXT NOT NULL,
  report_ref TEXT NOT NULL,
  client_photo_id TEXT UNIQUE,
  data TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
