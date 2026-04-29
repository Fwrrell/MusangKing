import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, MobileDockNav } from "@/components/app-sidebar";

export default function UserLayouts() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex h-screen w-full flex-1 flex-col overflow-hidden bg-[#fbfef9] text-[#23395b]">
        <header className="z-10 hidden items-center border-b border-[#276fbf]/10 bg-[#fbfef9]/80 px-5 py-4 shadow-sm backdrop-blur-xl md:flex">
          <SidebarTrigger className="text-[#23395b]/60 hover:bg-[#276fbf]/10 hover:text-[#276fbf]" />

          <div className="ml-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#276fbf]">
              Lentera
            </p>
            <h2 className="text-sm font-bold text-[#23395b]">
              Peta Laporan Kota Bandung
            </h2>
          </div>
        </header>

        <div className="relative flex-1 overflow-y-auto pb-24 md:pb-0">
          <Outlet />
        </div>

        <MobileDockNav />
      </main>
    </SidebarProvider>
  );
}
