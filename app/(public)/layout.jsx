import Navbar from "@/components/ui/navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const generateMetadata = async () => {
  const res = await prisma.siteSettings.findFirst();
  const settingSite = res;

  return {
    title: settingSite?.namaDesa || "Web Desa",
    description:
      "Web Desa ini dibuat untuk mempermudah masyarakat melakukan administrasi desa dan dengan adanya web ini desa semakin transparan dan mudah diakses oleh masyarakat",
    icons: {
      icon: settingSite?.favicon || "/favicon.ico",
    },
  };
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
