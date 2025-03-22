import { useNavigate } from "react-router-dom";
import { Invitation } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CalendarClock, GamepadIcon, X } from "lucide-react";
import { format } from "date-fns";
import { useMatch } from "@/contexts/MatchContext";
import { useToast } from "@/hooks/use-toast";

type MatchInvitationProps = {
    invitation: Invitation
}

const MatchInvitation = ({invitation}:MatchInvitationProps) => {
  const { acceptInvitation, removeInvitation } = useMatch();
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

  async function handleRefusevitation(invitationId: string) {
    try {
      await removeInvitation(invitationId);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao recusar convite. Tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <div
        className={"game-card flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between"}
    >
      <div className="w-full sm:w-1/2">
        <div className="flex flex-col justify-between items-start mb-3">
            <h3 className="font-game neon-text text-white sm:text-lg mb-3">
              Um convite para partida {invitation.matchTitle}
            </h3>

            <div className="flex items-center">
              <img
                src={invitation.invitedBy.photoURL || ""}
                alt={invitation.invitedBy.displayName || "User"}
                className="w-8 h-8 rounded-full mr-2 border border-neon-purple/50"
              />

              <span className="text-sm sm:text-lg font-cyber">
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

      <div className="flex flex-col gap-3 w-full sm:w-fit">
        <Button
          onClick={(e) => {
              e.stopPropagation();
              handleAcceptInvitation(invitation.matchId, invitation.id);
          }}
          className="bg-neon-green/100 hover:bg-neon-green/90 text-sm w-full sm:w-fit md:w-full"
        >
          <GamepadIcon size={16}/>
          <span className="hidden md:block">
            Juntar-se a partida
          </span>

          <span className="block sm:hidden">
            Juntar-se
          </span>
        </Button>

        <Button
          onClick={(e) => {
              e.stopPropagation();
              handleRefusevitation(invitation.id);
          }}
          className="bg-destructive/100 hover:bg-destructive/90 text-sm w-full sm:w-fit md:w-full"
        >
          <X size={16}/>
          <span className="hidden md:block">
            Recusar convite
          </span>

          <span className="block sm:hidden">
            Recusar
          </span>
        </Button>
      </div>
    </div>
  );
};

export default MatchInvitation;
