-- ============================================================
--  CREATE & FABRICATE LLC — Supabase Setup
--  Ejecuta este SQL en: supabase.com → Tu proyecto → SQL Editor
-- ============================================================

-- 1. CREAR LA TABLA DE REVIEWS
-- ─────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewer_name  TEXT NOT NULL,
  event_name     TEXT NOT NULL,
  event_type     TEXT,
  rating         SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment        TEXT,
  approved       BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. ÍNDICES para consultas rápidas
-- ─────────────────────────────────
CREATE INDEX IF NOT EXISTS reviews_approved_idx ON reviews (approved, created_at DESC);

-- 3. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede INSERTAR una review
CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  TO anon
  WITH CHECK (true);

-- Cualquiera puede LEER todas las reviews (se publican de inmediato)
CREATE POLICY "Read all reviews"
  ON reviews FOR SELECT
  TO anon
  USING (true);

-- 4. DATOS DE PRUEBA (opcional, para ver cómo se ve en la web)
-- ─────────────────────────────────────────────────────────────
INSERT INTO reviews (reviewer_name, event_name, event_type, rating, comment, approved) VALUES
  ('Sarah M.', 'LTK Brand Activation 2025', 'Brand Activation', 5, 'Absolutely stunning work! The backdrop was perfect and the team was incredibly professional. Will definitely work with them again.', TRUE),
  ('Carlos R.', 'Miami Product Launch', 'Product Launch', 5, 'Create & Fabricate transformed our vision into something beyond what we imagined. Every detail was flawless.', TRUE),
  ('Jessica T.', 'Dove Hair Society Event', 'Brand Activation', 5, 'The custom bar they built for us was the talk of the event. Amazing craftsmanship and great communication throughout.', TRUE),
  ('Mike D.', 'Summer Pop-Up 2025', 'Pop-Up', 4, 'Great quality work and fast turnaround. Very happy with the final result. Highly recommend!', TRUE);

-- ============================================================
--  PARA APROBAR REVIEWS desde el Dashboard de Supabase:
--  1. Ve a Table Editor → reviews
--  2. Cambia "approved" de false → true para cada review
--     que quieras mostrar en la página web
-- ============================================================
