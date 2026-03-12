import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sessions from "./pages/Sessions";
import Intake from "./pages/Intake";
import HACCP from "./pages/HACCP";
import Yield from "./pages/Yield";
import ColdChain from "./pages/ColdChain";
import Auditor from "./pages/Auditor";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
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
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/intake" element={<Intake />} />
            <Route path="/haccp" element={<HACCP />} />
            <Route path="/yield" element={<Yield />} />
            <Route path="/cold-chain" element={<ColdChain />} />
            <Route path="/auditor" element={<Auditor />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
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
