import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, database } from "../lib/firebase";
import { get, onValue, ref, remove, set, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  friends: string[];
}

export interface Invitation {
  id: string;
  matchId?: string;
  matchTitle?: string;
  gameTitle?: string;
  type: "Friend" | "Match";
  invitedBy: User;
  sentAt: Date | string;
}

export type Friend = Omit<User, "friends">

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  invitations: Invitation[];
  friends: Friend[];
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  inviteFriend: (playerEmail: string) => Promise<void>
  acceptFriendshipInvitation: (invitedBy: Friend, invitationId: string) => Promise<void>
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
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {

        const data = await get(ref(database, "players/" + user.uid));
        
        if(data.exists()) {
          setCurrentUser({
            uid: user.uid,
            displayName: data.val().displayName,
            email: data.val().email,
            photoURL: data.val().photoURL,
            friends: data.val().friends,
          });
        } else {
          setCurrentUser({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            friends: [],
          });
        }
        
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

  const inviteFriend = async (playerEmail: string) => {
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

    await set(
      ref(
        database,
        "invitations_sent/" + player.uid + "/invitations/" + uuidv4()
      ),
      {
        invitedBy: {...currentUser, friends: currentUser.friends ?? []},
        sentAt: new Date().toISOString(),
        type: "Friend"
      }
    );
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
  
    async function acceptFriendshipInvitation(invitedBy: Friend, invitationId: string) {
      if (!currentUser)
        throw new Error("User must be logged in to create a match");

      const alreadyFriends = friends.find((item) => item.uid === invitedBy.uid);
  
      if (alreadyFriends) {
        await removeInvitation(invitationId);
        return;
      }
  
      const friendSenderRef = ref(database, "players/" + invitedBy.uid);
      const friendSender = await get(friendSenderRef)

      if (!friendSender.exists()) throw new Error("Player does not exist");

      const friendsOfPlayerWhoSentInvitation = friendSender.val().friends
      const updatedFriendsOfPlayerWhoSentInvitation = friendsOfPlayerWhoSentInvitation ? [...friendsOfPlayerWhoSentInvitation, currentUser.uid] : [currentUser.uid]
    
      const updatedFriends = [...friends, invitedBy]
      
      const friendsIds = friends.map(item => item.uid)
      const updatedFriendsIds = [...friendsIds, invitedBy.uid]

      const currentPlayerRef = ref(database, "players/" + currentUser.uid);
  
      await update(currentPlayerRef, {
        friends: updatedFriendsIds,
      });

      setFriends(updatedFriends)
  
      await update(friendSenderRef, {
        friends: updatedFriendsOfPlayerWhoSentInvitation,
      });

      await removeInvitation(invitationId);
    }

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
            gameTitle: value.gameTitle,
            invitedBy: value.invitedBy,
            sentAt: value.sentAt,
            type: value.type,
          })
        );

        setInvitations(dataInvitations);
      } else {
        setInvitations([]);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setFriends([]);
      return;
    }

    if (!currentUser.friends) {
      setFriends([]);
      return;
    }

    currentUser.friends.map(async friend => {

      const friendRef = ref(
        database,
        "players/" + friend
      );

      const dataFriend = await get(friendRef)

      if(!dataFriend.exists()) return

      const friendData = dataFriend.val();
      setFriends(prevFriends => [...prevFriends, { uid: friend, displayName: friendData?.displayName, email: friendData?.email, photoURL: friendData?.photoURL }]);
    })
  }, [currentUser]);

  const value = {
    invitations,
    currentUser,
    loading,
    signInWithGoogle,
    logout,
    friends,
    inviteFriend,
    acceptFriendshipInvitation
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
