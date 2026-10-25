-- À exécuter une fois sur la base D1 « my-qhse-db » (console Cloudflare > D1 > Console)
-- Activité d'usage anonyme : écrans, outils, sujets, documents, calculs de risque.
CREATE TABLE IF NOT EXISTS activity_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT,
  kind TEXT NOT NULL,
  label TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_events_kind_label ON activity_events(kind, label);
CREATE INDEX IF NOT EXISTS idx_events_created ON activity_events(created_at);
