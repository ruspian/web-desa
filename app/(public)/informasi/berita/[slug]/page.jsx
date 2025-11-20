import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  Tag,
  ChevronLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

// Simulasi Fetch Data (Nanti diganti query Prisma)
// Kalau slug gak ketemu, bisa return null/404
const getPostData = (slug) => {
  // Disini harusnya: await prisma.post.findUnique({ where: { slug } })
  return {
    title: "Pembangunan Jalan Dusun Krajan Selesai Tepat Waktu",
    date: "20 November 2025",
    author: "Admin Desa",
    category: "Pembangunan",
    image:
      "https://images.unsplash.com/photo-1596627649633-b1f74349713c?w=1200&q=80",
    content: `
      <p class="mb-4"><strong>Desa Makmur Jaya</strong> - Proyek pembangunan infrastruktur jalan desa di Dusun Krajan akhirnya rampung dilaksanakan. Pengerjaan yang memakan waktu kurang lebih 3 bulan ini berhasil diselesaikan tepat waktu sesuai dengan target Rencana Kerja Pemerintah Desa (RKPDes) tahun 2025.</p>
      
      <p class="mb-4">Kepala Desa Makmur Jaya, H. Budi Santoso, dalam peresmiannya menyampaikan apresiasi kepada Tim Pengelola Kegiatan (TPK) dan masyarakat yang telah bergotong royong membantu kelancaran proyek ini.</p>
      
      <blockquote class="border-l-4 border-green-500 pl-4 italic my-6 text-gray-700 bg-gray-50 p-4 rounded-r-lg">
        "Jalan ini adalah urat nadi perekonomian warga. Dengan jalan yang bagus, biaya angkut hasil panen jadi lebih murah, dan akses anak sekolah jadi lebih aman," ujar Kades Budi.
      </blockquote>

      <h3 class="text-xl font-bold mt-8 mb-4">Rincian Anggaran</h3>
      <p class="mb-4">Pembangunan jalan aspal sepanjang 2 Kilometer ini menelan biaya sebesar Rp 250.000.000 yang bersumber dari Dana Desa (DD) Tahap II Tahun 2025. Transparansi anggaran dapat dilihat langsung pada papan informasi proyek yang terpasang di lokasi atau melalui menu Transparansi di website ini.</p>
      
      <p>Diharapkan warga dapat bersama-sama merawat jalan ini agar usia pakainya dapat bertahan lama.</p>
    `,
  };
};

const DetailBeritaPage = ({ params }) => {
  const post = getPostData(params.slug);

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 font-sans">
      {/* Header Image (Parallax-ish) */}
      <div className="relative h-[400px] md:h-[500px] w-full">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 container mx-auto">
          <div className="max-w-4xl">
            <Link
              href="/berita"
              className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
            >
              <ChevronLeft size={20} /> Kembali ke Berita
            </Link>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                {post.category}
              </span>
              <span className="flex items-center gap-2 text-gray-300 text-sm">
                <Calendar size={16} /> {post.date}
              </span>
              <span className="flex items-center gap-2 text-gray-300 text-sm">
                <User size={16} /> {post.author}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* === KONTEN UTAMA === */}
        <article className="lg:w-2/3">
          {/* Render HTML Content (DangerouslySetInnerHTML) */}
          <div
            className="prose prose-lg prose-green max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags Section */}
          <div className="mt-12 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-4">
              <Tag size={18} />
              <span className="font-semibold">Tags:</span>
            </div>
            <div className="flex gap-2">
              {["Pembangunan", "Dana Desa", "Infrastruktur"].map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* === SIDEBAR === */}
        <aside className="lg:w-1/3 space-y-8">
          {/* Share Card */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Share2 size={20} /> Bagikan Berita
            </h3>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 flex justify-center items-center">
                <Facebook size={18} />
              </button>
              <button className="flex-1 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 flex justify-center items-center">
                <Twitter size={18} />
              </button>
              <button className="flex-1 py-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 flex justify-center items-center">
                <Linkedin size={18} />
              </button>
            </div>
          </div>

          {/* Berita Terkait (Dummy) */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Berita Lainnya</h3>
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <Link key={item} href="#" className="flex gap-4 group">
                  <div className="w-20 h-20 relative shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={`https://images.unsplash.com/photo-15${item}0000-example`}
                      alt="Thumb"
                      fill
                      className="bg-gray-200 object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm leading-snug mb-1 group-hover:text-green-600 line-clamp-2">
                      Kegiatan Musyawarah Desa Perencanaan 2026
                    </h4>
                    <span className="text-xs text-gray-400">12 Nov 2025</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default DetailBeritaPage;
