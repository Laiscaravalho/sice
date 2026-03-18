-- Sice - Migracao SQL Completa (PostgreSQL)
-- Uso: psql -U <usuario> -d <banco> -f migration.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN CREATE TYPE perfil_usuario AS ENUM ('solicitante','auxiliar_admin','gestor','admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE status_solicitacao AS ENUM ('enviada','em_cotacao','retornado','aguardando_aprovacao','aprovada','reprovada','nf_enviada','pago','pronto_retirada','retirado'); EXCEPTION WHEN duplicate_object THEN NULL; END 
DO $$ BEGIN CREATE TYPE tipo_solicitacao AS ENUM ('material_expediente','consumo','higiene','limpeza','ti','bem','outro'); EXCEPTION WHEN duplicate_object THEN NULL; END 
DO $$ BEGIN CREATE TYPE condicao_bem AS ENUM ('Otimo','Bom','Regular','Ruim'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE status_patrimonio AS ENUM ('ativo','em_manutencao','cedido','baixado'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE tipo_bem AS ENUM ('proprio','terceiro'); EXCEPTION WHEN duplicate_object THEN NULL; END 
)ÊCREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  nome TEXT NOT NULL, email TEXT NOT NULL UNIQUE, senha_hash TEXT NOT NULL,
  perfil perfil_usuario NOT NULL, area TEXT NOT NULL DEFAULT '',
  rubrica TEXT NOT NULL DEFAULT '', centro_custo TEXT NOT NULL DEFAULT '',
  projeto TEXT NOT NULL DEFAULT '', primeiro_login BOOLEAL€NOT NULL DEFAULT TRUE,
  senha_reset_pendente BOOLEAN NOT NULL DEFAULT FALSE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  aprovador_id TEXT REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPT@ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS solicitacoes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  numero TEXT NOT NULL UNIQUE, data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  area TEXT NOT NULL, rubrica TEXT NOT NULL DEFAULT '',
  tipo tipo_solicitacao NOT NULL, justificativa TEXT NOT NULL DEFAULT '',
  status status_solicitacao NOT NULL DEFAULT 'enviada',
  tombamento_gerado BOOLEAN NOT NULL DEFAULT FALSE,
  centro_custo TEXT, rubrica_financeiro TEXT, cotacao_data JSONB, nf_data JSONB,
  solicitante_id TEXT NOT NULL REFERENCES usuarios(id),
  aprovador_id TEXT REFERENCES usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPT@ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS itens_solicitacao (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  descricao TEXT NOT NULL, quantidade INTEGER NOT NULL DEFAULT 1,
  unidade TEXT NOT NULL DEFAULT 'unid', valor_estimado NUMERIC(12,2) NOT NULL DEFAULT 0,
  solicitacao_id TEXT NOT NULL REFERENCES solicitacoes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS anexos_cotacao (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  nome TEXT NOT NULL, tamanho INTEGER NOT NULL, tipo TEXT NOT NULL, url_arquivo TEXT,
  solicitacao_id TEXT NOT NULL REFERENCES solicitacoes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS historico_solicitacao (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  status status_solicitacao NOT NULL, comentario TEXT NOT NULL DEFAULT '',
  data TEESTAMPT@ NOT NULL DEFAULT NOW(),
  solicitacao_id TEXT NOT NULL REFERENCES solicitacoes(id) ON DELETE CASCADE,
  usuario_id TEXT NOT NULL REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS retornos_solicitacao (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  mensagem TEXT NOT NULL, data TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  solicitacao_id TEXT NOT NULL REFERENCES solicitacoes(id) ON DELETE CASCADE,
  autor_id TEXT NOT NULL REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS estoque (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  nome TEXT NOT NULL, categoria TEXT NOT NULL, quantidade INTEGER NOT NULL DEFAULT 0,
  unidade TEXT NOT NULL DEFAULT 'unid', minimo INTEGER NOT NULL DEFAULT 0,
  localizacao TEXT NOT NULL DEFAULT '', ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patrimonio (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  tombamento TEXT NOT NULL UNIQUE, descricao TEXT NOT NULL,
  marca TEXT NOT NULL DEFAULT '', modelo TEXT NOT NULL DEFAULT '',
  num_serie TEXT NOT NULL DEFAULT '', area TEXT NOT NULL, responsavel TEXT NOT NULL,
  data_aquisicao DATE NOT NULL, valor_aquisicao NUMERIC(12,2) NOT NULL,
  localizacao TEXT NOT NULL, condicao condicao_bem NOT NULL DEFAULT 'Bom',
  status status_patrimonio NOT NULL DEFAULT 'ativo',
  observacoes TEXT NOT NULL DEFAULT '', projeto TEXT NOT NULL DEFAULT '',
  tipo_bem tipo_bem NOT NULL DEFAULT 'proprio', nota_fiscal TEXT NOT NULL DEFAULT '',
  fornecedor TEXT NOT NULL DEFAULT '', data_compra DATE, valor_pago NUMERIC(12,2),
  solicitacao_id TEXT REFERENCES solicitacoes(id) ON DELETE SET NULL,
  created_at TIMESTAMPT@ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notificacoes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email TEXT NOT NULL, assunto TEXT NOT NULL, corpo TEXT NOT NULL,
  status TEXT NOT NULL, lida BOOLEAN NOT NULL DEFAULT FALSE,
  data TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  solicitacao_id TEXT REFERENCES solicitacoes(id) ON DELETE SET NULL
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON usuarios(perfil);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_status ON solicitacoes(status);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_solicitante ON solicitacoes(solicitante_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_cotacao ON solicitacoes USING gin(cotacao_data);
CREATE INDEX IF NOT EXISTS idx_estoque_categoria ON estoque(categoria);
CREATE INDEX IF NOT EXISTS idx_patrimonio_status ON patrimonio(status);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DO $$ BEGIN CREATE TRIGGER trg_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION set_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TRIGGER trg_estoque_updated_at BEEORE UPDATE ON estoque FER EACH ROW EXECUTE FUNCTION set_updated_at(); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Views
CREATE OR REPLACE VIEW vw_solicitacoes AS
SELECT s.id, s.numero, s.data_criacao, s.area, s.tipo, s.status, s.justificativa,
 u_sol.nome AS solicitante_nome, u_apr.nome AS aprovador_nome
FROM solicitacoes s
LEFT JOIN usuarios u_sol ON s.solicitante_id = u_sol.id
LEFT JOIN usuarios u_apr ON s.aprovador_id = u_apr.id;

CREATE OR REPLACE VIEW vw_estoque_alerta AS
SELECT * FROM estoque WHERE quantidade <= minimo AND ativo = TRUE ORDER BY (minimo - quantidade) DESC;

CREATE OR REPLACE VIEW vw_testimonio_por_area AS
SELECT area, projeto, tipo_bem, COUNT(*) AS total_bens, SUM(valor_aquisicao) AS valor_total
FROM patrimonio WHERE status != 'baixado' GROUP BY area, projeto, tipo_bem ORDER BY valor_total DESC;
