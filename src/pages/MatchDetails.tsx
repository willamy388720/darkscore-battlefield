import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMatch, Match } from "../contexts/MatchContext";
import Navbar from "../components/Navbar";
import PlayerCard from "../components/PlayerCard";
import InvitePlayerForm from "../components/InvitePlayerForm";
import MatchControls from "../components/MatchControls";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarClock, CameraIcon } from "lucide-react";
import { format } from "date-fns";
import html2canvas from "html2canvas";

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, loading: authLoading } = useAuth();
  const { matches, setCurrentMatch } = useMatch();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const printRef = useRef<HTMLDivElement>(null);

  const handleScreenshot = async () => {
    if (!printRef.current) return;

    // Garante que imagens externas sejam renderizadas corretamente
    const allImages = printRef.current.getElementsByTagName("img");
    for (let img of allImages) {
      if (!img.complete) {
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }
    }

    // Captura o componente como imagem
    const canvas = await html2canvas(printRef.current, {
      backgroundColor: "#121212", // Define um fundo para evitar fundo branco
      scale: 3, // Aumenta a qualidade da imagem
      useCORS: true, // Permite capturar imagens externas
    });

    // Converte o canvas para URL de imagem
    const image = canvas.toDataURL("image/png");

    // Cria um link para download da imagem
    const link = document.createElement("a");
    link.href = image;
    link.download = "classificacao.png";
    link.click();
  };

  // Redirect to home if not logged in
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/");
    }
  }, [currentUser, authLoading, navigate]);

  // Find and set the current match
  useEffect(() => {
    if (id) {
      // In a real app, this would fetch the match from Firestore
      const foundMatch = matches.find((m) => m.id === id);

      if (foundMatch) {
        setMatch(foundMatch);
        setCurrentMatch(foundMatch);
      } else {
        navigate("/dashboard");
      }

      setLoading(false);
    }
  }, [id, matches, setCurrentMatch]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <Navbar />
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
              Carregando detalhes da partida...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser || !match) {
    return null; // Will redirect or is loading
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <Navbar />

        <div className="mb-6">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            className="text-muted-foreground hover:text-white flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            <span>Voltar para o Dashboard</span>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-game neon-text text-white mb-2">
            {match.title}
          </h1>
          <h1 className="text-2xl font-cyber text-white mb-2">
            Jogando {match.gameTitle}
          </h1>
          <div className="flex items-center text-muted-foreground">
            <CalendarClock size={16} className="mr-2" />
            <span>
              {match.createdAt
                ? format(match.createdAt, "MMMM d, yyyy 'às' h:mm a")
                : "Recente"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-cyber text-white mb-4">Jogadores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {match.players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  matchId={match.id}
                />
              ))}
            </div>

            {currentUser && currentUser.uid === match.createdBy && (
              <MatchControls matchId={match.id} />
            )}
          </div>

          <div className="lg:col-span-1">
            <InvitePlayerForm matchId={match.id} />

            <div className="game-card mt-6">
              <h3 className="text-lg font-cyber mb-4 text-white">
                Classificação
              </h3>

              {match.players.length > 0 ? (
                <div className="space-y-3">
                  {[...match.players]
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => (
                      <div key={player.id} className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center mr-3">
                          {index === 0 && (
                            <span className="text-yellow-400 text-lg">👑</span>
                          )}
                          {index !== 0 && (
                            <span className="text-muted-foreground">
                              #{index + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center flex-1">
                          <img
                            src={player.photoURL || "/placeholder.svg"}
                            alt={player.name}
                            className="w-6 h-6 rounded-full mr-2 border border-neon-purple/30"
                          />
                          <span className="text-white">{player.name}</span>
                        </div>
                        <div className="text-neon-green font-cyber">
                          {player.score}
                        </div>
                      </div>
                    ))}

                  <div className="flex items-center justify-center">
                    <Button onClick={handleScreenshot}>
                      <CameraIcon />
                      Printar Classificação
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum jogador ainda.</p>
              )}
            </div>

            <div style={{ display: "none" }}>
              <div ref={printRef} className="game-card mt-6">
                <h3 className="text-lg font-cyber mb-4 text-white">
                  Classificação da partida {match.title}
                </h3>

                <h3 className="text-lg font-cyber mb-4 text-muted-foreground">
                  Jogando {match.gameTitle}
                </h3>

                {match.players.length > 0 ? (
                  <div className="space-y-3">
                    {[...match.players]
                      .sort((a, b) => b.score - a.score)
                      .map((player, index) => (
                        <div key={player.id} className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center mr-3">
                            {index === 0 && (
                              <span className="text-yellow-400 text-lg">
                                👑
                              </span>
                            )}
                            {index !== 0 && (
                              <span className="text-muted-foreground">
                                #{index + 1}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center flex-1">
                            <img
                              src={player.photoURL || "/placeholder.svg"}
                              alt={player.name}
                              className="w-6 h-6 rounded-full mr-2 border border-neon-purple/30"
                            />
                            <span className="text-white">{player.name}</span>
                          </div>
                          <div className="text-neon-green font-cyber">
                            {player.score}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum jogador ainda.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
