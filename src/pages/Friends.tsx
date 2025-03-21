import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Friend, Invitation, useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { GamepadIcon, User, UserPlus, UserXIcon } from "lucide-react";
import { Match, useMatch } from "@/contexts/MatchContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { onValue, ref } from "firebase/database";
import { database } from "@/lib/firebase";

const Friends = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allInvitations, setallInvitations] = useState<Invitation[]>([]);
  const [isInvitationConfrontation, setInvitationConfrontation] = useState(false)
  const [currentFriend, setCurrentFriend] = useState<Friend | null>(null)


  const { currentUser, loading, friends, inviteFriend, removeFriend } = useAuth();
  const { matches, invitePlayer, history } = useMatch();
  const { toast } = useToast();

  const navigate = useNavigate();

  const matchesWithoutTheFriend = currentFriend ? matches.filter(match => match.active && !match.players.some(player => player.id === currentFriend.uid)) : []

  function getStatisticsOfTheConfrontation(friend: Friend) {
    let confrontations: Match[] = []
    let myVictories = 0
    let friendVictories = 0

    confrontations = history.filter(match => 
      match.players.some(player => player.id === currentUser.uid) && match.players.some(player => player.id === friend.uid)
    )

    confrontations.forEach(confrontation => {
      let topScore = {id: "", score: -Infinity}

      confrontation.players.forEach(player => {
        if (player.score > topScore.score) {
          topScore.id = player.id
          topScore.score = player.score
        }
      })

      if(topScore.score !== 0)
        if (topScore.id === currentUser.uid) {
          myVictories++
        } else if (topScore.id === friend.uid) {
          friendVictories++
        }
      }
    )

    return (<>
        <span className="text-sm font-cyber ">
          🎮 Confrontos <span className="text-neon-purple text-base">({confrontations.length})</span>
        </span>

        <span className="text-sm font-cyber ">
          🏆 Minhas Vitórias <span className="text-neon-green text-base">({myVictories})</span>
        </span>

        <span className="text-sm font-cyber ">
          💀 Vitórias do {friend.displayName} <span className="text-base">({friendVictories})</span>
        </span>
    </>)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Erro",
        description: "E-mail é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      await inviteFriend(email);

      toast({
        title: "Sucesso",
        description: "Amigo convidado com sucesso!",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Falha ao convidar jogador. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function handleInviteMatch(matchId: string) {
    if(!currentFriend) return;

    try {
      setIsLoading(true);

      await invitePlayer(matchId, currentFriend.email);

      toast({
        title: "Sucesso",
        description: "Amigo convidado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Falha ao convidar jogador. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemoveFriend(friendId: string) {
    try {
      setIsLoading(true);

      await removeFriend(friendId);

      toast({
        title: "Sucesso",
        description: "Amigo removido sucesso!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Falha ao remover. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function alreadyBeenInvited(matchId: string) {
    const matchesFilteredByInvitation = matchesWithoutTheFriend.filter(match => allInvitations.some(invitation => invitation.matchId === match.id));

    const playerAlreadyInvited = matchesFilteredByInvitation.find(match => match.id === matchId)

    return playerAlreadyInvited ? (
      <div className="bg-neon-purple/30 text-white text-xs px-2 py-1 rounded-full">
        Convidado
      </div>
    ) : 
    (
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleInviteMatch(matchId)
        }}
        className="game-button flex items-center gap-2"
      >
        <UserPlus size={16} />
        <span>{isLoading ? "Convidando..." : "Convidar"}</span>
      </Button>
    )
  }

  useEffect(() => {
    if (!currentUser || !currentFriend) {
      setallInvitations([]);
      return;
    }

    const invitationsRef = ref(
          database,
          "invitations_sent/" + currentFriend.uid + "/invitations/"
        );

    const unsubscribe = onValue(invitationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const dataFormatted = Object.entries<Invitation>(snapshot.val() ?? {}).map(
          ([id, value]) => ({
            id,
            matchId: value.matchId,
            matchTitle: value.matchTitle,
            gameTitle: value.gameTitle,
            invitedBy: value.invitedBy,
            sentAt: value.sentAt,
            type: value.type,
          })
        );

        setallInvitations(dataFormatted);
      } else {
        setallInvitations([]);
      }
    });

    return () => {
      unsubscribe();
    }
    
}, [currentUser, currentFriend]);

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
    <Dialog>
      <DialogPortal>
        <DialogOverlay />
        
        <DialogContent>
          <DialogTitle>Convidar {isInvitationConfrontation ? "Para Partida" : "Jogador"}</DialogTitle>
          
          {!isInvitationConfrontation && 
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2 mt-4">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite o e-mail do jogador..."
                  className="bg-background/50 border-neon-purple/30 text-white flex-1"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="game-button flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  <span>{isLoading ? "Convidando..." : "Convidar"}</span>
                </Button>
              </div>
            </form>
          }

          {isInvitationConfrontation && matchesWithoutTheFriend.map(match => (
            <div key={match.id} className="game-card flex gap-2 mt-4 items-center justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-cyber text-white">
                    Convidar para {match.title}
                </h2>

                <h2 className="text-sm font-cyber text-muted-foreground">
                  Jogando {match.gameTitle}.
                </h2>
              </div>

              {alreadyBeenInvited(match.id)}
            </div>
          ))
          }

          {isInvitationConfrontation && matchesWithoutTheFriend.length === 0 &&
            <h2 className="text-lg font-cyber text-muted-foreground">
              Vocês já estão na mesma partida ou ainda não há nenhuma ativa.
            </h2>
          }
        </DialogContent>
      </DialogPortal>

      <div className="min-h-screen ">
        <div className="container mx-auto px-4">
          <Navbar />

          <div className="game-card">
            <h2 className="text-2xl font-cyber mb-6 text-white">
              Seus Amigos
            </h2>
            <p className="text-muted-foreground mb-6">
              Conecte-se com seus amigos e veja quem realmente é o melhor! 🤝🔥 Desafie, jogue e mostre sua superioridade!"
            </p>

            {friends.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-3">Nenhum amigo encontrado. Convide-os aqui.</p>
                <DialogTrigger onClick={() => setInvitationConfrontation(false)}>
                  <Button
                    type="button"
                    disabled={isLoading}
                    className="game-button flex items-center gap-2 mb-2 w-full"
                  >
                    <User size={16} />
                    <span>Convidar amigo</span>
                  </Button>
                </DialogTrigger>
              </div>
            )}


            {friends.length > 0 && (
              <>
                <DialogTrigger className="mb-3" onClick={() => setInvitationConfrontation(false)}>
                  <Button
                    type="button"
                    disabled={isLoading}
                    className="game-button flex items-center gap-2 mb-2 w-full"
                  >
                    <User size={16} />
                    <span>Convidar amigo</span>
                  </Button>
                </DialogTrigger>

                <div className="space-y-4">
                  {friends.map((friend) => (
                    <div
                      key={friend.uid}
                      className={"game-card flex flex-col"}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <img
                            src={friend.photoURL || ""}
                            alt={friend.displayName || "User"}
                            className="w-8 h-8 rounded-full mr-2 border border-neon-purple/50"
                          />
                          <span className="text-lg font-cyber">
                            {friend.displayName} 
                          </span>
                        </div>

                        <div className="flex gap-3">
                          <DialogTrigger onClick={() => {
                            setInvitationConfrontation(true)
                            setCurrentFriend(friend)
                          }}>
                            <Button
                              className="text-sm bg-neon-green/100 hover:bg-neon-green/90"
                            >
                              <GamepadIcon size={16}/>Desafiar para um confronto
                            </Button>               
                          </DialogTrigger>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFriend(friend.uid)
                            }}
                            className=" text-sm bg-destructive/100 hover:bg-destructive/90"
                            >
                            <UserXIcon size={16}/>Desfazer a amizade
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-3">
                        <span className="text-lg font-cyber">
                          Histórico de Confrontos
                        </span>

                        {getStatisticsOfTheConfrontation(friend)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Friends;
