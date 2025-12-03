import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateDisplay } from "@/lib/date";
import { notFound } from "next/navigation";
import CardShare from "@/components/cards/CardShare";
import DOMPurify from "isomorphic-dompurify";

// GENERATE METADATA  UNTUK SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await prisma.berita.findUnique({
    where: { slug },
    select: { title: true, content: true },
  });

  if (!post) {
    return {
      title: "Berita Tidak Ditemukan",
    };
  }

  // Ambil cuplikan teks hilangkan tag HTML
  const desc = post.content.substring(0, 150).replace(/<[^>]+>/g, "") + "...";
  return {
    title: `${post.title}`,
    description: desc,
  };
}

const DetailBeritaPage = async ({ params }) => {
  const { slug } = await params;

  const post = await prisma.berita.findUnique({
    where: { slug: slug },
  });

  if (!post) {
    notFound();
  }

  const cleanContent = DOMPurify.sanitize(post.content);

  const relatePost = await prisma.berita.findMany({
    where: {
      category: post.category,
      status: "PUBLISHED",
      NOT: { id: post.id },
    }, // jangan ambil berita yang sedang tampil
    select: {
      slug: true,
      title: true,
      image: true,
      createdAt: true,
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 font-sans">
      {/* Header Image  */}
      <div className="relative h-[400px] md:h-[500px] w-full">
        <Image
          src={post.image || "/noImage.jpg"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 container mx-auto">
          <div className="max-w-4xl">
            <Link
              href="/informasi/berita"
              className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
            >
              <ChevronLeft size={20} /> Kembali ke Berita
            </Link>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                {post.category}
              </span>
              <span className="flex items-center gap-2 text-gray-300 text-sm">
                <Calendar size={16} /> {formatDateDisplay(post.createdAt)}
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
        {/* KONTEN UTAMA */}
        <article className="lg:w-2/3">
          {/* Render HTML Content*/}
          <div
            className="prose prose-lg prose-green max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />

          {/* Tags Section */}
          <div className="mt-12 pt-6 border-t border-gray-100"></div>
        </article>

        {/* SIDEBAR */}
        <aside className="lg:w-1/3 space-y-8">
          {/* Share Card */}
          <CardShare slug={post.slug} title={post.title} />

          {/* Berita Terkait */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Berita Lainnya</h3>
            <div className="space-y-6">
              {relatePost.length > 0 ? (
                relatePost.map((item) => (
                  <Link
                    key={item}
                    href={`/informasi/berita/${item.slug}`}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-20 relative shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/noImage.jpg"}
                        alt={item.title}
                        fill
                        className="bg-gray-200 object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm leading-snug mb-1 group-hover:text-green-600 line-clamp-2">
                        {item.title}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {formatDateDisplay(item.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500">Tidak ada berita terkait.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default DetailBeritaPage;
