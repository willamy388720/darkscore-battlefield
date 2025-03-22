import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import MatchListHistory from "@/components/MatchListHistory";

const HistoryPage = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

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
            Histórico de Partidas
          </h2>
          <p className="text-muted-foreground mb-6">
            Veja os resultados das suas partidas concluídas. Veja quem ganhou e
            quais foram as pontuações finais.
          </p>

          <MatchListHistory />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
