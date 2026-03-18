'use client';
import { useState } from 'react';
import { PERFIL_CONFIG } from '../../lib/constants';
import { Btn, Field, inputStyle } from '../ui';

const MudarSenhaModal = ({ user, onSalvar, onClose }) => {
  const [atual, setAtual] = useState(""); const [nova, setNova] = useState(""); const [conf, setConf] = useState(""); const [err, setErr] = useState(""); const [ok, setOk] = useState(false);
  const salvar = () => {
    if (user.senha !== atual) { setErr("Senha atual incorreta."); return; }
    if (nova.length < 6) { setErr("A nova senha deve ter ao menos 6 caracteres."); return; }
    if (nova !== conf) { setErr("As novas senhas não coincidem."); return; }
    onSalvar(nova); setOk(true);
  };
  return (<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, padding: 20 }}><div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 400, padding: "28px 24px" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}><h3 style={{ fontFamily: "'Lora',serif", color: "#1B4332", margin: 0, fontSize: 16 }}>Mudar Senha</h3><button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>✕</button></div>{ok ? <div style={{ textAlign: "center" }}><p>Senha alterada com sucesso!</p><Btn onClick={onClose}>Fechar</Btn></div> : <div style={{ display: "flex", flexDirection: "column", gap: 13 }}><Field label="Senha Atual"><input style={inputStyle} type="password" value={atual} onChange={e => setAtual(e.target.value)} /></Field><Field label="Nova Senha"><input style={inputStyle} type="password" value={nova} onChange={e => setNova(e.target.value)} /></Field><Field label="Confirmar"><input style={inputStyle} type="password" value={conf} onChange={e => setConf(e.target.value)} /></Field>{err && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "8px 8px", borderRadius: 8, fontSize: 12 }}>{err}</div>}<div style={{ display: "flex", gap: 8 }}><Btn onClick={salvar} style={{ flex: 1 }}>Salvar</Btn><Btn variant="secondary" onClick={onClose}>Cancelar</Btn></div></div>}</div></div>);
};

export default MudarSenhaModal;
