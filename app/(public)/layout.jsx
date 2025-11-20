import Navbar from "@/components/ui/navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Web Desa",
  description:
    "Web Desa ini dibuat untuk mempermudah masyarakat melakukan administrasi desa dan dengan adanya web ini desa semakin transparan dan mudah diakses oleh masyarakat",
};

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
