import { TAttendee } from "./attendee";

export interface ILead extends TAttendee {
  boothStaffId: string;
  firstContactChannel: string;
  interests: string[];
  boothStampEmail: string;
  stampCard: string;
  attendeeId: string;
}

export interface TLead {
  id: number;
  eventId: number;
  createdAt: string;
  boothStaffId: number;
  firstName: string;
  lastName: string;
  attendeeEmail: string;
  jobTitle: string;
  organization: string | null;
  city: string | null;
  country: string | null;
  phoneNumber: string;
  whatsappNumber: string | null;
  profilePicture: string | null;
  bio: string | null;
  x: string | null;
  linkedin: string | null;
  instagram: string | null;
  facebook: string | null;
  ticketType: string;
  attendeeType: string[];
  attendeeAlias: string;
  attendeeId: number;
  firstContactChannel: { interestType: string; title: string; note: string };
  websiteUrl: string;
  eventAlias: string;
  interests: { interestType: string; title: string; note: string }[];
  boothStaffEmail: string;
  stampCard: boolean;
  eventPartnerId: string;
}
