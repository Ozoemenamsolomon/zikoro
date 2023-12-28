import {
  AttendeeSchema,
  attendeeNoteSchema,
  attendeeTagsSchema,
} from "@/schemas/attendee";
import { z } from "zod";

export type TAttendee = z.infer<typeof AttendeeSchema> & { [key: string]: any };

export type TAttendeeNote = z.infer<typeof attendeeNoteSchema>;

export type TAttendeeTags = z.infer<typeof attendeeTagsSchema>;

export type TAttendeeType = {
  label: string;
  value: string;
};
