import { z } from "zod";

export const AttendeeSchema = z.object({
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
  attendeeType: z.array(z.string()),
  eventId: z.string(),
});
