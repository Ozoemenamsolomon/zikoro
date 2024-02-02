import {
  AttendeeSchema,
  attendeeNoteSchema,
  checkinSchema,
} from "@/schemas/attendee";
import { z } from "zod";

export type TCheckin = z.infer<typeof checkinSchema>;

export type TAttendee = z.infer<typeof AttendeeSchema> & {
  [key: string]: any;
  id?: number;
  eventRegistrationRef?: string;
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
  id?: bigint;
  created_at?: string;
  eventId: number;
  eventName: string;
  Message?: string | null;
  InviteDetails: TInviteDetails[];
};