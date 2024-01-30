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
  jobTitle: z.string().optional(),
  organization: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z
    .string()
    .length(10, { message: "phone number must be 10 digits" }),
  whatsappNumber: z
    .string()
    .length(10, { message: "whatsapp number must be 10 digits" }),
  bio: z.string().optional(),
  x: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  certificate: z.boolean(),
  profilePicture: z.string().optional(),
  attendeeType: z.array(z.string()).nullable(),
  eventId: z.string(),
  checkin: z.array(checkinSchema).optional(),
  badge: z.string().optional(),
  ticketType: z.string().optional(),
  eventRegistrationRef: z.string().optional(),
  userId: z.number().optional(),
});

export const attendeeNoteSchema = z.object({
  id: z.number().optional(),
  attendeeId: z.number(),
  userId: z.number(),
  created_at: z.string().optional(),
  eventId: z.string(),
  attendeeEmail: z.string().email(),
  notes: z.string(),
});
