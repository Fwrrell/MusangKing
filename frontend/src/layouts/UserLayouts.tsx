import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function UserLayouts() {
  return (
    // SidebarProvider mengatur state global (buka/tutup) sidebar
    <SidebarProvider>
      <AppSidebar />

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-background text-foreground h-screen overflow-auto">
        {/* Header untuk tombol trigger (opsional, ditaruh di atas konten) */}
        <div className="p-4 flex items-center border-b border-border">
          <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors" />
        </div>

        {/* Tempat halaman dirender */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
