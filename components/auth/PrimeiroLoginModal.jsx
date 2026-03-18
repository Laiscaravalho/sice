'use client';
import { useState } from 'react';
import { PERFIL_CONFIG } from '../../lib/constants';
import { Btn, Field, inputStyle } from '../ui';

const PrimeiroLoginModal = ({ user, onSalvar }) => {
  const [nova, setNova] = useState(""); const [conf, setConf] = useState(""); const [err, setErr] = useState("");
  const salvar = () => {
    if (nova.length < 6) { setErr("A senha deve ter ao menos 6 caracteres."); return; }
    if (nova !== conf) { setErr("As senhas não coincidem."); return; }
    onSalvar(nova);
  };
  return (<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}><div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 420, padding: "32px 28px" }}><div style={{ textAlign: "center", marginBottom: 22 }}><h2 style={{ fontFamily: "'Lora',serif", color: "#1B4332", margin: "0 0 6px", fontSize: 18 }}>Bem-vindo(a), {user.nome.split(" ")[0]}!</h2><p style={{ color: "#6B7A6E", fontSize: 13, margin: 0 }}>Primeiro acesso. Defina sua senha para continuar.</p></div><div style={{ display: "flex", flexDirection: "column", gap: 14 }}><Field label="Nova Senha"><input style={inputStyle} type="password" placeholder="Mínimo 6 caracteres" value={nova} onChange={e => setNova(e.target.value)} /></Field><Field label="Confirmar"><input style={inputStyle} type="password" placeholder="Repita a senha" value={conf} onChange={e => setConf(e.target.value)} onKeyDown={e => e.key === "Enter" && salvar()} /></Field>{err && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "8px 12px", borderRadius: 8, fontSize: 12 }}>{err}</div>}<Btn onClick={salvar} size="lg" style={{ justifyContent: "center", marginTop: 4 }}>Definir senha e entrar</Btn></div></div></div>);};

export default PrimeiroLoginModal;
