import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function UserLayouts() {
  return (
    // SidebarProvider mengatur state global (buka/tutup) sidebar
    <SidebarProvider>
      <AppSidebar />

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-background text-zinc-100 h-screen flex flex-col overflow-hidden">
        {/* Header untuk tombol trigger (opsional, ditaruh di atas konten) */}
        <header className="p-4 flex items-center border-b backdrop-blur-md z-10 shadow-xl">
          <SidebarTrigger className="text-zinc-400 hover:text-indigo-400" />
          <h2 className="ml-4 font-medium text-sm text-zinc-400">
            Peta Laporan Kota Bandung
          </h2>
        </header>

        {/* Tempat halaman dirender */}
        <div className="flex-1 relative">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
