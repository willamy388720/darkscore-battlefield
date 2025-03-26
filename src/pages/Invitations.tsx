import { useAuth } from "../contexts/AuthContext";
import MatchInvitation from "@/components/MatchInvitation";
import FriendshipInvitation from "@/components/FriendshipInvitation";

const Invitations = () => {
  const { invitations } = useAuth();

  const friendshipInvitations = invitations.filter(
    (invitation) => invitation.type === "Friend"
  );

  const matchInvitations = invitations.filter(
    (invitation) => invitation.type === "Match"
  );

  return (
    <div className="game-card">
      <h2 className="text-2xl font-cyber mb-6 text-white">Convite recebidos</h2>
      <p className="text-muted-foreground mb-6">
        Veja seus convites para novas partidas! 🎮🔥 Entre no jogo, aceite o
        desafio e mostre quem manda!
      </p>

      {invitations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum convite recebido</p>
        </div>
      )}

      {matchInvitations.length > 0 && (
        <div className="space-y-4 mb-3">
          <h3 className="font-cyber text-white text-lg mb-3">
            Convites para partida
          </h3>
          {matchInvitations.map((invitation) => (
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
            <FriendshipInvitation invitation={invitation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Invitations;
