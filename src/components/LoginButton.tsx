import { useAuth } from "../contexts/AuthContext";
import { Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const LoginButton = () => {
  const { signInWithGoogle, currentUser, logout } = useAuth();

  return (
    <div>
      {currentUser ? (
        <Button variant="outline" onClick={logout} className="game-button">
          <LogOut size={16}/>
          <span>Sair</span>
        </Button>
      ) : (
        <Button
          onClick={signInWithGoogle}
          className="game-button flex items-center gap-2"
        >
          <Lock size={16} />
          <span>Entrar com o Google</span>
        </Button>
      )}
    </div>
  );
};

export default LoginButton;
