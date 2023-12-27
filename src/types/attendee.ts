import { AttendeeSchema, noteSchema } from "@/schemas/attendee";
import { z } from "zod";

export type TAttendee = z.infer<typeof AttendeeSchema>;

export type TNote = z.infer<typeof noteSchema>;
