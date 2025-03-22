import { useNavigate } from "react-router-dom";
import { useMatch } from "../contexts/MatchContext";
import { Button } from "@/components/ui/button";
import { CalendarClock, Users } from "lucide-react";
import { format } from "date-fns";

const MatchList = () => {
  const { matches, isLoading } = useMatch();
  const navigate = useNavigate();

  // In a real app, fetch matches from Firestore here

  const handleMatchClick = (matchId: string) => {  
    navigate(`/match/${matchId}`);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando partidas...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Nenhuma partida ativa encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div
          key={match.id}
          className={`game-card cursor-pointer hover:border-neon-purple/50`}
          onClick={() => handleMatchClick(match.id)}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-game neon-text text-white text-lg">
              {match.title}
            </h3>
          </div>

          <div className="flex justify-between items-start mb-3">
            <h3 className="font-cyber text-white text-lg">
              Jogando {match.gameTitle}
            </h3>
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <CalendarClock size={14} className="mr-1" />
            <span>{format(match.createdAt, "MMM d, yyyy 'às' h:mm a")}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center">
            <div className="flex items-center">
              <Users size={16} className="mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">
                {match.players.length}{" "}
                {match.players.length > 1 ? "jogadores" : "jogador"}
              </span>
            </div>

            
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMatchClick(match.id);
                }}
                className="game-button text-sm"
              >
                Ver partida
              </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchList;
