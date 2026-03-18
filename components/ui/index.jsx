'use client';
import { STATUS_CONFIG } from '../../lib/constants';

const StatusBadge = ({ status, map }) => {
  const cfg = (map || STATUS_CONFIG)[status] || { label: status, color: "#666", bg: "#eee" };
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg, whiteSpace: "nowrap" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />{cfg.label}</span>;
};
const Card = ({ children, style = {} }) => <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2EEE8", padding: 24, ...style }}>{children}</div>;
const Btn = ({ children, variant = "primary", size = "md", onClick, disabled, style = {} }) => { const v = { primary: { background: "#1B4332", color: "#fff", border: "none" }, secondary: { background: "#F0F7F4", color: "#1B4332", border: "1px solid #C8E6D4" }, danger: { background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" }, success: { background: "#D1FAE5", color: "#059669", border: "1px solid #A7F3D0" }, warning: { background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }, purple: { background: "#EDE9FE", color: "#7C3AED", border: "1px solid #DDD1FE" }, amber: { background: "#FEF3C7", color: "#B45309", border: "1px solid #FDE68A" } }; const s = { sm: { padding: "6px 12px", fontSize: 12 }, md: { padding: "9px 18px", fontSize: 13 }, lg: { padding: "12px 24px", fontSize: 14 } }; return <button onClick={onClick} disabled={disabled} style={{ ...v[variant], ...s[size], borderRadius: 8, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity .15s", ...style }}>{children}</button>; };
const Field = ({ label, children, style = {} }) => <div style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>{label && <label style={{ fontSize: 12, fontWeight: 700, color: "#3A5A45", textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</label>}{children}</div>;
const inputStyle = { border: "1px solid #C8E6D4", borderRadius: 8, padding: "9px 13px", fontSize: 13, fontFamily: "inherit", background: "#FAFFFE", color: "#1C2B20", outline: "none", width: "100%", boxSizing: "border-box" };

export { StatusBadge, Card, Btn, Field, inputStyle };
