import {
  AttendeeSchema,
  attendeeNoteSchema,
  checkinSchema,
} from "@/schemas/attendee";
import { z } from "zod";

export type TCheckin = z.infer<typeof checkinSchema>;

export type TAttendee = z.infer<typeof AttendeeSchema> & {
  [key: string]: any;
  id: number;
};

export type TAttendeeNote = z.infer<typeof attendeeNoteSchema>;

export type TAttendeeType = {
  label: string;
  value: string;
};

export type TInviteDetails = {
  email: string
  attendeeType: string
}

export type AttendeeEmailInvites {
  id: bigint;
  created_at: string;
  eventId?: bigint | null;
  eventName?: number | null;
  Message?: string | null;
  InviteDetails: TInviteDetails[];
}
