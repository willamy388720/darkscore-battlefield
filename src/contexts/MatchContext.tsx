
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { addDoc, collection, doc, updateDoc, arrayUnion, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

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
  createdAt: Timestamp;
  players: Player[];
  active: boolean;
}

interface MatchContextType {
  currentMatch: Match | null;
  matches: Match[];
  history: Match[];
  createMatch: (title: string) => Promise<string>;
  invitePlayer: (matchId: string, playerId: string, playerName: string, playerPhoto: string) => Promise<void>;
  increaseScore: (matchId: string, playerId: string) => Promise<void>;
  resetScores: (matchId: string) => Promise<void>;
  endMatch: (matchId: string) => Promise<void>;
  deleteMatch: (matchId: string) => Promise<void>;
  setCurrentMatch: (match: Match | null) => void;
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

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [history, setHistory] = useState<Match[]>([]);
  const { currentUser } = useAuth();

  const createMatch = async (title: string): Promise<string> => {
    if (!currentUser) throw new Error("User must be logged in to create a match");
    
    const newMatch = {
      title,
      createdBy: currentUser.uid,
      createdAt: Timestamp.now(),
      players: [{
        id: currentUser.uid,
        name: currentUser.displayName || "Unknown",
        photoURL: currentUser.photoURL || "",
        score: 0
      }],
      active: true
    };
    
    const docRef = await addDoc(collection(db, "matches"), newMatch);
    
    // Update local state
    const matchWithId = { ...newMatch, id: docRef.id } as Match;
    setMatches([...matches, matchWithId]);
    setCurrentMatch(matchWithId);
    
    return docRef.id;
  };

  const invitePlayer = async (matchId: string, playerId: string, playerName: string, playerPhoto: string) => {
    const newPlayer = {
      id: playerId,
      name: playerName,
      photoURL: playerPhoto,
      score: 0
    };
    
    const matchRef = doc(db, "matches", matchId);
    await updateDoc(matchRef, {
      players: arrayUnion(newPlayer)
    });
    
    // Update local state
    const updatedMatches = matches.map(match => {
      if (match.id === matchId) {
        return {
          ...match,
          players: [...match.players, newPlayer]
        };
      }
      return match;
    });
    
    setMatches(updatedMatches);
    
    if (currentMatch?.id === matchId) {
      setCurrentMatch({
        ...currentMatch,
        players: [...currentMatch.players, newPlayer]
      });
    }
  };

  const increaseScore = async (matchId: string, playerId: string) => {
    const matchRef = doc(db, "matches", matchId);
    const match = matches.find(m => m.id === matchId);
    
    if (!match) return;
    
    const updatedPlayers = match.players.map(player => {
      if (player.id === playerId) {
        return { ...player, score: player.score + 1 };
      }
      return player;
    });
    
    await updateDoc(matchRef, {
      players: updatedPlayers
    });
    
    // Update local state
    const updatedMatches = matches.map(m => {
      if (m.id === matchId) {
        return { ...m, players: updatedPlayers };
      }
      return m;
    });
    
    setMatches(updatedMatches);
    
    if (currentMatch?.id === matchId) {
      setCurrentMatch({
        ...currentMatch,
        players: updatedPlayers
      });
    }
  };

  const resetScores = async (matchId: string) => {
    const matchRef = doc(db, "matches", matchId);
    const match = matches.find(m => m.id === matchId);
    
    if (!match) return;
    
    const updatedPlayers = match.players.map(player => ({
      ...player,
      score: 0
    }));
    
    await updateDoc(matchRef, {
      players: updatedPlayers
    });
    
    // Update local state
    const updatedMatches = matches.map(m => {
      if (m.id === matchId) {
        return { ...m, players: updatedPlayers };
      }
      return m;
    });
    
    setMatches(updatedMatches);
    
    if (currentMatch?.id === matchId) {
      setCurrentMatch({
        ...currentMatch,
        players: updatedPlayers
      });
    }
  };

  const endMatch = async (matchId: string) => {
    const matchRef = doc(db, "matches", matchId);
    
    await updateDoc(matchRef, {
      active: false
    });
    
    // Update local state
    const matchToEnd = matches.find(m => m.id === matchId);
    
    if (matchToEnd) {
      // Move to history
      const endedMatch = { ...matchToEnd, active: false };
      setHistory([endedMatch, ...history]);
      
      // Remove from active matches
      const updatedMatches = matches.filter(m => m.id !== matchId);
      setMatches(updatedMatches);
      
      if (currentMatch?.id === matchId) {
        setCurrentMatch(null);
      }
    }
  };

  const deleteMatch = async (matchId: string) => {
    const matchRef = doc(db, "matches", matchId);
    await deleteDoc(matchRef);
    
    // Update local state
    const updatedMatches = matches.filter(m => m.id !== matchId);
    setMatches(updatedMatches);
    
    if (currentMatch?.id === matchId) {
      setCurrentMatch(null);
    }
  };

  const value = {
    currentMatch,
    matches,
    history,
    createMatch,
    invitePlayer,
    increaseScore,
    resetScores,
    endMatch,
    deleteMatch,
    setCurrentMatch,
    setMatches,
    setHistory
  };

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
};
