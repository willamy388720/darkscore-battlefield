import { useEffect, useState } from "react";
import { useMatch } from "../contexts/MatchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Friend, Invitation, useAuth } from "@/contexts/AuthContext";
import { get, onValue, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { PlayerWithInvitations } from "@/dtos/playerWithInvitationsDTO";

interface InvitePlayerFormProps {
  matchId: string;
}

const InvitePlayerForm = ({ matchId }: InvitePlayerFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<PlayerWithInvitations[]>([])

  const { invitePlayer, currentMatch } = useMatch();
  const { toast } = useToast();
  const {friends} = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Erro",
        description: "E-mail é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      await invitePlayer(matchId, email);

      toast({
        title: "Sucesso",
        description: "Jogador convidado com sucesso!",
      });
      setEmail("");
    } catch (error) {
      console.error("Error inviting player:", error);
      toast({
        title: "Error",
        description: "Falha ao convidar jogador. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteMatch = async (friend: Friend) => {
    try {
      setIsLoading(true);

      await invitePlayer(matchId, friend.email);

      const playerIndex = players.findIndex(player => player.uid === friend.uid)

      if (playerIndex > -1) {
        const clonePlayers = [...players]

        clonePlayers[playerIndex].invitation = true

        setPlayers([...clonePlayers])
      }

      toast({
        title: "Sucesso",
        description: "Jogador convidado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Falha ao convidar jogador. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    const friendsFiltered = friends.filter(friend => 
      !currentMatch.players.some(player => player.id === friend.uid)
    );
  
    const fetchInvitations = async () => {
      const updatedPlayers: PlayerWithInvitations[] = [];
  
      for (const friend of friendsFiltered) {
        const invitationsRef = ref(
          database,
          `invitations_sent/${friend.uid}/invitations/`
        );
  
        const dataInvitations = await get(invitationsRef);
  
        const invitationExists = dataInvitations.exists()
          ? Object.values<Invitation>(dataInvitations.val()).some(inv => inv.matchId === matchId)
          : false;
  
        updatedPlayers.push({ ...friend, invitation: invitationExists });
      }
  
      setPlayers(updatedPlayers); 
    };
  
    fetchInvitations();
  }, [currentMatch, friends]);

  return (
    <Dialog>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 game-card">

        <h3 className="text-lg font-cyber mb-2 text-white">Convidar Jogador</h3>
        
          <DialogTrigger>
            <Button
              type="button"
              disabled={isLoading}
              className="bg-neon-green/100 hover:bg-neon-green/90 flex items-center gap-2 mb-2 w-full"
            >
              <Users size={16} />
              <span>Convidar da lista de amigos</span>
            </Button>
          </DialogTrigger>
          
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <DialogTitle>Convidar Amigos</DialogTitle>

              <div className="flex flex-col gap-3 mt-3">
                {players.length === 0 && 
                  <h2 className="text-lg font-cyber text-muted-foreground">
                    Todos seus amigos já estão na partida.
                  </h2>
                }

                {players.map(friend => (
                  <div key={friend.uid} className="game-card flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <img
                        src={friend.photoURL || "/placeholder.svg"}
                        alt={friend.displayName}
                        className="w-6 h-6 rounded-full mr-2 border border-neon-purple/30"
                      />
                      <span className="text-white">{friend.displayName}</span>
                    </div>

                    {friend.invitation ?  
                      (
                        <div className="bg-neon-purple/30 text-white text-xs px-2 py-1 rounded-full">
                          Convidado
                        </div>
                      ) : 
                      (
                        <Button
                          onClick={() => handleInviteMatch(friend)}
                          className="game-button flex items-center gap-2"
                        >
                          <span>{isLoading ? "Convidando..." : "Convidar"}</span>
                        </Button>
                      )
                    }
                  </div>
                ))}
              </div>
            </DialogContent>
          </DialogPortal>
        
        <h3 className="text-sm font-cyber mb-2 text-muted-foreground text-center">OU</h3>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o e-mail do jogador..."
            className="bg-background/50 border-neon-purple/30 text-white flex-1"
            required
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-neon-green/100 hover:bg-neon-green/90 flex items-center gap-2"
          >
            <UserPlus size={16} />
            <span>{isLoading ? "Convidando..." : "Convidar"}</span>
          </Button>
        </div>
      </form>
    </Dialog>

  );
};

export default InvitePlayerForm;
