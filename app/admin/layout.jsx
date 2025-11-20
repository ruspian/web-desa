import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

export const metadata = {
  title: "Admin Page",
  description:
    "Web Desa ini dibuat untuk mempermudah masyarakat melakukan administrasi desa dan dengan adanya web ini desa semakin transparan dan mudah diakses oleh masyarakat",
};

export default function AdminLayout({ children }) {
  return (
    <Sidebar>
      <div className="flex h-screen">
        <SidebarBody>
          <SidebarLink />
        </SidebarBody>

        <main className="flex-1 p-6 overflow-y-auto bg-neutral-50">
          {children}
        </main>
      </div>
    </Sidebar>
  );
}
