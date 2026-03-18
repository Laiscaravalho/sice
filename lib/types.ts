/**
 * Sice — Tipos TypeScript - Espelha as entidades do schema Prisma
 */

export type PerfilUsuario = 'solicitante' | 'auxiliar_admin' | 'gestor' | 'admin';

export type StatusSolicitacao =
  | 'enviada' | 'em_cotacao' | 'retornado' | 'aguardando_aprovacao'
  | 'aprovada' | 'reprovada' | 'nf_enviada' | 'pago'
  | 'pronto_retirada' | 'retirado';

export type TipoSolicitacao =
  | 'material_expediente' | 'consumo' | 'higiene' | 'limpeza' | 'ti' | 'bem' | 'outro';

export type CondicaoBem = 'Otimo' | 'Bom' | 'Regular' | 'Ruim';
export type StatusPatrimonio = 'ativo' | 'em_manutencao' | 'cedido' | 'baixado';
export type TipoBem = 'proprio' | 'terceiro';

export interface Usuario {
  id: string; nome: string; email: string; senhaHash: string;
  perfil: PerfilUsuario; area: string; rubrica: string;
  centroCusto: string; projeto: string; primeiroLogin: boolean;
  senhaResetPendente: boolean; ativo: boolean; aprovadorId: string | null;
  createdAt: Date; updatedAt: Date;
}

export interface Solicitacao {
  id: string; numero: string; dataCriacao: Date; area: string;
  rubrica: string; tipo: TipoSolicitacao; justificativa: string;
  status: StatusSolicitacao; tombamentoGerado: boolean;
  centroCusto: string | null; rubricaFinanceiro: string | null;
  cotacaoData: any; nfData: any; solicitanteId: string;
  aprovadorId: string | null; createdAt: Date; updatedAt: Date;
  itens?: ItemSolicitacao[]; historico?: HistoricoSolicitacao[];
  retornos?: RetornoSolicitacao[];
}

export interface ItemSolicitacao {
  id: string; descricao: string; quantidade: number; unidade: string;
  valorEstimado: number; solicitacaoId: string;
}

export interface HistoricoSolicitacao {
  id: string; status: StatusSolicitacao; comentario: string;
  data: Date; solicitacaoId: string; usuarioId: string;
}

export interface RetornoSolicitacao {
  id: string; mensagem: string; data: Date;
  solicitacaoId: string; autorId: string;
}

export interface Estoque {
  id: string; nome: string; categoria: string; quantidade: number;
  unidade: string; minimo: number; localizacao: string;
  ativo: boolean; createdAt: Date; updatedAt: Date;
}

export interface Patrimonio {
  id: string; tombamento: string; descricao: string;
  marca: string; modelo: string; numSerie: string;
  area: string; responsavel: string; dataAquisicao: Date;
  valorAquisicao: number; localizacao: string; condicao: CondicaoBem;
  status: StatusPatrimonio; observacoes: string; projeto: string;
  tipoBem: TipoBem; notaFiscal: string; fornecedor: string;
  dataCompra: Date | null; valorPago: number | null;
  solicitacaoId: string | null; createdAt: Date; updatedAt: Date;
}

export interface Notificacao {
  id: string; email: string; assunto: string; corpo: string;
  status: string; lida: boolean; data: Date;
  userId: string; solicitacaoId: string | null;
}
