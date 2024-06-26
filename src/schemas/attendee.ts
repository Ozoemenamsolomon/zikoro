import { z } from "zod";

export const checkinSchema = z.object({
  date: z.string(),
  checkin: z.boolean(),
});

export const AttendeeSchema = z.object({
  firstName: z.string().min(2, {
    message: "first name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "last name must be at least 2 characters.",
  }),
  email: z.string().email(),
  jobTitle: z.string().optional().nullable(),
  organization: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  phoneNumber: z.string(),
  whatsappNumber: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  x: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  profilePicture: z.string().optional().nullable(),
  attendeeType: z.array(z.string()),
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
