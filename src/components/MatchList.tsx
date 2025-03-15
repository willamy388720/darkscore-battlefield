import { useNavigate } from "react-router-dom";
import { useMatch, Match } from "../contexts/MatchContext";
import { Button } from "@/components/ui/button";
import { CalendarClock, Users, Trophy, Clock } from "lucide-react";
import { format } from "date-fns";
import { getGameDuration } from "@/lib/utils";

interface MatchListProps {
  isHistory?: boolean;
}

const MatchList = ({ isHistory = false }: MatchListProps) => {
  const { matches, history, isLoading } = useMatch();
  const navigate = useNavigate();

  const displayMatches = isHistory ? history : matches;

  // In a real app, fetch matches from Firestore here

  const handleMatchClick = (matchId: string) => {
    if (!isHistory) {
      navigate(`/match/${matchId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando partidas...</p>
      </div>
    );
  }

  if (displayMatches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {isHistory
            ? "Nenhum histórico de partidas ainda."
            : "Nenhuma partida ativa encontrada."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayMatches.map((match) => (
        <div
          key={match.id}
          className={`game-card ${
            !isHistory ? "cursor-pointer hover:border-neon-purple/50" : ""
          }`}
          onClick={() => !isHistory && handleMatchClick(match.id)}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-game neon-text text-white text-lg">
              {match.title}
            </h3>
            {isHistory && (
              <div className="bg-neon-purple/30 text-white text-xs px-2 py-1 rounded-full">
                Concluída
              </div>
            )}
          </div>

          <div className="flex justify-between items-start mb-3">
            <h3 className="font-cyber text-white text-lg">
              {isHistory ? "Jogaram" : "Jogando"} {match.gameTitle}
            </h3>
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <CalendarClock size={14} className="mr-1" />
            <span>{format(match.createdAt, "MMM d, yyyy 'às' h:mm a")}</span>
          </div>

          {isHistory && (
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Clock size={14} className="mr-1" />
              <span>
                Duração da partida{" "}
                {getGameDuration(match.createdAt, match.finishedAt)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Users size={16} className="mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">
                {match.players.length}{" "}
                {match.players.length > 1 ? "jogadores" : "jogador"}
              </span>
            </div>

            {/* Show winner for history matches */}
            {isHistory && (
              <div className="flex items-center">
                <Trophy size={16} className="mr-2 text-neon-green" />
                {match.players.length > 0 ? (
                  <div className="flex items-center">
                    <span className="text-white mr-2">
                      {
                        match.players.reduce((prev, current) =>
                          prev.score > current.score ? prev : current
                        ).name
                      }
                    </span>
                    <span className="text-neon-green">
                      (
                      {
                        match.players.reduce((prev, current) =>
                          prev.score > current.score ? prev : current
                        ).score
                      }
                      )
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Nenhum vencedor</span>
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
                Ver partida
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchList;
