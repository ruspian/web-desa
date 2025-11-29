"use client";

import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function CardShare({ slug, title }) {
  const toast = useToast();

  const handleShare = (platform) => {
    // Ambil URL langsung saat tombol diklik
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";

    const currentUrl = `${origin}/informasi/berita/${slug}`;

    if (!currentUrl) return;

    let shareUrl = "";
    const text = encodeURIComponent(title);
    const url = encodeURIComponent(currentUrl);

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "copy":
        navigator.clipboard.writeText(currentUrl);
        toast.success("Link berhasil disalin!", "Copied");
        return;
      default:
        return;
    }

    // Buka jendela popup
    const width = 600;
    const height = 400;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      shareUrl,
      `Share ${platform}`,
      `width=${width},height=${height},top=${top},left=${left},scrollbars=no,resizable=no`
    );
  };

  return (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Share2 size={20} /> Bagikan Berita
      </h3>
      <div className="flex gap-2">
        <button
          onClick={() => handleShare("facebook")}
          className="flex-1 py-2.5 bg-[#1877F2] text-white rounded-xl hover:opacity-90 flex justify-center items-center transition-transform active:scale-95"
          title="Share ke Facebook"
        >
          <Facebook size={20} />
        </button>

        <button
          onClick={() => handleShare("twitter")}
          className="flex-1 py-2.5 bg-[#000000] text-white rounded-xl hover:opacity-90 flex justify-center items-center transition-transform active:scale-95"
          title="Share ke Twitter (X)"
        >
          <Twitter size={20} />
        </button>

        <button
          onClick={() => handleShare("linkedin")}
          className="flex-1 py-2.5 bg-[#0A66C2] text-white rounded-xl hover:opacity-90 flex justify-center items-center transition-transform active:scale-95"
          title="Share ke LinkedIn"
        >
          <Linkedin size={20} />
        </button>

        <button
          onClick={() => handleShare("copy")}
          className="flex-1 py-2.5 bg-gray-600 text-white rounded-xl hover:opacity-90 flex justify-center items-center transition-transform active:scale-95"
          title="Salin Link"
        >
          <LinkIcon size={20} />
        </button>
      </div>
    </div>
  );
}
