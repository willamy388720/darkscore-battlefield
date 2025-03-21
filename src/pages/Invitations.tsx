import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import MatchInvitation from "@/components/MatchInvitation";
import FriendshipInvitation from "@/components/FriendshipInvitation";

const Invitations = () => {
  const { currentUser, loading, invitations } = useAuth();

  const navigate = useNavigate();

  const friendshipInvitations = invitations.filter(invitation => invitation.type === "Friend")

  const matchInvitations = invitations.filter(invitation => invitation.type === "Match")

  // Redirect to home if not logged in
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/");
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen">
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
    <div className="min-h-screen">
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

          {matchInvitations.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-cyber text-white text-lg mb-3">
                Convites para partida
              </h3>
              {invitations.map((invitation) => (
                <MatchInvitation invitation={invitation} />
              ))}
            </div>
          )}

          {friendshipInvitations.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-cyber text-white text-lg mb-3">
                Convites de amizade
              </h3>
              {friendshipInvitations.map((invitation) => (
                <FriendshipInvitation invitation={invitation}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invitations;
