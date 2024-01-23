
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
  discountcode: string;
  discountValue: number;
  affliateEmail: string;
  afliateCode: string;
  amountPaid: number;
  registrationCompleted: boolean;
  attendees: number;
  attendeesDetails: Partial<TAttendee>[];
  PayOutStatus: string;
  payOutDate: string;
  currency: string;
  ticketCategory: string;
};
