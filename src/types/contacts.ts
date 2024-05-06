interface Contact {
  id: number;
  created_at: Date;
  userEmail: string;
  contactUserEmail: string;
}

interface ContactRequest {
  id: bigint;
  created_at: Date;
  senderUserEmail: string;
  receiverUserEmail: string;
  status: "pending" | "accepted" | "rejected";
}
