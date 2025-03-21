import { useMatch, Player } from "../contexts/MatchContext";
import { Minus, Plus, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

interface PlayerCardProps {
  player: Player;
  matchId: string;
  currentPlayerIsTheCreator: boolean; 
}

const PlayerCard = ({ player, matchId, currentPlayerIsTheCreator }: PlayerCardProps) => {
  const { increaseScore, removePlayer, decreaseScore } = useMatch();
  const { currentUser } = useAuth();

  const handleIncreaseScore = () => {
    increaseScore(matchId, player.id);
  };

  const handleDecraseScore = () => {
    decreaseScore(matchId, player.id);
  };


  const handleRemovePlayer = () => {
    removePlayer(matchId, player.id);
  };

  // Check if the current user is the owner of this player card
  const isCurrentUser = currentUser?.uid === player.id;

  return (
    <div className="game-card relative justify-center">
      {isCurrentUser && (
        <div className="absolute top-2 right-2 bg-neon-purple/30 text-white text-xs px-2 py-1 rounded-full">
          Você
        </div>
      )}

      {!isCurrentUser && currentPlayerIsTheCreator && (
        <Button
        onClick={handleRemovePlayer}
        variant="ghost"
        className="absolute top-2 right-2 text-muted-foreground hover:text-white"
        >
          <XIcon size={20} />
        </Button>
      )}

      <div className="flex items-center mb-4">
        <img
          src={player.photoURL || "/placeholder.svg"}
          alt={player.name}
          className="w-12 h-12 rounded-full mr-4 border-2 border-neon-purple/50"
        />
        <div>
          <h3 className="font-cyber text-white text-lg">{player.name}</h3>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-col bg-background/70 px-4 py-2 rounded-md border border-neon-purple/30 items-center">
          <span className="text-muted-foreground text-sm">Score</span>
          <div className="text-2xl font-game text-neon-green">
            {player.score}
          </div>
        </div>

        {(isCurrentUser || currentPlayerIsTheCreator) &&  
        <div className="flex gap-2">
          <Button
            onClick={handleDecraseScore}
            className="bg-destructive/100 hover:bg-destructive/90"
            aria-label="Increase score"
          >
            <Minus size={20} />
          </Button>

          <Button
            onClick={handleIncreaseScore}
            className="score-button"
            aria-label="Increase score"
          >
            <Plus size={20} />
          </Button>
        </div>
        }
      </div>
    </div>
  );
};

export default PlayerCard;
