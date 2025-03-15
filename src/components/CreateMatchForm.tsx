import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatch } from "../contexts/MatchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CreateMatchForm = () => {
  const [title, setTitle] = useState("");
  const [game, setGame] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createMatch } = useMatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título da partida é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!game.trim()) {
      toast({
        title: "Erro",
        description: "O game da vez é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const matchId = await createMatch(title, game);
      toast({
        title: "Sucesso",
        description: "Partida criada com sucesso!",
      });
      navigate(`/match/${matchId}`);
    } catch (error) {
      console.error("Error creating match:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar partida. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 game-card w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-cyber mb-4 text-center text-white">
        Criar Nova Partida
      </h2>
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-cyber text-muted-foreground"
        >
          Título da Partida
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Insira o título da partida..."
          className="bg-background/50 border-neon-purple/30 text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-cyber text-muted-foreground"
        >
          Game da Vez
        </label>
        <Input
          id="title"
          value={game}
          onChange={(e) => setGame(e.target.value)}
          placeholder="Insira o game que vocês vão jogar..."
          className="bg-background/50 border-neon-purple/30 text-white"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="game-button w-full flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        <span>{isLoading ? "Creating..." : "Create Match"}</span>
      </Button>
    </form>
  );
};

export default CreateMatchForm;
