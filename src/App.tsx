import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MatchProvider } from "./contexts/MatchContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MatchDetails from "./pages/MatchDetails";
import HistoryPage from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";
import Invitations from "./pages/Invitations";
import Friends from "./pages/Friends";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MatchProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/match/:id" element={<MatchDetails />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/invitations" element={<Invitations />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MatchProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
