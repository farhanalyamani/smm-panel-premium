import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "SocialBooster | SMM Panel Premium",
  description: "Platform termurah & terpercaya buat followers, likes, views sosial media. Proses otomatis, harga tangan pertama.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="main-wrapper">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
