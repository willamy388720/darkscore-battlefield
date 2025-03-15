
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatch } from "../contexts/MatchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CreateMatchForm = () => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createMatch } = useMatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Match title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const matchId = await createMatch(title);
      toast({
        title: "Success",
        description: "Match created successfully!",
      });
      navigate(`/match/${matchId}`);
    } catch (error) {
      console.error("Error creating match:", error);
      toast({
        title: "Error",
        description: "Failed to create match. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 game-card w-full max-w-md mx-auto">
      <h2 className="text-xl font-cyber mb-4 text-center text-white">Create New Match</h2>
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-cyber text-muted-foreground">
          Match Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter match title..."
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
