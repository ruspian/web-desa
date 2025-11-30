import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

export const metadata = {
  title: "Admin Page",
  description:
    "Web Desa ini dibuat untuk mempermudah masyarakat melakukan administrasi desa dan dengan adanya web ini desa semakin transparan dan mudah diakses oleh masyarakat",
};

export default function AdminLayout({ children }) {
  return (
    <div className="h-screen bg-gray-50 font-sans flex flex-col md:flex-row">
      <Sidebar>
        <SidebarBody>
          <SidebarLink />
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
