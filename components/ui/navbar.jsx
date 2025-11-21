"use client";
import {
  Book,
  Menu,
  Search,
  Users,
  ChartBarBig,
  MapPin,
  ArrowBigUp,
  BadgeCheck,
  Layers,
  Newspaper,
  CalendarClock,
  BookImage,
  File,
  FileSearchCorner,
  MessageSquareReply,
} from "lucide-react";
import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Navbar({
  logo = {
    url: "/",
    src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen-dark.png",
    alt: "Web Desa Logo",
    title: "Web Desa",
  },

  menu = [
    { title: "Home", url: "/" },
    {
      title: "Profil",
      url: "profil",
      items: [
        {
          title: "Tentang Kami",
          description: "Sejarah desa & Visi Misi",
          icon: <BadgeCheck className="size-5 shrink-0" />,
          url: "/profil/tentang",
        },
        {
          title: "Demografi",
          description: "Data statistik penduduk",
          icon: <ChartBarBig className="size-5 shrink-0" />,
          url: "/profil/demografi",
        },
        {
          title: "Peta Desa",
          description: "Lokasi kantor desa & batas wilayah",
          icon: <MapPin className="size-5 shrink-0" />,
          url: "/profil/peta",
        },
        {
          title: "Potensi Desa",
          description: "UMKM, Wisata, atau Produk Unggulan",
          icon: <ArrowBigUp className="size-5 shrink-0" />,
          url: "/profil/potensi",
        },
      ],
    },
    {
      title: "Pemerintahan",
      url: "pemerintahan",
      items: [
        {
          title: "Struktur Organisasi",
          description: "Struktur organisasi perangkat desa",
          icon: <Users className="size-5 shrink-0" />,
          url: "/pemerintahan/struktur",
        },
        {
          title: "Lembaga Desa",
          description: "Lembaga yang ada di desa",
          icon: <Layers className="size-5 shrink-0" />,
          url: "/pemerintahan/lembaga",
        },
        {
          title: "Transparansi",
          description: "Transparansi pemerintahan desa",
          icon: <Book className="size-5 shrink-0" />,
          url: "/pemerintahan/transparansi",
        },
      ],
    },
    {
      title: "Informasi",
      url: "informasi",
      items: [
        {
          title: "Berita Terkini",
          description: "Berita terkini tentang kegiatan desa",
          icon: <Newspaper className="size-5 shrink-0" />,
          url: "/informasi/berita",
        },
        {
          title: "Agenda",
          description: "Jadwal kegiatan yang ada di desa",
          icon: <CalendarClock className="size-5 shrink-0" />,
          url: "/informasi/agenda",
        },
        {
          title: "Galeri",
          description: "Dokumentasi kegiatan desa",
          icon: <BookImage className="size-5 shrink-0" />,
          url: "/informasi/galeri",
        },
      ],
    },
    {
      title: "Layanan",
      url: "layanan",
      items: [
        {
          title: "Surat Online",
          description: "Buat surat online tanpa datang ke kantor desa",
          icon: <File className="size-5 shrink-0" />,
          url: "/layanan/surat",
        },
        {
          title: "Cek Bantuan",
          description: "Cek penerimaan bantuan sosial",
          icon: <FileSearchCorner className="size-5 shrink-0" />,
          url: "/layanan/bantuan",
        },
        {
          title: "Pengaduan Online",
          description: "Pengaduan online tanpa datang ke kantor desa",
          icon: <MessageSquareReply className="size-5 shrink-0" />,
          url: "/layanan/pengaduan",
        },
      ],
    },
  ],

  auth = {
    signup: { text: "Daftar!", url: "/register" },
    signout: { text: "keluar", onclick: () => signOut({ callbackUrl: "/" }) },
    admin: { text: "Admin", url: "/admin/dashboard" },
  },
}) {
  const [openSearch, setOpenSearch] = React.useState(false);

  const { status, data: sessionData } = useSession();

  return (
    <section className="py-2 px-6 fixed z-20 w-full bg-white">
      <div className="container">
        {/* Desktop Navbar */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link href={logo.url} className="flex items-center gap-2">
              <Image
                width={100}
                height={100}
                src={logo.src}
                className="w-8"
                alt={logo.alt}
              />
            </Link>

            <NavigationMenu className="**:data-radix-navigation-menu-viewport:rounded-3xl">
              <NavigationMenuList className="rounded-3xl">
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenSearch(true)}
            >
              <Search className="size-4" />
            </Button>

            {status === "authenticated" &&
              sessionData?.user?.role === "ADMIN" && (
                <Button asChild size="sm">
                  <Link href={auth.admin.url}>{auth.admin.text}</Link>
                </Button>
              )}

            {status === "unauthenticated" ? (
              <Button asChild size="sm">
                <Link href={auth.signup.url}>{auth.signup.text}</Link>
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="text-white cursor-pointer"
                size="sm"
                onClick={auth.signout.onclick}
              >
                {auth.signout.text}
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Navbar */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-2">
              <Image src={logo.src} width={20} height={20} alt={logo.alt} />
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenSearch(true)}
              >
                <Search className="size-4" />
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>

                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href={logo.url} className="flex items-center gap-2">
                        <Image
                          src={logo.src}
                          width={30}
                          height={30}
                          alt={logo.alt}
                        />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="my-6 flex flex-col gap-6">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>

                    {status === "authenticated" &&
                      sessionData?.user?.role === "ADMIN" && (
                        <Button asChild size="sm">
                          <Link href={auth.admin.url}>{auth.admin.text}</Link>
                        </Button>
                      )}

                    {status === "unauthenticated" ? (
                      <Button asChild size="sm">
                        <Link href={auth.signup.url}>{auth.signup.text}</Link>
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        className="text-white cursor-pointer"
                        size="sm"
                        onClick={auth.signout.onclick}
                      >
                        {auth.signout.text}
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Search Popup */}
      <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
        <CommandInput placeholder="Search products, blogs, resources..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Latest Blog</CommandItem>
            <CommandItem>Pricing Plans</CommandItem>
            <CommandItem>Support</CommandItem>
            <CommandItem>Careers</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </section>
  );
}

const renderMenuItem = (item) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>

        <NavigationMenuContent>
          <ul className="w-80 p-3">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                <NavigationMenuLink asChild>
                  <Link
                    className="flex select-none gap-4 rounded-md p-3 leading-none transition-colors hover:bg-muted hover:text-accent-foreground"
                    href={subItem.url}
                  >
                    {subItem.icon}
                    <div>
                      <div className="text-sm font-semibold">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="text-sm text-muted-foreground">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
          href={item.url}
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item) => {
  if (item.items) {
    return (
      <AccordionItem value={item.title} key={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>

        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none transition-colors hover:bg-muted hover:text-accent-foreground"
              href={subItem.url}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className="font-semibold">
      {item.title}
    </Link>
  );
};
