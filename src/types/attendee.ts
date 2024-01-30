import { AttendeeSchema, attendeeNoteSchema, checkinSchema } from "@/schemas/attendee";
import { z } from "zod";

export type TCheckin = z.infer<typeof checkinSchema>;

export type TAttendee = z.infer<typeof AttendeeSchema>;

export type TAttendeeNote = z.infer<typeof attendeeNoteSchema>;

export type TAttendeeType = {
  label: string;
  value: string;
};
