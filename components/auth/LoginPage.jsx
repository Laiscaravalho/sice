'use client';
import { useState } from 'react';
import { PERFIL_CONFIG } from '../../lib/constants';
import { Btn, Field, inputStyle } from '../ui';

const LoginPage = ({ onLogin, users, onEsqueciSenha }) => {
  const [email, setEmail] = useState(""); const [senha, setSenha] = useState(""); const [error, setError] = useState(""); const [esqueci, setEsqueci] = useState(false); const [esqueciEmail, setEsqueciEmail] = useState(""); const [esqueciMsg, setEsqueciMsg] = useState("");
  const handle = () => { const u = users.find(u => u.email === email && u.senha === senha && u.ativo !== false); if (!u) { setError("E-mail ou senha inválidos."); return; } onLogin(u); };
  return (<div style={{ minHeight: "100vh", background: "linear-gradient(140deg,#07200F 0%,#1B4332 55%,#2D6A4F 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}><div style={{ width: "100%", maxWidth: 430, zIndex: 1 }}><div style={{ textAlign: "center", marginBottom: 36 }}><h1 style={{ color: "#fff", fontFamily: "'Lora',serif", fontSize: 24, margin: "0 0 6px" }}>Sice</h1></div><div style={{ background: "rgba(255,255,255,.97)", borderRadius: 20, padding: "32px 28px" }}><h2 style={{ fontFamily: "'Lora',serif", fontSize: 18, color: "#1B4332", margin: "0 0 22px" }}>Acessar o sistema</h2><div style={{ display: "flex", flexDirection: "column", gap: 14 }}><Field label="E-mail"><input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} /></Field><Field label="Senha"><input style={inputStyle} type="password" value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} /></Field>{error && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "9px 13px", borderRadius: 8, fontSize: 12 }}>{error}</div>}<Btn onClick={handle} size="lg" style={{ marginTop: 4, justifyContent: "center" }}>Entrar →</Btn></div></div></div></div>);};

export default LoginPage;
