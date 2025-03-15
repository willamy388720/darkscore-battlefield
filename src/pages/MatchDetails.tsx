
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMatch, Match } from "../contexts/MatchContext";
import Navbar from "../components/Navbar";
import PlayerCard from "../components/PlayerCard";
import InvitePlayerForm from "../components/InvitePlayerForm";
import MatchControls from "../components/MatchControls";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, CalendarClock } from "lucide-react";
import { format } from "date-fns";

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, loading: authLoading } = useAuth();
  const { matches, setCurrentMatch } = useMatch();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Redirect to home if not logged in
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/");
    }
  }, [currentUser, authLoading, navigate]);

  // Find and set the current match
  useEffect(() => {
    if (id) {
      // In a real app, this would fetch the match from Firestore
      const foundMatch = matches.find(m => m.id === id);
      
      if (foundMatch) {
        setMatch(foundMatch);
        setCurrentMatch(foundMatch);
      } else {
        // For demo purposes, create a mock match
        const mockMatch: Match = {
          id,
          title: "Game Night",
          createdBy: "user123",
          createdAt: { toDate: () => new Date() } as any,
          players: [
            { 
              id: currentUser?.uid || "user1", 
              name: currentUser?.displayName || "Player 1", 
              photoURL: currentUser?.photoURL || "https://ui-avatars.com/api/?name=P1&background=8B5CF6&color=fff", 
              score: 0 
            },
          ],
          active: true
        };
        
        setMatch(mockMatch);
        setCurrentMatch(mockMatch);
      }
      
      setLoading(false);
    }
  }, [id, matches, currentUser, setCurrentMatch]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <Navbar />
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading match details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser || !match) {
    return null; // Will redirect or is loading
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <Navbar />
        
        <div className="mb-6">
          <Button onClick={() => navigate("/dashboard")} variant="ghost" className="text-muted-foreground hover:text-white flex items-center gap-1">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-cyber text-white mb-2">{match.title}</h1>
          <div className="flex items-center text-muted-foreground">
            <CalendarClock size={16} className="mr-2" />
            <span>
              {match.createdAt.toDate ? format(match.createdAt.toDate(), "MMMM d, yyyy 'at' h:mm a") : "Recent"}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-cyber text-white mb-4">Players</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {match.players.map(player => (
                <PlayerCard key={player.id} player={player} matchId={match.id} />
              ))}
            </div>
            
            <MatchControls matchId={match.id} />
          </div>
          
          <div className="lg:col-span-1">
            <InvitePlayerForm matchId={match.id} />
            
            <div className="game-card mt-6">
              <h3 className="text-lg font-cyber mb-4 text-white">Leaderboard</h3>
              
              {match.players.length > 0 ? (
                <div className="space-y-3">
                  {[...match.players]
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => (
                      <div key={player.id} className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center mr-3">
                          {index === 0 && <span className="text-yellow-400 text-lg">👑</span>}
                          {index !== 0 && <span className="text-muted-foreground">#{index + 1}</span>}
                        </div>
                        <div className="flex items-center flex-1">
                          <img 
                            src={player.photoURL || "/placeholder.svg"} 
                            alt={player.name} 
                            className="w-6 h-6 rounded-full mr-2 border border-neon-purple/30" 
                          />
                          <span className="text-white">{player.name}</span>
                        </div>
                        <div className="text-neon-green font-cyber">{player.score}</div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <p className="text-muted-foreground">No players yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
