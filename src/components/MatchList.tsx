
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatch, Match } from "../contexts/MatchContext";
import { Button } from "@/components/ui/button";
import { CalendarClock, Users, Trophy } from "lucide-react";
import { format } from "date-fns";

interface MatchListProps {
  isHistory?: boolean;
}

const MatchList = ({ isHistory = false }: MatchListProps) => {
  const { matches, history, setMatches, setHistory } = useMatch();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const displayMatches = isHistory ? history : matches;

  // In a real app, fetch matches from Firestore here
  useEffect(() => {
    // Simulating data loading
    const timer = setTimeout(() => {
      if (isHistory) {
        // Example history data
        if (history.length === 0) {
          setHistory([
            {
              id: "hist1",
              title: "Weekend Tournament",
              createdBy: "user123",
              createdAt: { toDate: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } as any,
              players: [
                { id: "user1", name: "Alex", photoURL: "https://ui-avatars.com/api/?name=Alex&background=8B5CF6&color=fff", score: 5 },
                { id: "user2", name: "Sam", photoURL: "https://ui-avatars.com/api/?name=Sam&background=3B82F6&color=fff", score: 3 },
              ],
              active: false
            },
          ]);
        }
      } else {
        // Example active matches data
        if (matches.length === 0) {
          setMatches([
            {
              id: "match1",
              title: "Friday Night Game",
              createdBy: "user123",
              createdAt: { toDate: () => new Date() } as any,
              players: [
                { id: "user1", name: "Alex", photoURL: "https://ui-avatars.com/api/?name=Alex&background=8B5CF6&color=fff", score: 2 },
                { id: "user2", name: "Sam", photoURL: "https://ui-avatars.com/api/?name=Sam&background=3B82F6&color=fff", score: 1 },
              ],
              active: true
            },
          ]);
        }
      }
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isHistory, setMatches, setHistory, matches.length, history.length]);

  const handleMatchClick = (matchId: string) => {
    if (!isHistory) {
      navigate(`/match/${matchId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading matches...</p>
      </div>
    );
  }

  if (displayMatches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {isHistory ? "No match history yet." : "No active matches found."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayMatches.map((match) => (
        <div 
          key={match.id} 
          className={`game-card ${!isHistory ? "cursor-pointer hover:border-neon-purple/50" : ""}`}
          onClick={() => !isHistory && handleMatchClick(match.id)}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-cyber text-white text-lg">{match.title}</h3>
            {isHistory && (
              <div className="bg-neon-purple/30 text-white text-xs px-2 py-1 rounded-full">
                Completed
              </div>
            )}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <CalendarClock size={14} className="mr-1" />
            <span>
              {format(match.createdAt.toDate(), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Users size={16} className="mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">{match.players.length} players</span>
            </div>
            
            {/* Show winner for history matches */}
            {isHistory && (
              <div className="flex items-center">
                <Trophy size={16} className="mr-2 text-neon-green" />
                {match.players.length > 0 ? (
                  <div className="flex items-center">
                    <span className="text-white mr-2">
                      {match.players.reduce((prev, current) => (prev.score > current.score) ? prev : current).name}
                    </span>
                    <span className="text-neon-green">
                      ({match.players.reduce((prev, current) => (prev.score > current.score) ? prev : current).score})
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">No winner</span>
                )}
              </div>
            )}
            
            {!isHistory && (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleMatchClick(match.id);
                }}
                className="game-button text-sm"
              >
                View Match
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchList;
