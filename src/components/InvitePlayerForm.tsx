
import { useState } from "react";
import { useMatch } from "../contexts/MatchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InvitePlayerFormProps {
  matchId: string;
}

const InvitePlayerForm = ({ matchId }: InvitePlayerFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { invitePlayer } = useMatch();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // In a real app, you would search for the user by email in your database
      // For this demo, we'll create a mock player with the email as ID and name
      const mockPlayerId = email;
      const mockPlayerName = email.split('@')[0];
      const mockPlayerPhoto = `https://ui-avatars.com/api/?name=${mockPlayerName}&background=8B5CF6&color=fff`;
      
      await invitePlayer(matchId, mockPlayerId, mockPlayerName, mockPlayerPhoto);
      
      toast({
        title: "Success",
        description: "Player invited successfully!",
      });
      setEmail("");
    } catch (error) {
      console.error("Error inviting player:", error);
      toast({
        title: "Error",
        description: "Failed to invite player. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 game-card">
      <h3 className="text-lg font-cyber mb-2 text-white">Invite Player</h3>
      <div className="flex gap-2">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter player email..."
          className="bg-background/50 border-neon-purple/30 text-white flex-1"
          required
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="game-button flex items-center gap-2"
        >
          <UserPlus size={16} />
          <span>{isLoading ? "Inviting..." : "Invite"}</span>
        </Button>
      </div>
    </form>
  );
};

export default InvitePlayerForm;
