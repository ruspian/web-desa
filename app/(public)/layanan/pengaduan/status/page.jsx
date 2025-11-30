import PublicCekStatusPengaduanClient from "@/components/client/PublicCekStatusPengaduanClient";

export const metadata = {
  title: "Cek Status Pengaduan",
  description: "Pantau progres tindak lanjut laporan pengaduan Anda.",
};

export default function CekStatusPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 font-sans">
      <PublicCekStatusPengaduanClient />
    </main>
  );
}
