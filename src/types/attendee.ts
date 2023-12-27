import { AttendeeSchema } from "@/schemas/attendee";
import { z } from "zod";

export type TAttendee = z.infer<typeof AttendeeSchema>;
