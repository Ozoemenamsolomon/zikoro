import { z } from "zod";

export const checkinSchema = z.object({
  date: z.string(),
  checkin: z.boolean(),
});

export const AttendeeSchema = z.object({
  id: z.number().optional(),
  registrationDate: z.string(),
  userEmail: z.string().email(),
  firstName: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  email: z.string().email(),
  jobTitle: z.string().nullable().optional(),
  organization: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  phoneNumber: z
    .string()
    .length(10, { message: "phone number must be 10 digits" }),
  whatsappNumber: z
    .string()
    .length(10, { message: "whatsapp number must be 10 digits" }),
  bio: z.string().nullable().optional(),
  x: z.string().nullable().optional(),
  linkedin: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  certificate: z.boolean(),
  profilePicture: z.string().nullable().optional(),
  attendeeType: z.array(z.string()).nullable(),
  eventId: z.number(),
  checkin: z.array(checkinSchema).nullable().optional(),
  badge: z.string().nullable().optional(),
  userId: z.number().nullable().optional(),
});

export const attendeeNoteSchema = z.object({
  id: z.number().optional(),
  attendeeId: z.number(),
  userId: z.number(),
  created_at: z.string().nullable().optional(),
  eventId: z.string(),
  attendeeEmail: z.string().email(),
  notes: z.string(),
});
