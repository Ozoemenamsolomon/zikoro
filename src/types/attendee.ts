import {
  AttendeeSchema,
  attendeeNoteSchema,
  checkinSchema,
} from "@/schemas/attendee";
import { z } from "zod";
import { TAgenda } from "./agenda";

export type TCheckin = z.infer<typeof checkinSchema>;

export type TCompletedFields = Array<keyof z.infer<typeof AttendeeSchema>>;

export type TAttendee = z.infer<typeof AttendeeSchema> & {
  id?: number;
  eventRegistrationRef?: string;
  ticketType: string;
  paymentLink?: string;
  badge?: string;
  eventAlias: string;
  registrationCompleted: boolean;
  userId?: number;
  registrationDate: Date | string;
  userEmail: string;
  eventId: string;
  favourite: boolean;
  tags: string[];
  checkin?: { date: Date; checkin: boolean }[];
  inviteSource: string | null;
  attendeeAlias: string;
  checkInPoints: number;
  attendeeProfilePoints: number;
  completedFields: TCompletedFields;
  speakingAt: { session: TAgenda; sessionLink: string }[];
  moderatingAt: { session: TAgenda; sessionLink: string }[];
  archive: boolean;
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

export type TAttendeeInvites = {
  id?: number;
  created_at?: string;
  eventAlias: string;
  name: string;
  email: string;
  trackingId: string;
  role: string;
  response: "pending" | "attending" | "not attending";
  method: string;
  Message: string;
  lastResendAt?: Date;
  responseDate?: Date;
  guests?: TAttendee[];
};
