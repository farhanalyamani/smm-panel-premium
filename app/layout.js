import "./globals.css";
import Logo from "./components/Logo";

export const metadata = {
  title: "SocialBoost | SMM Panel Premium",
  description: "Platform termurah & terpercaya buat followers, likes, views sosial media. Proses otomatis, harga tangan pertama.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="main-wrapper">
          <nav className="navbar">
            <a href="/" style={{ textDecoration: 'none' }}>
              <Logo size="1.35rem" />
            </a>
            <a href="/admin" style={{ textDecoration: 'none' }}>
              <button className="btn-primary btn-sm">Login</button>
            </a>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
