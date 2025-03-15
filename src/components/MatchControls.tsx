
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
        title: "Scores Reset",
        description: "All player scores have been reset to zero.",
      });
    } catch (error) {
      console.error("Error resetting scores:", error);
      toast({
        title: "Error",
        description: "Failed to reset scores. Please try again.",
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
        title: "Match Ended",
        description: "The match has been moved to history.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error ending match:", error);
      toast({
        title: "Error",
        description: "Failed to end match. Please try again.",
        variant: "destructive",
      });
      setIsEnding(false);
    }
  };

  return (
    <div className="flex gap-4 mt-6">
      <Button
        onClick={handleResetScores}
        disabled={isResetting}
        className="game-button flex-1 flex items-center justify-center gap-2"
      >
        <RefreshCw size={16} />
        <span>{isResetting ? "Resetting..." : "Reset Scores"}</span>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="game-button bg-destructive/20 hover:bg-destructive/30 border-destructive/50 flex-1 flex items-center justify-center gap-2">
            <X size={16} />
            <span>End Match</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-background border-neon-purple/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cyber text-white flex items-center gap-2">
              <AlertTriangle size={20} className="text-destructive" />
              End Match?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will end the current match and move it to history. 
              Player scores will be preserved. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-cyber">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEndMatch}
              disabled={isEnding}
              className="bg-destructive text-white hover:bg-destructive/80 font-cyber"
            >
              {isEnding ? "Ending..." : "End Match"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MatchControls;
