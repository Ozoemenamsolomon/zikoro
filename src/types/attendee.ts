import { AttendeeSchema } from "@/schemas/attendee";

export type TAttendee = z.infer<typeof AttendeeSchema>;
