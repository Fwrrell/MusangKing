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
  { icon: MapIcon, title: "Peta Laporan", url: "/" },
  { icon: FileText, title: "Laporanku", url: "/laporanku" },
  { icon: Bell, title: "Notifikasi", url: "/notifikasi" },
];

const secondaryItems = [
  { icon: Info, title: "Tentang Lentera", url: "/info" },
  { icon: BookOpen, title: "Panduan", url: "/panduan" },
  { icon: Settings, title: "Pengaturan", url: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border bg-sidebar text-sidebar-foreground">
      {/* Bagian Header Sidebar (Branding) */}
      <SidebarHeader className="p-6">
        <h1 className="text-xl font-extrabold tracking-tighter text-primary">
          LOGO
        </h1>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-9 px-3 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Link to={item.url}>
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

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
            Sistem
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="gap-2">
              {secondaryItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-9 px-3 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Link to={item.url}>
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
