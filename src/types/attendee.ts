import {
  AttendeeSchema,
  attendeeNoteSchema,
  checkinSchema,
} from "@/schemas/attendee";
import { z } from "zod";

export type TCheckin = z.infer<typeof checkinSchema>;

export type TAttendee = z.infer<typeof AttendeeSchema> & {
  id?: number;
  eventRegistrationRef?: string;
  ticketType: string;
  paymentLink?: string;
  checkin?: (typeof checkinSchema)[];
  badge?: string;
  eventAlias: string;
  registrationCompleted: boolean;
  userId?: number;
  registrationDate: Date | string;
  userEmail: string;
  eventId: string;
  favourite: boolean;
  tags: string[];
};

export type TAttendeeNote = z.infer<typeof attendeeNoteSchema>;

export type TAttendeeType = {
  label: string;
  value: string;
};

export type TInviteDetails = {
  email: string;
  attendeeType: string;
};

export type TAttendeeEmailInvites = {
  id?: number;
  created_at?: string;
  eventId: number;
  eventName: string;
  Message?: string | null;
  InviteDetails: TInviteDetails[];
};
