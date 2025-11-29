"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
} from "lucide-react";
import { useDesa } from "@/context/DesaContext";

const Footer = () => {
  const { data: dataDesa } = useDesa();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 font-sans border-t border-slate-800">
      <div className="container mx-auto px-6">
        {/* BAGIAN ATAS  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/*  Identitas Desa */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold text-white flex items-center gap-2"
            >
              {`Desa ${dataDesa?.nama}` || "Web Desa"}
            </Link>
            <p className="text-sm leading-relaxed opacity-80">
              Website resmi Pemerintah Desa {dataDesa?.nama}. Mewujudkan
              pelayanan publik yang transparan, akuntabel, dan modern untuk
              kesejahteraan bersama.
            </p>
          </div>

          {/* Akses Cepat */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Jelajahi</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/profil/tentang"
                  className="hover:text-green-400 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  Tentang Desa
                </Link>
              </li>
              <li>
                <Link
                  href="/pemerintahan/struktur"
                  className="hover:text-green-400 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  Perangkat Desa
                </Link>
              </li>
              <li>
                <Link
                  href="/berita"
                  className="hover:text-green-400 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  Kabar Terkini
                </Link>
              </li>
              <li>
                <Link
                  href="/pemerintahan/apbdes"
                  className="hover:text-green-400 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  Transparansi Dana
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan Warga */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Layanan Warga
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/layanan/surat"
                  className="hover:text-green-400 transition-colors"
                >
                  Permohonan Surat
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan/bansos"
                  className="hover:text-green-400 transition-colors"
                >
                  Cek Bansos
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan/pengaduan"
                  className="hover:text-green-400 transition-colors"
                >
                  Lapor / Pengaduan
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan/status"
                  className="hover:text-green-400 transition-colors"
                >
                  Status Pengajuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Hubungi Kami
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-green-500 shrink-0 mt-0.5" />
                <span>{dataDesa?.alamat}</span>
              </li>
              {dataDesa.telepon && (
                <li className="flex items-center gap-3">
                  <Phone size={20} className="text-green-500 shrink-0" />
                  <span>{dataDesa?.telepon}</span>
                </li>
              )}

              {dataDesa.email && (
                <li className="flex items-center gap-3">
                  <Mail size={20} className="text-green-500 shrink-0" />
                  <span>{dataDesa?.email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Sosmed */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Pemerintah Desa {dataDesa?.nama}.
            Hak Cipta Dilindungi.
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            <a
              href={`https://www.facebook.com/${dataDesa?.facebook || "#"}`}
              target="_blank"
              className="bg-slate-800 p-2 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300"
            >
              <Facebook size={18} />
            </a>
            <a
              href={`https://www.instagram.com/${dataDesa?.instagram || "#"}`}
              target="_blank"
              className="bg-slate-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-all duration-300"
            >
              <Instagram size={18} />
            </a>
            <a
              href={`https://www.youtube.com/${dataDesa?.youtube || "#"}`}
              target="_blank"
              className="bg-slate-800 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
