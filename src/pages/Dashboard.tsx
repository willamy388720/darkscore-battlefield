import CreateMatchForm from "../components/CreateMatchForm";
import MatchList from "../components/MatchList";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <CreateMatchForm />
      </div>

      <div className="md:col-span-2">
        <div className="game-card">
          <h2 className="text-2xl font-cyber mb-6 text-white">
            Partidas ativas
          </h2>
          <MatchList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
