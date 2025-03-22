import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth, User } from "./AuthContext";
import { database } from "../lib/firebase";
import { get, onValue, ref, remove, set, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

export interface Player {
  id: string;
  name: string;
  photoURL: string;
  score: number;
}

export interface Match {
  id: string;
  title: string;
  createdBy: string;
  createdAt: Date | string;
  finishedAt: Date | string;
  players: Player[];
  active: boolean;
  gameTitle: string;
}

interface MatchContextType {
  isLoading: boolean;
  currentMatch: Match | null;
  matches: Match[];
  history: Match[];
  createMatch: (title: string, gameTitle: string) => Promise<string>;
  invitePlayer: (matchId: string, playerEmail: string) => Promise<void>;
  removePlayer: (matchId: string, playerId: string) => Promise<void>;
  acceptInvitation: (matchId: string, invitationId: string) => Promise<void>;
  increaseScore: (matchId: string, playerId: string) => Promise<void>;
  decreaseScore: (matchId: string, playerId: string) => Promise<void>;
  resetScores: (matchId: string) => Promise<void>;
  endMatch: (matchId: string) => Promise<void>;
  deleteMatch: (matchId: string) => Promise<void>;
  setCurrentMatch: (match: Match | null) => void;
  removeInvitation: (matchId: string) => Promise<void>;
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  setHistory: React.Dispatch<React.SetStateAction<Match[]>>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error("useMatch must be used within a MatchProvider");
  }
  return context;
};

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [history, setHistory] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { currentUser } = useAuth();

  const createMatch = async (
    title: string,
    gameTitle: string
  ): Promise<string> => {
    if (!currentUser)
      throw new Error("User must be logged in to create a match");

    const newMatch = {
      title,
      createdBy: currentUser.uid,
      createdAt: new Date().toISOString(),
      finishedAt: "",
      gameTitle,
      players: [
        {
          id: currentUser.uid,
          name: currentUser.displayName || "Unknown",
          photoURL: currentUser.photoURL || "",
          score: 0,
        },
      ],
      active: true,
    };

    const matchId = uuidv4();
    await set(ref(database, "matches/" + matchId), newMatch);

    // Update local state
    const matchWithId = { ...newMatch, id: matchId } as Match;
    setMatches([...matches, matchWithId]);
    setCurrentMatch(matchWithId);

    return matchId;
  };

  const invitePlayer = async (matchId: string, playerEmail: string) => {
    if (!currentUser) return;

    const data = await get(ref(database, "players/"));

    if (!data.exists()) return;

    const players = Object.entries<User>(data.val() ?? {}).map(
      ([id, value]) => ({
        uid: id,
        displayName: value.displayName,
        email: value.email,
        photoURL: value.photoURL,
      })
    );

    const player = players.find((item) => item.email === playerEmail);

    if (!player) return;

    const invitationMatch = matches.find((item) => item.id === matchId);

    if (!invitationMatch) return;

    await set(
      ref(
        database,
        "invitations_sent/" + player.uid + "/invitations/" + uuidv4()
      ),
      {
        matchId,
        matchTitle: invitationMatch.title,
        invitedBy: currentUser,
        gameTitle: invitationMatch.gameTitle,
        sentAt: new Date().toISOString(),
        type: "Match"
      }
    );
  };

  const removePlayer = async (matchId: string, playerId: string) => {
    if (!currentUser) return;

    const invitationMatch = matches.find((item) => item.id === matchId);

    if (!invitationMatch) return;

    const updatedMatch: Match = {
      ...invitationMatch,
      players: invitationMatch.players.filter(item => item.id !== playerId)
    }

    await update(
      ref(
        database,
        "matches/" + matchId
      ),
      updatedMatch
    );

    setCurrentMatch(updatedMatch)
  };

  async function removeInvitation(invitationId: string) {
    if (!currentUser)
      throw new Error("User must be logged in to create a match");

    await remove(
      ref(
        database,
        "invitations_sent/" + currentUser.uid + "/invitations/" + invitationId
      )
    );
  }

  async function acceptInvitation(matchId: string, invitationId: string) {
    if (!currentUser)
      throw new Error("User must be logged in to create a match");

    const alreadyATheMatch = matches.find((item) => item.id === matchId);

    if (alreadyATheMatch) {
      await removeInvitation(invitationId);
      return;
    }

    const matchRef = ref(database, "matches/" + matchId);

    const match = await get(matchRef);

    if (!match.val()) return;

    const dataMatch: Match = {
      id: matchId,
      title: match.val().title,
      createdBy: match.val().createdBy,
      createdAt: match.val().createdAt,
      finishedAt: match.val().finishedAt,
      players: match.val().players,
      active: match.val().active,
      gameTitle: match.val().gameTitle,
    };

    const updatedPlayers = [
      ...dataMatch.players,
      {
        id: currentUser.uid,
        name: currentUser.displayName || "Unknown",
        photoURL: currentUser.photoURL || "",
        score: 0,
      },
    ];

    await update(matchRef, {
      players: updatedPlayers,
    });

    await removeInvitation(invitationId);
  }

  const increaseScore = async (matchId: string, playerId: string) => {
    const matchRef = ref(database, "matches/" + matchId);
    const match = matches.find((m) => m.id === matchId);

    if (!match) return;

    const updatedPlayers = match.players.map((player) => {
      if (player.id === playerId) {
        return { ...player, score: player.score + 1 };
      }
      return player;
    });

    await update(matchRef, {
      players: updatedPlayers,
    });

    // Update local state
    const updatedMatches = matches.map((m) => {
      if (m.id === matchId) {
        return { ...m, players: updatedPlayers };
      }
      return m;
    });

    setMatches(updatedMatches);

    if (currentMatch?.id === matchId) {
      setCurrentMatch({
        ...currentMatch,
        players: updatedPlayers,
      });
    }
  };

  const decreaseScore = async (matchId: string, playerId: string) => {
    const matchRef = ref(database, "matches/" + matchId);
    const match = matches.find((m) => m.id === matchId);

    if (!match) return;

    const updatedPlayers = match.players.map((player) => {
      if (player.id === playerId) {
        if(player.score === 0) return player

        return { ...player, score: player.score - 1 };
      }
    
      return player;
    });

    await update(matchRef, {
      players: updatedPlayers,
    });

    // Update local state
    const updatedMatches = matches.map((m) => {
      if (m.id === matchId) {
        return { ...m, players: updatedPlayers };
      }
      return m;
    });

    setMatches(updatedMatches);

    if (currentMatch?.id === matchId) {
      setCurrentMatch({
        ...currentMatch,
        players: updatedPlayers,
      });
    }
  };

  const resetScores = async (matchId: string) => {
    const matchRef = ref(database, "matches/" + matchId);
    const match = matches.find((m) => m.id === matchId);

    if (!match) return;

    const updatedPlayers = match.players.map((player) => ({
      ...player,
      score: 0,
    }));

    await update(matchRef, {
      players: updatedPlayers,
    });

    // Update local state
    const updatedMatches = matches.map((m) => {
      if (m.id === matchId) {
        return { ...m, players: updatedPlayers };
      }
      return m;
    });

    setMatches(updatedMatches);

    if (currentMatch?.id === matchId) {
      setCurrentMatch({
        ...currentMatch,
        players: updatedPlayers,
      });
    }
  };

  const endMatch = async (matchId: string) => {
    const matchRef = ref(database, "matches/" + matchId);

    const finishedAt = new Date().toISOString();

    await update(matchRef, {
      active: false,
      finishedAt,
    });

    // Update local state
    const matchToEnd = matches.find((m) => m.id === matchId);

    if (matchToEnd) {
      // Move to history
      const endedMatch = { ...matchToEnd, active: false, finishedAt };
      setHistory([endedMatch, ...history]);

      // Remove from active matches
      const updatedMatches = matches.filter((m) => m.id !== matchId);
      setMatches(updatedMatches);

      if (currentMatch?.id === matchId) {
        setCurrentMatch(null);
      }
    }
  };

  const deleteMatch = async (matchId: string) => {
    const matchRef = ref(database, "matches/" + matchId);
    await remove(matchRef);

    // Update local state
    const updatedMatches = matches.filter((m) => m.id !== matchId);
    setMatches(updatedMatches);

    if (currentMatch?.id === matchId) {
      setCurrentMatch(null);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setMatches([]);
      setHistory([]);
      return;
    }

    const matchesRef = ref(database, "matches/");

    const unsubscribe = onValue(matchesRef, (snapshot) => {
      if (snapshot.exists()) {
        const dataFormatted = Object.entries<Match>(snapshot.val() ?? {}).map(
          ([id, value]) => ({
            id,
            active: value.active,
            createdAt: value.createdAt,
            createdBy: value.createdBy,
            players: value.players,
            title: value.title,
            finishedAt: value.finishedAt,
            gameTitle: value.gameTitle,
          })
        );

        const matchesWithUser = dataFormatted.filter((match) =>
          match.players.some((player) => player.id === currentUser.uid)
        );

        const matchesActives = matchesWithUser.filter((item) => item.active);
        const matchesDisabled = matchesWithUser.filter((item) => !item.active);

        setHistory(matchesDisabled);

        setMatches(matchesActives);
      } else {
        setMatches([]);
        setHistory([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const value = {
    isLoading,
    currentMatch,
    matches,
    history,
    createMatch,
    invitePlayer,
    removePlayer,
    increaseScore,
    decreaseScore,
    resetScores,
    endMatch,
    deleteMatch,
    setCurrentMatch,
    setMatches,
    setHistory,
    acceptInvitation,
    removeInvitation
  };

  return (
    <MatchContext.Provider value={value}>{children}</MatchContext.Provider>
  );
};
