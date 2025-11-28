import DesaProvider from "@/context/DesaContext";
import { prisma } from "@/lib/prisma";

export default async function DesaDataProvider({ children }) {
  const siteSettings = await prisma.siteSettings.findFirst();

  const data = {
    nama: siteSettings?.namaDesa || "",
    alamat: siteSettings?.alamat || "",
    telepon: siteSettings?.telepon || "",
    email: siteSettings?.email || "",
    favicon: siteSettings?.favicon || "",
    logo: siteSettings?.logo || "",
    facebook: siteSettings?.facebook || "",
    instagram: siteSettings?.instagram || "",
    youtube: siteSettings?.youtube || "",
  };

  return <DesaProvider value={{ data }}>{children}</DesaProvider>;
}
