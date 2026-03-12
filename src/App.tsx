import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useAuthStore } from "@/lib/stores/auth-store";

import Login from "./pages/Login";
import { AdminLayout } from "./components/dashboard/AdminLayout";
import { MobileLayout } from "./components/mobile/MobileLayout";
import { PageSkeleton } from "./components/dashboard/PageSkeleton";

// Route persistence - remember last page
function RouteListener() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/login" && location.pathname !== "/") {
      localStorage.setItem("lastRoute", location.pathname);
    }
  }, [location]);

  return null;
}

// Lazy load all pages for route-level code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Sessions = lazy(() => import("./pages/Sessions"));
const Intake = lazy(() => import("./pages/Intake"));
const HACCP = lazy(() => import("./pages/HACCP"));
const Yield = lazy(() => import("./pages/Yield"));
const ColdChain = lazy(() => import("./pages/ColdChain"));
const Auditor = lazy(() => import("./pages/Auditor"));
const Suppliers = lazy(() => import("./pages/Suppliers"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const MobileHome = lazy(() => import("./pages/mobile/MobileHome"));
const MobileIntake = lazy(() => import("./pages/mobile/MobileIntake"));
const MobileHACCP = lazy(() => import("./pages/mobile/MobileHACCP"));
const MobileWeigh = lazy(() => import("./pages/mobile/MobileWeigh"));
const MobileByProducts = lazy(() => import("./pages/mobile/MobileByProducts"));
const MobileSync = lazy(() => import("./pages/mobile/MobileSync"));

const queryClient = new QueryClient();

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}

const App = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--mt-surface-1))' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'hsl(var(--mt-gold))', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'hsl(var(--mt-text-muted))' }}>Loading MeatTrace Pro...</p>
        </div>
      </div>
    );
  }

  // Redirect to last route after login
  const getDefaultRoute = () => {
    if (isAuthenticated) {
      const lastRoute = localStorage.getItem("lastRoute");
      if (lastRoute && lastRoute !== "/login" && lastRoute !== "/") {
        return lastRoute;
      }
      // Default routes by role
      if (user?.role === "AUDITOR") return "/auditor";
      if (user?.role === "OPERATOR") return "/app";
      return "/dashboard";
    }
    return "/login";
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <RouteListener />
          <Routes>
            <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Dashboard */}
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<SuspenseWrap><Dashboard /></SuspenseWrap>} />
              <Route path="/sessions" element={<SuspenseWrap><Sessions /></SuspenseWrap>} />
              <Route path="/intake" element={<SuspenseWrap><Intake /></SuspenseWrap>} />
              <Route path="/haccp" element={<SuspenseWrap><HACCP /></SuspenseWrap>} />
              <Route path="/yield" element={<SuspenseWrap><Yield /></SuspenseWrap>} />
              <Route path="/cold-chain" element={<SuspenseWrap><ColdChain /></SuspenseWrap>} />
              <Route path="/auditor" element={<SuspenseWrap><Auditor /></SuspenseWrap>} />
              <Route path="/suppliers" element={<SuspenseWrap><Suppliers /></SuspenseWrap>} />
              <Route path="/reports" element={<SuspenseWrap><Reports /></SuspenseWrap>} />
              <Route path="/settings" element={<SuspenseWrap><Settings /></SuspenseWrap>} />
            </Route>

            {/* Mobile PWA */}
            <Route path="/app" element={<MobileLayout />}>
              <Route index element={<SuspenseWrap><MobileHome /></SuspenseWrap>} />
              <Route path="intake" element={<SuspenseWrap><MobileIntake /></SuspenseWrap>} />
              <Route path="haccp" element={<SuspenseWrap><MobileHACCP /></SuspenseWrap>} />
              <Route path="weigh" element={<SuspenseWrap><MobileWeigh /></SuspenseWrap>} />
              <Route path="byproducts" element={<SuspenseWrap><MobileByProducts /></SuspenseWrap>} />
              <Route path="sync" element={<SuspenseWrap><MobileSync /></SuspenseWrap>} />
            </Route>

            <Route path="*" element={<SuspenseWrap><NotFound /></SuspenseWrap>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
  );
};

export default App;
