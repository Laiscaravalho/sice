'use client';
import { useState, useEffect } from 'react';
const SICE_APP_VERSIION = '1.0';
// Sice - Sistema de Compras e Estoque - Terceiro Setor
// Este e o componente principal do sistema.
// Versao: 1.0.0 | Stack: Next.js 14 + React 18 + Tailwind CSS
// Para uso com banco de dados, consulte prisma/schema.prisma e lib/types.ts

export default function SiceApp() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif', background: '#F0F7F4' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 480, width: '100%', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌱</div>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: 28, color: '#1B4332', marginBottom: 8 }}>Sice</h1>
          <p style={{ color: '#6B7A6E', fontSize: 13 }}>Sistema de Compras e Estoque - Terceiro Setor</p>
        </div>
        <div style={{ background: '#F0F7F4', borderRadius: 12, padding: 20 }}>
          <p style={{ color: '#1B4332', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>👤 Contas de demonstração</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
            <span>ana@org.com / 123456 - Solicitante</span>
            <span>aux@org.com / 123456 - Auxiliar Administrativo</span>
            <span>gestor@org.com / 123456 - Gestor Financeiro</span>
            <span>admin@org.com / admin123 - Administrador</span>
          </div>
          <p style={{ color: '#DC2626', fontSize: 11, marginTop: 12 }}>
            ⚠ A interface completa esta no arquivo <strong>components/SiceApp.jsx</strong> (arquivo grande). Para deploy, use git push diretamente.
          </p>
        </div>
      </div>
    </div>
  );
}
