const calcTotal = (itens) => itens.reduce((s, i) => s + i.quantidade * i.valorEstimado, 0);
const fmtCur = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtDate = (d) => new Date(d).toLocaleDateString("pt-BR");
const fmtDT = (d) => new Date(d).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
const genId = () => Math.random().toString(36).substr(2, 9);
const genNumSol = (list) => `SOL-${new Date().getFullYear()}-${String(list.length + 1).padStart(3, "0")}`;
const genTomb = (list) => `PAT-${new Date().getFullYear()}-${String(list.length + 1).padStart(3, "0")}`;
const canEdit = (perfil) => ["auxiliar_admin", "gestor", "admin"].includes(perfil);
const isGestor = (perfil) => ["gestor", "admin"].includes(perfil);
const canSeeAll = (perfil) => ["gestor", "admin", "auxiliar_admin"].includes(perfil);
const fmtBytes = (b) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;

// Nav builder
const buildNav = (perfil, pendingCount, patAlert, retiradaAlert) => [
  { id: "dashboard",    icon: "📊", label: "Dashboard",         show: true },
  { id: "solicitacoes", icon: "📋", label: "Solicitações",      show: true },
  { id: "nova",         icon: "✏️", label: "Nova Solicitação",  show: true },
  { id: "aprovacoes",   icon: "✅", label: "Aprovações",        show: isGestor(perfil), badge: pendingCount },
  { id: "estoque",      icon: "📦", label: "Estoque",           show: perfil !== "solicitante" },
  { id: "patrimonio",   icon: "🏷️", label: "Patrimônio",       show: perfil !== "solicitante", badge: patAlert },
  { id: "pagamentos",   icon: "💳", label: "Pagamentos",        show: isGestor(perfil) },
  { id: "relatorios",   icon: "📊", label: "Relatórios",          show: perfil !== "solicitante" },
  { id: "usuarios",     icon: "👥", label: "Usuários",            show: perfil === "admin" },
].filter(n => n.show);

// Primitivos

export {
  calcTotal, fmtCur, fmtDate, fmtDT, genId, genNumSol, genTomb,
  canEdit, isGestor, canSeeAll, fmtBytes, buildNav,
};
