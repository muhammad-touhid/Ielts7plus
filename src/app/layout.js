import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "IELTS7+",
  description: "Get 7+ with IELTS7+",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
