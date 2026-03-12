import {
  LayoutDashboard, ClipboardList, Truck, ShieldCheck, BarChart3,
  Thermometer, FileSearch, Users, FileText, Settings, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth-store";
import { motion } from "framer-motion";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const SECTIONS = [
  {
    label: "Operations",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Sessions", url: "/sessions", icon: ClipboardList },
      { title: "Intake", url: "/intake", icon: Truck },
    ],
  },
  {
    label: "Compliance",
    items: [
      { title: "HACCP", url: "/haccp", icon: ShieldCheck },
      { title: "Cold Chain", url: "/cold-chain", icon: Thermometer },
      { title: "Auditor", url: "/auditor", icon: FileSearch, roles: ["SUPER_ADMIN", "AUDITOR"] as string[] },
    ],
  },
  {
    label: "Analytics",
    items: [
      { title: "Yield", url: "/yield", icon: BarChart3 },
      { title: "Suppliers", url: "/suppliers", icon: Users },
      { title: "Reports", url: "/reports", icon: FileText },
    ],
  },
  {
    label: "Admin",
    items: [
      { title: "Settings", url: "/settings", icon: Settings, roles: ["SUPER_ADMIN", "MANAGER"] as string[] },
    ],
  },
];

function HexagonLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L28.5 9.5V24.5L16 30L3.5 24.5V9.5L16 2Z" fill="hsl(42, 64%, 45%)" />
      <path d="M12 12L16 8L20 12V20L16 24L12 20V12Z" fill="hsl(213, 65%, 15%)" />
      <path d="M14 14L16 12L18 14V18L16 20L14 18V14Z" fill="hsl(42, 64%, 45%)" />
    </svg>
  );
}

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-[hsl(213,65%,15%)]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="shrink-0">
            <HexagonLogo />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white tracking-tight leading-none">
                MeatTrace <span style={{ color: 'hsl(42, 64%, 45%)' }}>Pro</span>
              </span>
              <span className="text-[10px] tracking-[0.1em] uppercase mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Food Safety Platform
              </span>
            </div>
          )}
        </div>

        {/* Nav Sections */}
        {SECTIONS.map((section) => {
          const filteredItems = section.items.filter(
            (item) => !item.roles || (user && item.roles.includes(user.role))
          );
          if (filteredItems.length === 0) return null;

          return (
            <SidebarGroup key={section.label}>
              {!collapsed && (
                <div
                  className="px-4 mt-5 mb-2 text-[11px] uppercase tracking-[0.1em] select-none"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                >
                  {section.label}
                </div>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                            <NavLink
                              to={item.url}
                              end
                              className="relative flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors"
                              activeClassName=""
                              style={{
                                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                                background: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                              }}
                            >
                              {isActive && (
                                <span
                                  className="absolute left-0 rounded-r"
                                  style={{
                                    top: 8, bottom: 8, width: 3,
                                    background: 'hsl(42, 64%, 45%)',
                                    borderRadius: '0 3px 3px 0',
                                  }}
                                />
                              )}
                              <item.icon className="w-4 h-4 shrink-0" />
                              {!collapsed && <span>{item.title}</span>}
                            </NavLink>
                          </motion.div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="bg-[hsl(213,65%,15%)]" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Facility pill */}
        {!collapsed && (
          <div className="px-4 py-2">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-[20px] text-[11px]"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: 'hsl(42, 64%, 45%)' }} />
              KZN Processing Plant
            </div>
          </div>
        )}

        {/* User row */}
        {!collapsed && user && (
          <div className="px-4 py-2 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: 'hsl(42, 64%, 45%)', color: 'hsl(213, 65%, 15%)' }}
            >
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user.name}</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {user.role.replace("_", " ")}
              </p>
            </div>
          </div>
        )}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => { logout(); navigate("/login"); }}
              className="text-sm"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
