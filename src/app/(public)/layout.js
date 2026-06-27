import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SessionWrapper from "@/components/common/SessionWrapper";

export default function PublicLayout({ children }) {
  return (
    <SessionWrapper>
      <Header />
      <main>{children}</main>
      <Footer />
    </SessionWrapper>
  );
}
