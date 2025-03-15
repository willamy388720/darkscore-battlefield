
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import CreateMatchForm from "../components/CreateMatchForm";
import MatchList from "../components/MatchList";

const Dashboard = () => {
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <Navbar />
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <Navbar />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <CreateMatchForm />
          </div>
          
          <div className="md:col-span-2">
            <div className="game-card">
              <h2 className="text-2xl font-cyber mb-6 text-white">Active Matches</h2>
              <MatchList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
