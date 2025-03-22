import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatch } from "../contexts/MatchContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, X, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface MatchControlsProps {
  matchId: string;
}

const MatchControls = ({ matchId }: MatchControlsProps) => {
  const [isResetting, setIsResetting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const { resetScores, endMatch } = useMatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResetScores = async () => {
    try {
      setIsResetting(true);
      await resetScores(matchId);
      toast({
        title: "Scores Redefinidos",
        description: "Todas os scores dos jogadores foram zeradas.",
      });
    } catch (error) {
      console.error("Error resetting scores:", error);
      toast({
        title: "Erro",
        description: "Falha ao redefinir os scores. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleEndMatch = async () => {
    try {
      setIsEnding(true);
      await endMatch(matchId);
      toast({
        title: "Partida encerrada",
        description: "A partida foi movida para o histórico.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error ending match:", error);
      toast({
        title: "Erro",
        description: "Falha ao finalizar a partida. Tente novamente.",
        variant: "destructive",
      });
      setIsEnding(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      <Button
        onClick={handleResetScores}
        disabled={isResetting}
        className="game-button flex-1 flex items-center justify-center gap-2"
      >
        <RefreshCw size={16} />
        <span>{isResetting ? "Redefinindo..." : "Redefinir Scores"}</span>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="game-button bg-destructive/20 hover:bg-destructive/30 border-destructive/50 flex-1 flex items-center justify-center gap-2">
            <X size={16} />
            <span>Finalizar Partida</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-background border-neon-purple/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cyber text-white flex items-center gap-2">
              <AlertTriangle size={20} className="text-destructive" />
              Finalizar Partida?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Isso encerrará a partida atual e a moverá para o histórico. As
              pontuações do jogador serão preservadas. Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-cyber">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEndMatch}
              disabled={isEnding}
              className="bg-destructive text-white hover:bg-destructive/80 font-cyber"
            >
              {isEnding ? "Finalizando..." : "Finalizar Partida"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MatchControls;
