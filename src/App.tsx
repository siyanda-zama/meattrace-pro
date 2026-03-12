import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

import { AdminLayout } from "./components/dashboard/AdminLayout";
import { MobileLayout } from "./components/mobile/MobileLayout";

import MobileHome from "./pages/mobile/MobileHome";
import MobileIntake from "./pages/mobile/MobileIntake";
import MobileHACCP from "./pages/mobile/MobileHACCP";
import MobileWeigh from "./pages/mobile/MobileWeigh";
import MobileByProducts from "./pages/mobile/MobileByProducts";
import MobileSync from "./pages/mobile/MobileSync";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Dashboard */}
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sessions" element={<ComingSoon />} />
            <Route path="/intake" element={<ComingSoon />} />
            <Route path="/haccp" element={<ComingSoon />} />
            <Route path="/yield" element={<ComingSoon />} />
            <Route path="/cold-chain" element={<ComingSoon />} />
            <Route path="/auditor" element={<ComingSoon />} />
            <Route path="/suppliers" element={<ComingSoon />} />
            <Route path="/reports" element={<ComingSoon />} />
            <Route path="/settings" element={<ComingSoon />} />
          </Route>

          {/* Mobile PWA */}
          <Route path="/app" element={<MobileLayout />}>
            <Route index element={<MobileHome />} />
            <Route path="intake" element={<MobileIntake />} />
            <Route path="haccp" element={<MobileHACCP />} />
            <Route path="weigh" element={<MobileWeigh />} />
            <Route path="byproducts" element={<MobileByProducts />} />
            <Route path="sync" element={<MobileSync />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
