import MatchListHistory from "@/components/MatchListHistory";

const HistoryPage = () => {

  return (
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
  );
};

export default HistoryPage;
