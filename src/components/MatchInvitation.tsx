import { useNavigate } from "react-router-dom";
import { Invitation } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { useMatch } from "@/contexts/MatchContext";
import { useToast } from "@/hooks/use-toast";

type MatchInvitationProps = {
    invitation: Invitation
}

const MatchInvitation = ({invitation}:MatchInvitationProps) => {
  const { acceptInvitation } = useMatch();
  const { toast } = useToast();

  const navigate = useNavigate();

  async function handleAcceptInvitation(matchId: string, invitationId: string) {
    try {
      await acceptInvitation(matchId, invitationId);
      navigate(`/match/${matchId}`);
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Falha ao aceitar convite. Tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <div
        className={"game-card flex items-center justify-between"}
    >
        <div>
            <div className="flex flex-col justify-between items-start mb-3">
                <h3 className="font-game neon-text text-white text-lg mb-3">
                Um convite para partida {invitation.matchTitle}
                </h3>

                <div className="flex items-center">
                <img
                    src={invitation.invitedBy.photoURL || ""}
                    alt={invitation.invitedBy.displayName || "User"}
                    className="w-8 h-8 rounded-full mr-2 border border-neon-purple/50"
                />
                <span className="text-lg font-cyber">
                    {invitation.invitedBy.displayName} convidou você para
                    jogar {invitation.gameTitle}
                </span>
                </div>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
                <CalendarClock size={14} className="mr-1" />
                <span>
                {format(invitation.sentAt, "MMM d, yyyy 'às' h:mm a")}
                </span>
            </div>
        </div>

        <Button
            onClick={(e) => {
                e.stopPropagation();
                handleAcceptInvitation(invitation.matchId, invitation.id);
            }}
            className="game-button text-sm"
        >
            Juntar-se a partida
        </Button>
    </div>
  );
};

export default MatchInvitation;
