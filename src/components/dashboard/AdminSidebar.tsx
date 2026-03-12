import {
  LayoutDashboard, ClipboardList, Truck, ShieldCheck, BarChart3,
  Thermometer, FileSearch, Users, FileText, Settings, LogOut, Shield,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Sessions", url: "/sessions", icon: ClipboardList },
  { title: "Intake", url: "/intake", icon: Truck },
  { title: "HACCP", url: "/haccp", icon: ShieldCheck },
  { title: "Yield", url: "/yield", icon: BarChart3 },
  { title: "Cold Chain", url: "/cold-chain", icon: Thermometer },
  { title: "Auditor", url: "/auditor", icon: FileSearch, roles: ["SUPER_ADMIN", "AUDITOR"] },
  { title: "Suppliers", url: "/suppliers", icon: Users },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings, roles: ["SUPER_ADMIN", "MANAGER"] },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const filteredItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-gradient-navy">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent shrink-0">
            <Shield className="w-4 h-4 text-accent-foreground" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold text-primary-foreground tracking-tight">
              MeatTrace <span className="text-gradient-gold">Pro</span>
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider">
            {!collapsed && "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink
                      to={item.url}
                      end
                      className="text-sidebar-foreground hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-gradient-navy border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="px-4 py-2">
            <p className="text-xs font-medium text-primary-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-sidebar-foreground/60">{user.role.replace("_", " ")}</p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => { logout(); navigate("/login"); }}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
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
