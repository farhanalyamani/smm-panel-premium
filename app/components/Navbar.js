'use client';

import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function Navbar() {
  const pathname = usePathname();

  // Sembunyikan navbar di halaman admin dan login
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  return (
    <nav className="navbar">
      <a href="/" style={{ textDecoration: 'none' }}>
        <Logo size="1.35rem" />
      </a>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <a href="/live" style={{ textDecoration: 'none', color: '#f87171', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ animation: 'pulse-badge 2s ease-in-out infinite' }}>🔴</span> Live Orders
        </a>
        <a href="/admin" style={{ textDecoration: 'none' }}>
          <button className="btn-primary btn-sm">Login</button>
        </a>
      </div>
    </nav>
  );
}
