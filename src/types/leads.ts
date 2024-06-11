import { TAttendee } from "./attendee";

export interface ILead extends TAttendee {
  boothStaffId: string;
  firstContactChannel: string;
  interests: string[];
  boothStampEmail: string;
  stampCard: string;
  attendeeId: string;
}
