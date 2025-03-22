import { Friend, Invitation, useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CalendarClock, UserPlusIcon, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type FriendshipInvitationProps = {
    invitation: Invitation
}

const FriendshipInvitation = ({invitation}: FriendshipInvitationProps) => {
  const { acceptFriendshipInvitation, removeInvitation } = useAuth();
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

  async function handleRefuseFriendshipInvitation(invitationId: string) {
    try {
      await removeInvitation(invitationId);
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Falha ao recusar convite. Tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <div
      key={invitation.id}
      className={"game-card flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between"}
    >
      <div className="w-full sm:w-1/2">
        <div className="flex flex-col justify-between items-start mb-3">
            <div className="flex items-center">
              <img
                  src={invitation.invitedBy.photoURL || ""}
                  alt={invitation.invitedBy.displayName || "User"}
                  className="w-8 h-8 rounded-full mr-2 border border-neon-purple/50"
              />
              <span className="text-sm sm:text-lg font-cyber">
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

      <div className="flex flex-col gap-3 w-full sm:w-fit">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleAcceptFriendshipInvitation(invitation.invitedBy, invitation.id);
          }}
          className="bg-neon-green/100 hover:bg-neon-green/90 text-sm w-full sm:w-fit md:w-full"
        >
          <UserPlusIcon size={16}/>
          <span className="hidden md:block">
            Aceitar convite
          </span>

          <span className="block sm:hidden">
            Aceitar
          </span>
        </Button>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleRefuseFriendshipInvitation(invitation.id);
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

export default FriendshipInvitation;
