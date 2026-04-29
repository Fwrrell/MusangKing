import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

import {
  MapIcon,
  FileText,
  BookOpen,
  LayoutDashboard,
  ChartColumnIncreasing,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { icon: LayoutDashboard, title: "Beranda", url: "/" },
  { icon: MapIcon, title: "Peta", url: "/app", primary: true },
  { icon: FileText, title: "Laporanku", url: "/app/laporanku" },
  { icon: ChartColumnIncreasing, title: "Statistik", url: "/app/statistik" },
  { icon: BookOpen, title: "Panduan", url: "/app/panduan" },
];

const mobileDockItems = [
  { icon: LayoutDashboard, title: "Beranda", url: "/" },
  { icon: FileText, title: "Laporan", url: "/app/laporanku" },
  { icon: MapIcon, title: "Peta", url: "/app", primary: true },
  { icon: ChartColumnIncreasing, title: "Statistik", url: "/app/statistik" },
  { icon: BookOpen, title: "Panduan", url: "/app/panduan" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-[#dbe9f6] bg-[#fbfef9] text-[#23395b] shadow-[18px_0_50px_rgba(35,57,91,0.08)]">
      <SidebarHeader className="px-5 pb-2 pt-5">
        <Link
          to="/app"
          className="group flex items-center rounded-3xl bg-white/80 px-3 py-2 shadow-sm ring-1 ring-[#276fbf]/10 transition hover:shadow-md"
        >
          <img
            src="/lentera-logo-horizontal.png"
            alt="Logo Lentera"
            className="h-20 w-auto object-contain transition group-hover:scale-[1.02]"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 pb-5 pt-5">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive =
                  item.url === "/" || item.url === "/app"
                    ? location.pathname === item.url
                    : location.pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-12 rounded-2xl px-4 text-sm font-semibold transition-all duration-200",
                        "hover:bg-[#fff7d3] hover:text-[#23395b]",
                        isActive
                          ? "bg-[#276fbf] text-white shadow-lg shadow-[#276fbf]/25"
                          : "text-[#23395b]/70",
                      )}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <span
                          className={cn(
                            "grid size-8 place-items-center rounded-xl transition",
                            isActive ? "bg-white/20" : "bg-[#276fbf]/10",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "size-4",
                              isActive ? "text-white" : "text-[#276fbf]",
                            )}
                          />
                        </span>
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

export function MobileDockNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:hidden">
      <div className="relative mx-auto grid h-[76px] max-w-md grid-cols-5 items-center rounded-[2rem] border border-white/70 bg-[#fbfef9]/95 px-2 shadow-[0_18px_60px_rgba(35,57,91,0.22)] backdrop-blur-xl">
        {mobileDockItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === "/app"}
            className={({ isActive }) =>
              cn(
                "group flex flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition",
                item.primary
                  ? "-mt-8"
                  : "h-14 text-[#23395b]/55 hover:text-[#276fbf]",
                isActive && !item.primary && "text-[#276fbf]",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "grid place-items-center transition-all",
                    item.primary
                      ? cn(
                          "size-16 rounded-full border-[6px] border-[#fbfef9] bg-[#276fbf] shadow-xl shadow-[#276fbf]/35",
                          isActive && "bg-[#23395b]",
                        )
                      : cn(
                          "size-8 rounded-xl",
                          isActive ? "bg-[#276fbf]/10" : "bg-transparent",
                        ),
                  )}
                >
                  <item.icon
                    className={cn(
                      item.primary ? "size-7 text-white" : "size-5",
                      !item.primary &&
                        (isActive ? "text-[#276fbf]" : "text-current"),
                    )}
                  />
                </span>

                <span
                  className={cn(
                    item.primary
                      ? "mt-1 text-[#23395b]"
                      : isActive
                        ? "text-[#276fbf]"
                        : "text-current",
                  )}
                >
                  {item.title}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
