import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, database } from "../lib/firebase";
import { get, onValue, ref, set } from "firebase/database";

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface Invitation {
  id: string;
  matchId: string;
  matchTitle: string;
  sentAt: Date | string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  invitations: Invitation[];
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      if (user) {
        const data = await get(ref(database, "players/" + user.uid));

        if (data.exists()) return;

        await set(ref(database, "players/" + user.uid), {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setInvitations([]);
      return;
    }

    const invitationsRef = ref(
      database,
      "invitations_sent/" + currentUser.uid + "/invitations/"
    );

    const unsubscribe = onValue(invitationsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const dataInvitations = Object.entries<Invitation>(data).map(
          ([id, value]) => ({
            id,
            matchId: value.matchId,
            matchTitle: value.matchTitle,
            sentAt: value.sentAt,
          })
        );

        setInvitations(dataInvitations);
      } else {
        setInvitations([]);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const value = {
    invitations,
    currentUser,
    loading,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
