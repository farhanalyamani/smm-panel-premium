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
      <a href="/admin" style={{ textDecoration: 'none' }}>
        <button className="btn-primary btn-sm">Login</button>
      </a>
    </nav>
  );
}
