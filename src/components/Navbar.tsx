import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginButton from "./LoginButton";
import { Button } from "@/components/ui/button";
import { GamepadIcon, HistoryIcon, HomeIcon, MailIcon, Menu, UsersIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const { currentUser, invitations } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isOpenMenu) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpenMenu])

  return (
    <nav className={`flex justify-between items-center pb-4 mb-8`}>
      <div className="flex items-center">
        <h1 className="lg:text-xl xl:text-2xl  font-game neon-text mr-8">DARKSCORE</h1>

        <div className="hidden xl:flex space-x-4">
          {!currentUser && <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className={`flex items-center gap-2 font-cyber ${location.pathname === "/" ? "text-white" : "text-muted-foreground hover:text-white"}`}
          >
            <HomeIcon size={16} />
            <span>Home</span>
          </Button>}

          {currentUser && (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className={`flex items-center gap-2 font-cyber ${location.pathname.includes("dashboard") || location.pathname.includes("match") ? "text-white" : "text-muted-foreground hover:text-white"}`}
              >
                <GamepadIcon size={16} />
                <span>Partidas</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/history")}
                className={`flex items-center gap-2 font-cyber ${location.pathname.includes("history") ? "text-white" : "text-muted-foreground hover:text-white"}`}
              >
                <HistoryIcon size={16} />
                <span>Histórico</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/friends")}
                className={`flex items-center gap-2 font-cyber ${location.pathname.includes("friends") ? "text-white" : "text-muted-foreground hover:text-white"}`}
              >
                <UsersIcon size={16} />
                <span>Amigos</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/invitations")}
                className={`flex items-center gap-2 font-cyber ${location.pathname.includes("invitations") ? "text-white" : "text-muted-foreground hover:text-white"}`}
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
          <div className="flex items-center mr-0 xl:mr-4">
            <img
              src={currentUser.photoURL || ""}
              alt={currentUser.displayName || "User"}
              className="w-8 h-8 max-w-8 rounded-full mr-2 border border-neon-purple/50"
            />
            <span className="hidden xl:block text-sm font-cyber">
              {currentUser.displayName}
            </span>
          </div>
        )}

        <div className="hidden xl:block">
          <LoginButton />
        </div>
      
        <div className="flex xl:hidden">
          <Menu size={26} onClick={() => setIsOpenMenu(true)} className="cursor-pointer" />
        </div>
      </div>


      {isOpenMenu &&
        <div className="bg-background absolute h-screen w-screen z-10 top-0 left-0 p-4 flex flex-col items-center">
          <X size={26} onClick={() => setIsOpenMenu(false)} className="cursor-pointer self-end" />

          <div className="flex flex-col gap-4">
            {!currentUser && 
              <div
                onClick={() => {
                  setIsOpenMenu(false);
                  navigate("/");
                }}
                className={`flex items-center gap-2 font-cyber text-xl ${location.pathname === "/" ? "text-white" : "text-muted-foreground hover:text-white"}`}
              >
                <HomeIcon size={26} />
                <span>Home</span>
              </div>
            }

            {currentUser && (
              <>
                <div
                  onClick={() => {
                    setIsOpenMenu(false);
                    navigate("/dashboard");
                  }}
                  className={`flex items-center gap-2 font-cyber text-xl ${location.pathname.includes("dashboard") || location.pathname.includes("match") ? "text-white" : "text-muted-foreground hover:text-white"}`}
                >
                  <GamepadIcon size={26} />
                  <span>Partidas</span>
                </div>

                <div
                  onClick={() => {
                    setIsOpenMenu(false);
                    navigate("/history");
                  }}
                  className={`flex items-center gap-2 font-cyber text-xl ${location.pathname.includes("history") ? "text-white" : "text-muted-foreground hover:text-white"}`}
                >
                  <HistoryIcon size={26} />
                  <span>Histórico</span>
                </div>

                <div
                  onClick={() => {
                    setIsOpenMenu(false);
                    navigate("/friends");
                  }}
                  className={`flex items-center gap-2 font-cyber text-xl ${location.pathname.includes("friends") ? "text-white" : "text-muted-foreground hover:text-white"}`}
                >
                  <UsersIcon size={26} />
                  <span>Amigos</span>
                </div>

                <div
                  onClick={() => {
                    setIsOpenMenu(false);
                    navigate("/invitations")
                  }}
                  className={`flex items-center gap-2 font-cyber text-xl ${location.pathname.includes("invitations") ? "text-white" : "text-muted-foreground hover:text-white"}`}
                >
                  {invitations.length > 0 && (
                    <span className="flex rounded-full bg-red-500 text-white w-6 h-6 items-center justify-center">
                      {invitations.length}
                    </span>
                  )}
                  <MailIcon size={26} />
                  <span>Convites</span>
                </div>
              </>
            )}
          </div>
        </div>
      }
    </nav>
  );
};

export default Navbar;
