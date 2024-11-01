import { TAttendee } from "./attendee";

export interface Contact {
  id: number;
  created_at: Date;
  userEmail: string;
  contactUserEmail: string;
  contactRequestId: number;
}

export interface ContactRequest {
  id: number;
  created_at: Date;
  senderUserEmail: string;
  receiverUserEmail: string;
  status: "pending" | "accepted" | "rejected";
  sender: TAttendee;
  eventAlias: string;
}
