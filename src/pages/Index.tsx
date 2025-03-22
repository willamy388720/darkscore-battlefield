import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Gamepad, History } from "lucide-react";

const Index = () => {
  const { currentUser, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !loading) {
      navigate("/dashboard");
    }
  }, [currentUser, loading, navigate]);

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4">
        <Navbar />

        <div className="flex flex-col items-center justify-center py-16">
          <h1 className="text-2xl sm:text-4xl font-game neon-text text-center mb-6">
            DARKSCORE BATTLEFIELD
          </h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mb-12">
            Crie partidas, convide amigos e acompanhe pontuações em tempo real
            com nosso elegante sistema de placar de jogos.
          </p>

          <div className="w-full max-w-4xl mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="game-card flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center mb-4 animate-pulse-neon">
                  <Gamepad size={32} className="text-neon-purple" />
                </div>
                <h2 className="text-xl font-cyber text-white mb-4">
                  Criar Partidas
                </h2>
                <p className="text-muted-foreground mb-6">
                  Configure uma nova partida, convide jogadores e acompanhe as
                  pontuações em tempo real. Perfeito para noites de jogos e
                  torneios.
                </p>
              </div>

              <div className="game-card flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mb-4 animate-pulse-neon">
                  <History size={32} className="text-neon-blue" />
                </div>
                <h2 className="text-xl font-cyber text-white mb-4">
                  Histórico de partidas
                </h2>
                <p className="text-muted-foreground mb-6">
                  Mantenha um registro de todas as suas partidas anteriores e
                  veja quem é o campeão definitivo ao longo do tempo.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Pronto para começar a monitorar suas pontuações nos jogos?
            </p>
            <Button
              onClick={signInWithGoogle}
              className="game-button text-lg px-8 py-6"
            >
              Faça login e comece a jogar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
