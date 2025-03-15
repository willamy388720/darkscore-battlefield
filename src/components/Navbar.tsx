import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginButton from "./LoginButton";
import { Button } from "@/components/ui/button";
import { GamepadIcon, HistoryIcon, HomeIcon, MailIcon } from "lucide-react";

const Navbar = () => {
  const { currentUser, invitations } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center py-4 mb-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-game neon-text mr-8">DARKSCORE</h1>

        <div className="flex space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-cyber text-muted-foreground hover:text-white"
          >
            <HomeIcon size={16} />
            <span>Home</span>
          </Button>

          {currentUser && (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 font-cyber text-muted-foreground hover:text-white"
              >
                <GamepadIcon size={16} />
                <span>Partidas</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/history")}
                className="flex items-center gap-2 font-cyber text-muted-foreground hover:text-white"
              >
                <HistoryIcon size={16} />
                <span>Histórico</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/invitations")}
                className="flex items-center gap-2 font-cyber text-muted-foreground hover:text-white"
              >
                {invitations.length > 0 && (
                  <span className="flex rounded-full bg-red-500 text-white w-6 h-6 items-center justify-center">
                    {invitations.length}
                  </span>
                )}
                <MailIcon size={16} />
                <span>Convites</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {currentUser && (
          <div className="flex items-center mr-4">
            <img
              src={currentUser.photoURL || ""}
              alt={currentUser.displayName || "User"}
              className="w-8 h-8 rounded-full mr-2 border border-neon-purple/50"
            />
            <span className="text-sm font-cyber">
              {currentUser.displayName}
            </span>
          </div>
        )}
        <LoginButton />
      </div>
    </nav>
  );
};

export default Navbar;
