import { prisma } from "@/lib/prisma";

export default async function JsonLd() {
  const setting = await prisma.siteSettings.findFirst();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: setting?.namaDesa,
    url: baseUrl,
    logo: setting?.logo,
    description: `Website Resmi ${setting?.namaDesa}. Pusat layanan dan informasi desa.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. KH. Abdul Ghofir Nawawi, Dusun IV Desa Banuroja",
      addressLocality: "Kecamatan Randangan",
      addressRegion: "Gorontalo",
      postalCode: "96469",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: setting?.telepon,
      contactType: "customer service",
      email: setting?.email,
      areaServed: "ID",
      availableLanguage: "Indonesian",
    },
    sameAs: [
      setting?.facebook ? `https://facebook.com/${setting.facebook}` : null,
      setting?.instagram ? `https://instagram.com/${setting.instagram}` : null,
      setting?.youtube ? `https://youtube.com/${setting.youtube}` : null,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
