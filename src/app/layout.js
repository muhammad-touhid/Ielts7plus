import "./globals.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export const metadata = {
  title: "IELTS7+",
  description: "Get 7+ with IELTS7+",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont/dist/tabler-icons.min.css"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
