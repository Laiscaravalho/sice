/**
 * Sice — Seed de banco de dados
 * Executar: npx prisma db seed
 */

import { PrismaClient, PerfilUsuario, StatusSolicitacao, TipoSolicitacao } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

function hashSenha(s: string): string {
  return createHash('sha256').update(s).digest('hex');
}

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpeza
  await prisma.notificacao.deleteMany();
  await prisma.retornoSolicitacao.deleteMany();
  await prisma.historicoSolicitacao.deleteMany();
  await prisma.anexoCotacao.deleteMany();
  await prisma.itemSolicitacao.deleteMany();
  await prisma.patrimonio.deleteMany();
  await prisma.solicitacao.deleteMany();
  await prisma.estoque.deleteMany();
  await prisma.usuario.updateMany({ data: { aprovadorId: null } });
  await prisma.usuario.deleteMany();

  // Usuários
  const u5 = await prisma.usuario.create({ data: { id: 'u5', nome: 'Admin Sistema', email: 'admin@org.com', senhaHash: hashSenha('admin123'), perfil: PerfilUsuario.admin, area: 'TI', primeiroLogin: false, ativo: true } });
  const u4 = await prisma.usuario.create({ data: { id: 'u4', nome: 'Roberto Gestor', email: 'gestor@org.com', senhaHash: hashSenha('123456'), perfil: PerfilUsuario.gestor, area: 'Gestão', centroCusto: 'CC-GESTAO', aprovadorId: u5.id, primeiroLogin: false, ativo: true } });
  await prisma.usuario.create({ data: { id: 'u6', nome: 'Mariana Auxiliar', email: 'aux@org.com', senhaHash: hashSenha('123456'), perfil: PerfilUsuario.auxiliar_admin, area: 'Administrativo', centroCusto: 'CC-ADM', aprovadorId: u5.id, primeiroLogin: false, ativo: true } });
  await prisma.usuario.create({ data: { id: 'u1', nome: 'Ana Silva', email: 'ana@org.com', senhaHash: hashSenha('123456'), perfil: PerfilUsuario.solicitante, area: 'Administrativo', rubrica: 'RUB-001', centroCusto: 'CC-ADM', projeto: 'Projeto Alpha', aprovadorId: u4.id, primeiroLogin: false, ativo: true } });
  await prisma.usuario.create({ data: { id: 'u2', nome: 'Carlos Santos', email: 'carlos@org.com', senhaHash: hashSenha('123456'), perfil: PerfilUsuario.solicitante, area: 'Projetos Sociais', rubrica: 'RUB-002', centroCusto: 'CC-PROJ', projeto: 'Projeto Beta', aprovadorId: u4.id, primeiroLogin: false, ativo: true } });
  await prisma.usuario.create({ data: { id: 'u3', nome: 'Fernanda Lima', email: 'fernanda@org.com', senhaHash: hashSenha('123456'), perfil: PerfilUsuario.solicitante, area: 'Comunicação', rubrica: 'RUB-003', centroCusto: 'CC-CONM', projeto: 'Projeto Gamma', aprovadorId: u4.id, primeiroLogin: false, ativo: true } });

  // Estoque
  await prisma.estoque.createMany({ data: [
    { id: 'e1', nome: 'Papel A4', categoria: 'Expediente', quantidade: 15, unidade: 'resma', minimo: 5, localizacao: 'Almoxarifado A' },
    { id: 'e2', nome: 'Caneta Azul', categoria: 'Expediente', quantidade: 80, unidade: 'unid', minimo: 20, localizacao: 'Almoxarifado A' },
    { id: 'e3', nome: 'Álcool Gel 500ml', categoria: 'Higiene', quantidade: 8, unidade: 'frasco', minimo: 10, localizacao: 'Almoxarifado B' },
    { id: 'e4', nome: 'Café 500g', categoria: 'Consumo', quantidade: 3, unidade: 'pacote', minimo: 5, localizacao: 'Copa' },
    { id: 'e5', nome: 'Detergente 500ml', categoria: 'Limpeza', quantidade: 12, unidade: 'frasco', minimo: 6, localizacao: 'Copa' },
  ] });

  // Patrimonio
  await prisma.patrimonio.createMany({ data: [
    { id: 'pat1', tombamento: 'PAT-2024-001', descricao: 'Notebook Dell', marca: 'Dell', modelo: 'Inspiron 15', numSerie: 'SN-DELE�0-00123', area: 'Administrativo', responsavel: 'Ana Silva', dataAquisicao: new Date('2024-05-10'), valorAquisicao: 3200, localizacao: 'Sala 01', condicao: 'Otimo', status: 'ativo', projeto: 'Projeto Alpha', tipoBem: 'proprio', notaFiscal: 'NF-000123', fornecedor: 'Dell Brasil', dataCompra: new Date('2024-05-08'), valorPago: 3200 },
    { id: 'pat2', tombamento: 'PAT-2024-002', descricao: 'Impressora HP', marca: 'HP', modelo: 'LaserJet Pro', numSerie: 'SN-HP-00456', area: 'Administrativo', responsavel: 'Mariana Auxiliar', dataAquisicao: new Date('2024-07-22'), valorAquisicao: 1850, localizacao: 'Recepção', condicao: 'Bom', status: 'ativo', projeto: 'Projeto Beta', tipoBem: 'proprio', notaFiscal: 'NF-000456', fornecedor: 'HP Store', dataCompra: new Date('2024-07-20'), valorPago: 1850 },
  ] });

  console.log('🎉 Seed concluído!');
  console.log('  ana@org.com / aux@org.com / gestor@org.com / admin@org.com');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
