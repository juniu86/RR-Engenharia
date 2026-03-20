-- ============================================================
-- RR Engenharia — Relatório de Obras — Supabase Schema
-- Execute this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── User Profiles ────────────────────────────────────────────────────────────
CREATE TABLE user_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  nome        TEXT NOT NULL DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'engenheiro', 'cliente')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, nome)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Obras ────────────────────────────────────────────────────────────────────
CREATE TABLE obras (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome              TEXT NOT NULL,
  endereco          TEXT NOT NULL DEFAULT '',
  contratante       TEXT NOT NULL DEFAULT '',
  responsavel       TEXT NOT NULL DEFAULT '',
  numero_contrato   TEXT NOT NULL DEFAULT '',
  prazo_contratual  INTEGER NOT NULL DEFAULT 365,
  data_inicio       DATE NOT NULL DEFAULT CURRENT_DATE,
  data_fim          DATE,
  status            TEXT NOT NULL DEFAULT 'em_andamento'
                    CHECK (status IN ('em_andamento', 'concluida', 'paralisada')),
  logo_url          TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Obra Users (Access Control) ──────────────────────────────────────────────
CREATE TABLE obra_users (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id    UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'engenheiro', 'cliente')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(obra_id, user_id)
);

-- ─── Relatórios ───────────────────────────────────────────────────────────────
CREATE TABLE relatorios (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id               UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  numero                INTEGER NOT NULL,
  data                  DATE NOT NULL,
  status                TEXT NOT NULL DEFAULT 'preenchendo'
                        CHECK (status IN ('preenchendo', 'enviado', 'aprovado')),
  modelo                TEXT NOT NULL DEFAULT 'Relatório Diário de Obra (RDO)',
  clima_manha_tempo     TEXT NOT NULL DEFAULT 'claro'
                        CHECK (clima_manha_tempo IN ('claro', 'nublado', 'chuvoso', 'garoa')),
  clima_manha_condicao  TEXT NOT NULL DEFAULT 'praticavel'
                        CHECK (clima_manha_condicao IN ('praticavel', 'impraticavel', 'parcialmente_praticavel')),
  clima_tarde_tempo     TEXT NOT NULL DEFAULT 'claro'
                        CHECK (clima_tarde_tempo IN ('claro', 'nublado', 'chuvoso', 'garoa')),
  clima_tarde_condicao  TEXT NOT NULL DEFAULT 'praticavel'
                        CHECK (clima_tarde_condicao IN ('praticavel', 'impraticavel', 'parcialmente_praticavel')),
  observacoes           TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(obra_id, numero)
);

-- ─── Mão de Obra ──────────────────────────────────────────────────────────────
CREATE TABLE mao_de_obra (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  relatorio_id UUID NOT NULL REFERENCES relatorios(id) ON DELETE CASCADE,
  funcao       TEXT NOT NULL,
  quantidade   INTEGER NOT NULL DEFAULT 1,
  observacao   TEXT
);

-- ─── Equipamentos ─────────────────────────────────────────────────────────────
CREATE TABLE equipamentos (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  relatorio_id UUID NOT NULL REFERENCES relatorios(id) ON DELETE CASCADE,
  nome         TEXT NOT NULL,
  quantidade   INTEGER NOT NULL DEFAULT 1,
  observacao   TEXT
);

-- ─── Atividades ───────────────────────────────────────────────────────────────
CREATE TABLE atividades (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  relatorio_id UUID NOT NULL REFERENCES relatorios(id) ON DELETE CASCADE,
  descricao    TEXT NOT NULL,
  progresso    INTEGER NOT NULL DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
  observacao   TEXT
);

-- ─── Ocorrências ──────────────────────────────────────────────────────────────
CREATE TABLE ocorrencias (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  relatorio_id UUID NOT NULL REFERENCES relatorios(id) ON DELETE CASCADE,
  tipo         TEXT NOT NULL,
  descricao    TEXT NOT NULL,
  impacto      TEXT
);

-- ─── Checklist ────────────────────────────────────────────────────────────────
CREATE TABLE checklist (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  relatorio_id UUID NOT NULL REFERENCES relatorios(id) ON DELETE CASCADE,
  item         TEXT NOT NULL,
  concluido    BOOLEAN NOT NULL DEFAULT FALSE
);

-- ─── Comentários ──────────────────────────────────────────────────────────────
CREATE TABLE comentarios (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  relatorio_id  UUID REFERENCES relatorios(id) ON DELETE CASCADE,
  obra_id       UUID REFERENCES obras(id) ON DELETE CASCADE,
  usuario_nome  TEXT NOT NULL,
  texto         TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Fotos ────────────────────────────────────────────────────────────────────
CREATE TABLE fotos (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id      UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  relatorio_id UUID REFERENCES relatorios(id) ON DELETE SET NULL,
  url          TEXT NOT NULL,
  legenda      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Vídeos ───────────────────────────────────────────────────────────────────
CREATE TABLE videos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id       UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  relatorio_id  UUID REFERENCES relatorios(id) ON DELETE SET NULL,
  url           TEXT NOT NULL,
  thumbnail_url TEXT,
  legenda       TEXT,
  duracao       INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Anexos ───────────────────────────────────────────────────────────────────
CREATE TABLE anexos (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  relatorio_id UUID NOT NULL REFERENCES relatorios(id) ON DELETE CASCADE,
  nome         TEXT NOT NULL,
  url          TEXT NOT NULL,
  tamanho      INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_obra_users_user_id ON obra_users(user_id);
CREATE INDEX idx_obra_users_obra_id ON obra_users(obra_id);
CREATE INDEX idx_relatorios_obra_id ON relatorios(obra_id);
CREATE INDEX idx_relatorios_numero ON relatorios(obra_id, numero);
CREATE INDEX idx_fotos_obra_id ON fotos(obra_id);
CREATE INDEX idx_videos_obra_id ON videos(obra_id);
CREATE INDEX idx_mao_de_obra_relatorio ON mao_de_obra(relatorio_id);
CREATE INDEX idx_equipamentos_relatorio ON equipamentos(relatorio_id);
CREATE INDEX idx_atividades_relatorio ON atividades(relatorio_id);
CREATE INDEX idx_ocorrencias_relatorio ON ocorrencias(relatorio_id);
CREATE INDEX idx_checklist_relatorio ON checklist(relatorio_id);
CREATE INDEX idx_comentarios_relatorio ON comentarios(relatorio_id);
CREATE INDEX idx_anexos_relatorio ON anexos(relatorio_id);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE obra_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE mao_de_obra ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE atividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocorrencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE anexos ENABLE ROW LEVEL SECURITY;

-- User profiles: users can read/update their own profile
CREATE POLICY "Users read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Obra users: users can see their own obra_users rows
CREATE POLICY "Users see own obra_users" ON obra_users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins insert obra_users" ON obra_users FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage obra_users" ON obra_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM obra_users ou
      WHERE ou.obra_id = obra_users.obra_id
        AND ou.user_id = auth.uid()
        AND ou.role = 'admin'
    )
  );

-- Helper function: user has access to an obra
CREATE OR REPLACE FUNCTION user_has_obra_access(p_obra_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM obra_users
    WHERE obra_id = p_obra_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: user is admin of an obra
CREATE OR REPLACE FUNCTION user_is_obra_admin(p_obra_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM obra_users
    WHERE obra_id = p_obra_id AND user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Obras: users can only see obras they have access to
CREATE POLICY "Users see accessible obras" ON obras FOR SELECT
  USING (user_has_obra_access(id));

CREATE POLICY "Admins update obras" ON obras FOR UPDATE
  USING (user_is_obra_admin(id));

CREATE POLICY "Authenticated users insert obras" ON obras FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Relatórios: access via obra
CREATE POLICY "Users see accessible relatorios" ON relatorios FOR SELECT
  USING (user_has_obra_access(obra_id));

CREATE POLICY "Users insert relatorios" ON relatorios FOR INSERT
  WITH CHECK (user_has_obra_access(obra_id));

CREATE POLICY "Users update relatorios" ON relatorios FOR UPDATE
  USING (user_has_obra_access(obra_id));

CREATE POLICY "Admins delete relatorios" ON relatorios FOR DELETE
  USING (user_is_obra_admin(obra_id));

-- Report sections: access via relatorio → obra
CREATE OR REPLACE FUNCTION relatorio_obra_id(p_relatorio_id UUID)
RETURNS UUID AS $$
  SELECT obra_id FROM relatorios WHERE id = p_relatorio_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Generic policy for all relatorio child tables
CREATE POLICY "Access mao_de_obra" ON mao_de_obra FOR ALL
  USING (user_has_obra_access(relatorio_obra_id(relatorio_id)));

CREATE POLICY "Access equipamentos" ON equipamentos FOR ALL
  USING (user_has_obra_access(relatorio_obra_id(relatorio_id)));

CREATE POLICY "Access atividades" ON atividades FOR ALL
  USING (user_has_obra_access(relatorio_obra_id(relatorio_id)));

CREATE POLICY "Access ocorrencias" ON ocorrencias FOR ALL
  USING (user_has_obra_access(relatorio_obra_id(relatorio_id)));

CREATE POLICY "Access checklist" ON checklist FOR ALL
  USING (user_has_obra_access(relatorio_obra_id(relatorio_id)));

CREATE POLICY "Access comentarios" ON comentarios FOR ALL
  USING (
    (relatorio_id IS NOT NULL AND user_has_obra_access(relatorio_obra_id(relatorio_id)))
    OR
    (obra_id IS NOT NULL AND user_has_obra_access(obra_id))
  );

CREATE POLICY "Access fotos" ON fotos FOR ALL
  USING (user_has_obra_access(obra_id));

CREATE POLICY "Access videos" ON videos FOR ALL
  USING (user_has_obra_access(obra_id));

CREATE POLICY "Access anexos" ON anexos FOR ALL
  USING (user_has_obra_access(relatorio_obra_id(relatorio_id)));

-- ─── Storage Buckets ──────────────────────────────────────────────────────────
-- Run these in the Supabase Dashboard → Storage section OR via SQL:

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('fotos',  'fotos',  true, 52428800,  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('videos', 'videos', true, 524288000, ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/avi']),
  ('anexos', 'anexos', true, 104857600, NULL),
  ('logos',  'logos',  true, 10485760,  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies (allow authenticated users to upload to their obra folders)
CREATE POLICY "Authenticated upload fotos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'fotos');

CREATE POLICY "Public read fotos" ON storage.objects FOR SELECT
  USING (bucket_id = 'fotos');

CREATE POLICY "Authenticated delete fotos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'fotos');

CREATE POLICY "Authenticated upload videos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Public read videos" ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated delete videos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'videos');

CREATE POLICY "Authenticated upload anexos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'anexos');

CREATE POLICY "Public read anexos" ON storage.objects FOR SELECT
  USING (bucket_id = 'anexos');

CREATE POLICY "Authenticated delete anexos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'anexos');

CREATE POLICY "Authenticated upload logos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Public read logos" ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Authenticated update logos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'logos');

-- ─── Sample Data (Optional) ───────────────────────────────────────────────────
-- After creating your first user via Supabase Auth, you can add them as admin
-- to an obra by running:
--
-- INSERT INTO obra_users (obra_id, user_id, role)
-- VALUES ('YOUR_OBRA_UUID', 'YOUR_USER_UUID', 'admin');
