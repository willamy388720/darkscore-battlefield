import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { useMatch } from "@/contexts/MatchContext";
import { useToast } from "@/hooks/use-toast";

const Invitations = () => {
  const { currentUser, loading, invitations } = useAuth();
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

  // Redirect to home if not logged in
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/");
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <Navbar />
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <Navbar />

        <div className="game-card">
          <h2 className="text-2xl font-cyber mb-6 text-white">
            Convite recebidos
          </h2>
          <p className="text-muted-foreground mb-6">
            Veja seus convites para novas partidas! 🎮🔥 Entre no jogo, aceite o
            desafio e mostre quem manda!
          </p>

          {invitations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma convite recebido</p>
            </div>
          )}

          {invitations.length > 0 && (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invitations;
