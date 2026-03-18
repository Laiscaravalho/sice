'use client';
import { STATUS_CONFIG } from '../../lib/constants';
import { fmtCur, fmtDate, calcTotal } from '../../lib/helpers';
import { StatusBadge, Card } from '../ui';

const AprovacoesPage = ({ solicitacoes, users, onView }) => {
  const pendentes = solicitacoes.filter(s => s.status === "aguardando_aprovacao");
  return (
    <div style={{ padding: 28, maxWidth: 1000 }}>
      <div style={{ marginBottom: 22 }}><h1 style={{ fontSize: 22, fontWeight: 700, color: "#1B4332", margin: "0 0 4px", fontFamily: "'Lora',serif" }}>Fila de Aprovações</h1><p style={{ color: "#6B7A6E", margin: 0, fontSize: 13 }}>{pendentes.length} solicitação(ões) aguardando</p></div>
      {pendentes.length === 0
        ? <Card style={{ textAlign: "center", padding: 52 }}><div style={{ fontSize: 48, marginBottom: 10 }}>🎉</div><h3 style={{ color: "#1B4332", fontFamily: "'Lora',serif" }}>Tudo em dia!</h3></Card>
        : <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{pendentes.map(sol => {
            const solicitante = users.find(u => u.id === sol.solicitanteId); const dias = Math.floor((new Date() - new Date(sol.dataCriacao)) / 86400000);
            return (<Card key={sol.id} style={{ padding: 18 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}><div style={{ flex: 1 }}><div style={{ display: "flex", gap: 10, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}><span style={{ fontWeight: 800, color: "#1B4332", fontSize: 14 }}>{sol.numero}</span><StatusBadge status={sol.status} /></div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 10 }}>{)}</div></div><Btn onClick={() => onView(sol)}>Analisar →</Btn></div></Card>); })}</div>}
    </div>
  );
};

export default AprovacoesPage;
