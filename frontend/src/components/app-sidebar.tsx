import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

import {
  MapIcon,
  FileText,
  Bell,
  Info,
  BookOpen,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { icon: MapIcon, title: "Peta Laporan", url: "/app" },
  { icon: FileText, title: "Laporanku", url: "/app/laporanku" },
  { icon: Bell, title: "Notifikasi", url: "/app/notifikasi" },
  { icon: Info, title: "Tentang Lentera", url: "/app/info" },
  { icon: BookOpen, title: "Panduan", url: "/app/panduan" },
  { icon: Settings, title: "Pengaturan", url: "/app/settings" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border bg-sidebar text-sidebar-foreground shadow-xl">
      {/* Bagian Header Sidebar (Branding) */}
      <SidebarHeader className="pl-4 pr-4">
        <Link to="/" className="flex items-center">
          <img
            src="/lentera-logo-horizontal.png"
            alt="Logo Lentera"
            className="h-36 w-auto object-contain"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 bg-sidebar-foreground rounded-t-xl">
        <SidebarGroup>
          <SidebarGroupContent className="px-2 pt-3">
            <SidebarMenu className="gap-3">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-12 px-3 text-sm font-medium transition-all duration-200 rounded-lg",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-muted-foreground/70",
                      )}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        {item.icon && (
                          <item.icon
                            className={cn(
                              "w-5 h-5 flex-shrink-0",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
