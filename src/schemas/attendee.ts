import { z } from "zod";

export const AttendeeSchema = z.object({
    registrationDate: z.string(),
    userEmail: z.string().refine((email) => /\S+@\S+\.\S+/.test(email), {
      message: "Invalid email address",
    }),
    firstName: z.string().min(2, {
      message: "email must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "email must be at least 2 characters.",
    }),
    email: z.string().refine((email) => /\S+@\S+\.\S+/.test(email), {
      message: "Invalid email address",
    }),
    jobTitle: z.string().optional(),
    organization: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    phoneNumber: z.string().optional(),
    whatsappNumber: z.string().optional(),
    bio: z.string().optional(),
    x: z.string().optional(),
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    certificate: z.boolean(),
    profilePicture: z.string().optional(),
    attendeeType: z.array(z.string()),
    eventId: z.string()
  });