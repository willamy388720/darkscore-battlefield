import { Friend, Invitation, useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type FriendshipInvitationProps = {
    invitation: Invitation
}

const FriendshipInvitation = ({invitation}: FriendshipInvitationProps) => {
  const { acceptFriendshipInvitation } = useAuth();
  const { toast } = useToast();

  async function handleAcceptFriendshipInvitation(invitedBy: Friend, invitationId: string) {
    try {
      await acceptFriendshipInvitation(invitedBy, invitationId);
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
        key={invitation.id}
        className={"game-card flex items-center justify-between"}
    >
        <div>
            <div className="flex flex-col justify-between items-start mb-3">
                <div className="flex items-center">
                <img
                    src={invitation.invitedBy.photoURL || ""}
                    alt={invitation.invitedBy.displayName || "User"}
                    className="w-8 h-8 rounded-full mr-2 border border-neon-purple/50"
                />
                <span className="text-lg font-cyber">
                    {invitation.invitedBy.displayName} quer ser seu amigo! Aceite o convite e comece a jogar junto.
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
            handleAcceptFriendshipInvitation(invitation.invitedBy, invitation.id);
        }}
        className="game-button text-sm"
        >
        Aceitar convite
        </Button>
    </div>
  );
};

export default FriendshipInvitation;
