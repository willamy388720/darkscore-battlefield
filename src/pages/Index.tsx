
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Gamepad, History } from "lucide-react";

const Index = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (currentUser && !loading) {
      navigate("/dashboard");
    }
  }, [currentUser, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <Navbar />
        
        <div className="flex flex-col items-center justify-center py-16">
          <h1 className="text-4xl font-game neon-text text-center mb-6">DARKSCORE BATTLEFIELD</h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mb-12">
            Create matches, invite friends, and track scores in real-time with our sleek gaming scoreboard system.
          </p>
          
          <div className="w-full max-w-4xl mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="game-card flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center mb-4 animate-pulse-neon">
                  <Gamepad size={32} className="text-neon-purple" />
                </div>
                <h2 className="text-xl font-cyber text-white mb-4">Create Matches</h2>
                <p className="text-muted-foreground mb-6">
                  Set up a new match, invite players, and track scores in real-time. Perfect for game nights and tournaments.
                </p>
                <Button 
                  onClick={() => navigate("/dashboard")} 
                  className="game-button mt-auto"
                >
                  Get Started
                </Button>
              </div>
              
              <div className="game-card flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mb-4 animate-pulse-neon">
                  <History size={32} className="text-neon-blue" />
                </div>
                <h2 className="text-xl font-cyber text-white mb-4">Track History</h2>
                <p className="text-muted-foreground mb-6">
                  Keep a record of all your past matches and see who's the ultimate champion over time.
                </p>
                <Button 
                  onClick={() => navigate("/history")} 
                  className="game-button mt-auto"
                >
                  View History
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Ready to start tracking your game scores?</p>
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="game-button text-lg px-8 py-6"
            >
              Log In & Start Gaming
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
