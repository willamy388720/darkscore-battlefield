import { Friend } from "@/contexts/AuthContext";

export type PlayerWithInvitations = Friend & {
    invitation: boolean;
}