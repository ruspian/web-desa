"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  FileText,
  Newspaper,
  Settings,
  LogOut,
  Map,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

// --- CONTEXT ---
const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar harus digunakan dalam SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(true);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// --- MAIN COMPONENT ---
export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

// --- DESKTOP SIDEBAR ---
export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-screen px-4 py-4 hidden md:flex md:flex-col bg-slate-900 text-white shrink-0 border-r border-slate-800 relative z-20",
        className
      )}
      animate={{
        width: animate ? (open ? "280px" : "80px") : "280px",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// --- MOBILE SIDEBAR ---
export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-16 px-6 flex md:hidden items-center justify-between bg-slate-900 border-b border-slate-800 w-full"
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
          <ShieldCheck className="text-white" size={18} />
        </div>
        <span className="font-bold text-white tracking-wide">DesaAdmin</span>
      </div>

      <Menu
        className="text-slate-300 cursor-pointer hover:text-white transition-colors"
        onClick={() => setOpen(!open)}
      />

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "fixed h-full w-[80%] max-w-[300px] inset-y-0 left-0 bg-slate-900 p-6 z-50 flex flex-col justify-between shadow-2xl border-r border-slate-800",
                className
              )}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-white">Menu Admin</h2>
                <X
                  className="text-slate-400 cursor-pointer hover:text-white"
                  onClick={() => setOpen(false)}
                />
              </div>
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- LINK ITEM LOGIC ---
export const SidebarLink = ({ className, ...props }) => {
  const { open, animate, setOpen } = useSidebar();
  const pathname = usePathname();

  // State buat accordion submenu
  const [expanded, setExpanded] = useState(null);

  // MENU KHUSUS WEB DESA
  const adminMenu = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={24} />,
    },

    {
      label: "DATA DESA",
      isHeader: true,
      icon: <ShieldCheck size={24} />,
      subLinks: [
        { label: "Tentang Desa", href: "/admin/data/tentang" },
        { label: "Peta Desa", href: "/admin/data/peta" },
        { label: "Potensi Desa", href: "/admin/data/potensi" },
        { label: "Perangkat Desa", href: "/admin/data/perangkat" },
        { label: "Lembaga Desa", href: "/admin/data/lembaga" },
      ],
    },

    // 2. DATA KEPENDUDUKAN
    {
      label: "KEPENDUDUKAN",
      isHeader: true,
      icon: <Users size={24} />,
      subLinks: [
        { label: "Data Penduduk", href: "/admin/kependudukan/penduduk" },
        { label: "Kartu Keluarga", href: "/admin/kependudukan/kk" },
        { label: "Mutasi Warga", href: "/admin/kependudukan/mutasi" }, // Pindah/Datang/Meninggal
      ],
    },

    // 3. LAYANAN DIGITAL (Surat & Bansos)
    {
      label: "LAYANAN & BANTUAN",
      isHeader: true,
      icon: <FileText size={24} />,
      subLinks: [
        { label: "Verifikasi Surat", href: "/admin/layanan/approved" }, // Cek request surat
        { label: "Buat Surat", href: "/admin/layanan/buat-surat" }, // Cek request surat
        { label: "Arsip Surat", href: "/admin/layanan/arsip" }, // Input penerima BLT/PKH
        { label: "Data Bansos", href: "/admin/layanan/bansos" }, // Input penerima BLT/PKH
        { label: "Pengaduan Warga", href: "/admin/layanan/pengaduan" }, // Cek laporan masalah
      ],
    },

    // 4. KEUANGAN (APBDes)
    {
      label: "KEUANGAN DESA",
      isHeader: true,
      icon: <LayoutDashboard size={24} />, // Atau icon Dollar/Chart kalau ada
      subLinks: [
        { label: "Input APBDes", href: "/admin/keuangan/apbdes" }, // Input Anggaran
        {
          label: "Realisasi Anggaran",
          href: "/admin/keuangan/apbdes/realisasi",
        }, // Update Progress
      ],
    },

    // 5. PUBLIKASI (Berita & Web)
    {
      label: "INFORMASI PUBLIK",
      isHeader: true,
      icon: <Newspaper size={24} />,
      subLinks: [
        { label: "Berita & Artikel", href: "/admin/informasi/berita" },
        { label: "Agenda Kegiatan", href: "/admin/informasi/agenda" },
        { label: "Galeri Foto", href: "/admin/informasi/galeri" },
        { label: "Potensi Desa", href: "/admin/informasi/potensi" },
      ],
    },

    // 6. PETA
    {
      label: "PETA & WILAYAH",
      isHeader: true,
      icon: <Map size={24} />,
      subLinks: [
        { label: "Lokasi Penting", href: "/admin/wilayah/peta" },
        { label: "Batas Wilayah", href: "/admin/wilayah/peta/batas" },
      ],
    },

    {
      label: "Pengaturan",
      href: "/admin/settings",
      icon: <Settings size={24} />,
    },
  ];

  const handleExpand = (label) => {
    setExpanded(expanded === label ? null : label);
  };

  // Render Single Link
  const renderSingleLink = (link) => {
    const isActive = pathname === link.href;
    return (
      <Link
        href={link.href}
        key={link.href}
        onClick={() => {
          if (window.innerWidth < 768) setOpen(false);
        }}
        className={cn(
          "flex items-center justify-start gap-4 group/sidebar py-3 px-3 rounded-xl transition-all duration-200 mb-1",
          isActive
            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
            : "text-slate-400 hover:bg-slate-800 hover:text-white",
          className
        )}
        title={!open ? link.label : ""}
      >
        <span
          className={cn(
            isActive
              ? "text-white"
              : "text-slate-400 group-hover/sidebar:text-white"
          )}
        >
          {link.icon}
        </span>
        <motion.span
          animate={{
            display: animate
              ? open
                ? "inline-block"
                : "none"
              : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="text-sm font-medium whitespace-pre"
        >
          {link.label}
        </motion.span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col justify-between h-full overflow-hidden">
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {/* LOGO BRANDING (Animated) */}
        <div className="flex items-center gap-3 py-4 px-2 mb-6">
          <motion.div
            className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20"
            animate={{ rotate: open ? 0 : 360 }}
            transition={{ duration: 0.5 }}
          >
            <ShieldCheck className="text-white" size={24} />
          </motion.div>
          <motion.div
            animate={{
              display: open ? "block" : "none",
              opacity: open ? 1 : 0,
            }}
          >
            <h1 className="text-white text-lg font-bold tracking-wide">
              Siskeudes
            </h1>
            <p className="text-slate-500 text-xs font-medium">Admin Panel</p>
          </motion.div>
        </div>

        {/* MENU LIST */}
        <div className="flex flex-col gap-1">
          {adminMenu.map((item, idx) => {
            // RENDER GROUP (DROPDOWN)
            if (item.subLinks) {
              const isGroupOpen = expanded === item.label;
              const isChildActive = item.subLinks.some(
                (sub) => pathname === sub.href
              );

              return (
                <div key={idx} className="mt-1">
                  {/* Group Header */}
                  <div
                    onClick={() => (open ? handleExpand(item.label) : null)}
                    className={cn(
                      "flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-colors",
                      isChildActive && !open
                        ? "bg-slate-800"
                        : "hover:bg-slate-800/50",
                      !open && "justify-center"
                    )}
                    title={!open ? item.label : ""}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          isChildActive ? "text-emerald-400" : "text-slate-400"
                        )}
                      >
                        {item.icon}
                      </span>
                      {open && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={cn(
                            "text-sm font-medium",
                            isChildActive ? "text-white" : "text-slate-400"
                          )}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </div>
                    {/* Arrow Icon */}
                    {open && (
                      <div className="text-slate-500">
                        {isGroupOpen ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sublinks (Hanya muncul kalau Expanded & Sidebar Open) */}
                  <AnimatePresence>
                    {isGroupOpen && open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden ml-4 pl-4 border-l border-slate-700 flex flex-col gap-1 mt-1"
                      >
                        {item.subLinks.map((subLink) => {
                          const isSubActive = pathname === subLink.href;
                          return (
                            <Link
                              href={subLink.href}
                              key={subLink.href}
                              onClick={() => {
                                if (window.innerWidth < 768) setOpen(false);
                              }}
                              className={cn(
                                "py-2 px-3 rounded-lg text-sm transition-colors block",
                                isSubActive
                                  ? "text-emerald-400 bg-emerald-400/10 font-medium"
                                  : "text-slate-400 hover:text-white hover:bg-slate-800"
                              )}
                            >
                              {subLink.label}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            // RENDER SINGLE LINK
            return renderSingleLink(item);
          })}
        </div>
      </div>

      {/* PROFILE / LOGOUT */}
      <div className="pt-4 mt-4 border-t border-slate-800">
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all group hover:bg-red-500/10"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors text-slate-400 shrink-0">
            <LogOut size={20} />
          </div>

          <motion.div
            animate={{
              display: open ? "block" : "none",
              opacity: open ? 1 : 0,
            }}
            className="overflow-hidden"
          >
            <p className="text-sm font-medium text-slate-200 group-hover:text-red-400 truncate">
              Admin Desa
            </p>
            <p className="text-xs text-slate-500 truncate">Sign Out</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
