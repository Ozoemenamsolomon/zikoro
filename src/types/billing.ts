import { TAttendee } from "./attendee";

export type TEventTransaction = {
  id: number;
  created_at: string;
  expiredAt: string;
  eventRegistrationRef: string;
  eventId: number;
  event: string;
  eventDate: string;
  userId: number;
  userEmail: number;
  eventPrice: number;
  paymentDate: string;
  referralSource: string;
  discountCode: string;
  discountValue: number;
  affliateEmail: string;
  affliateCode: string;
  amountPaid: number;
  registrationCompleted: boolean;
  attendees: number;
  attendeesDetails: Partial<TAttendee>[];
  payOutStatus: string;
  payOutDate: string;
  currency: string;
  ticketCategory: string;
  affliateCommission: number;
  processingFee: number;
  payOutRequestDate: string | null;
  payOutRequestedBy: string | null;
};

export interface IPayOut {
  id?: number;
  created_at?: Date;
  payOutRef: string;
  payOutStatus: string;
  Amount: number;
  paidAt?: Date | null;
  requestedBy: string;
}
