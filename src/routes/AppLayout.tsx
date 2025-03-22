import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function AppLayout() {
    const { currentUser, loading } = useAuth();
    const navigate = useNavigate();
  
    // Redirect to home if not logged in
    useEffect(() => {
      if (!loading && !currentUser) {
        navigate("/");
      }
    }, [currentUser, loading, navigate]);
  
    if (loading) {
      return (
        <div className="min-h-screen">
          <div className="container mx-auto px-4">
            <Navbar />
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </div>
        </div>
      );
    }
  
    if (!currentUser) {
      return null; // Will redirect to home
    }
  
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4">
          <Navbar />
  
          <Outlet/>
        </div>
      </div>
    );
}