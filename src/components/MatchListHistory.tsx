import { useMatch } from "../contexts/MatchContext";
import { CalendarClock, Users, Trophy, Clock } from "lucide-react";
import { format } from "date-fns";
import { getGameDuration } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { AccordionHeader } from "@radix-ui/react-accordion";

const MatchListHistory = () => {
  const { history, isLoading } = useMatch();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando partidas...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Nenhum histórico de partidas ainda.
        </p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="space-y-4">		
      {history.map((match) => (
        <AccordionItem
          key={match.id}
          value={match.id}
          className={`game-card`}
        >
            <AccordionHeader>
                <AccordionTrigger className="flex flex-col w-full items-start" style={{textDecoration: "none"}}>
                    <div className="flex justify-between items-start mb-3 w-full">
                        <h3 className="font-game neon-text text-white text-lg">
                            {match.title}
                        </h3>

                        <div className="bg-neon-purple/30 text-white text-xs px-2 py-1 rounded-full">
                            Concluída
                        </div>
                    </div>

                    <div className="flex items-start mb-3">
                        <h3 className="font-cyber text-white text-lg">
                        Jogaram {match.gameTitle}
                        </h3>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <CalendarClock size={14} className="mr-1" />
                        <span>{format(match.createdAt, "MMM d, yyyy 'às' h:mm a")}</span>
                    </div>

                    
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Clock size={14} className="mr-1" />
                        <span>
                            Duração da partida{" "}
                            {getGameDuration(match.createdAt, match.finishedAt)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center w-full players-and-wins">
                        <div className="flex items-center">
                            <Users size={16} className="mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                {match.players.length}{" "}
                                {match.players.length > 1 ? "jogadores" : "jogador"}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <Trophy size={16} className="mr-2 text-neon-green" />
                            {match.players.length > 0 ? (
                                <div className="flex items-center">
                                    <span className="text-white mr-2">
                                        {
                                            match.players.reduce((prev, current) =>
                                                prev.score > current.score ? prev : current
                                            ).name
                                        }
                                    </span>

                                    <span className="text-neon-green">
                                        (
                                            {
                                                match.players.reduce((prev, current) =>
                                                    prev.score > current.score ? prev : current
                                                ).score
                                            }
                                        )
                                    </span>
                                </div>
                            ) : (
                                <span className="text-muted-foreground">Nenhum vencedor</span>
                            )}
                        </div>
                    </div>
                </AccordionTrigger>
            </AccordionHeader>
                
			<AccordionContent>
                <div className="flex flex-col justify-between w-full">
                    <div className="flex items-center">
                        <Users size={16} className="mr-2 text-white" />
                        <span className="text-white">
                            {match.players.length > 1 ? "Jogadores" : "Jogador"}
                        </span>
                    </div>

                    {match.players.sort((playerA, playerB) => playerB.score - playerA.score).map((player, index) =>
                            <div key={player.id} className="flex items-center mt-3">
                                {index === 0 && <Trophy size={16} className="mr-2 text-neon-green" />}

                                {index > 0 && 
                                    <span className="mr-2 text-muted-foreground">
                                        {index + 1}
                                    </span>
                                }

                                <div className="flex items-center gap-2">
                                    <span className={index > 0 ? "text-muted-foreground" : "text-white"}>
                                        {player.name}
                                    </span>

                                    <span className={index > 0 ? "text-muted-foreground" : "text-neon-green"}>
                                        ({player.score})
                                    </span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default MatchListHistory;
