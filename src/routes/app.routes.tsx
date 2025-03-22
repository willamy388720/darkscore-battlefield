import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import MatchDetails from "@/pages/MatchDetails";
import HistoryPage from "@/pages/HistoryPage";
import Friends from "@/pages/Friends";
import Invitations from "@/pages/Invitations";
import NotFound from "@/pages/NotFound";


export function AppRouter() {
  return (
    <Routes>
        <Route path="/" element={<Index />} />

        <Route
          path="/"
          element={
              <AppLayout />
          }
        >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/match/:id" element={<MatchDetails />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/invitations" element={<Invitations />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}