import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Sice — Sistema de Compras e Estoque',
  description: 'Sistema de Compras e Estoque para o Terceiro Setor',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return ( <html lang="pt-BR"><body>{children}</body></html> );
}
