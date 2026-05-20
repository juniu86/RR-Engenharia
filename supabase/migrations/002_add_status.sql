-- Fase 1.1 – Pipeline de Propostas
-- Adicionar status e motivo_perda na tabela proposals

ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'rascunho',
  ADD COLUMN IF NOT EXISTS motivo_perda TEXT;

-- Propostas já existentes ficam como 'rascunho' (default acima resolve)
