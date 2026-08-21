import "./globals.css";

export const metadata = {
  title: "SocialBoost | SMM Panel Premium",
  description: "Tingkatkan interaksi sosial media kamu dengan cepat dan aman. Followers, Likes, Views, dan Subscribers termurah.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="main-wrapper">
          <nav style={{ padding: '1.5rem 5%', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/" style={{ textDecoration: 'none' }}>
              <h2 className="gradient-text" style={{ fontSize: '1.6rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>SocialBoost<span style={{color: '#fff', fontSize: '1.6rem'}}>.</span></h2>
            </a>
            <div>
              <a href="/login" style={{ textDecoration: 'none' }}>
                <button className="glass-button" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Login / Daftar</button>
              </a>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
