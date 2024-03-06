import { z } from "zod";

export const UserSchema = z.object({
  id: z.bigint(),
  created_at: z.string(), // You can define a more specific date format if needed
  userEmail: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  jobTitle: z.string(),
  organization: z.string(),
  city: z.string(),
  country: z.string(),
  phoneNumber: z.string(),
  whatsappNumber: z.string(),
  profilePicture: z.string(),
  bio: z.string(),
  x: z.string(),
  linkedin: z.string(),
  instagram: z.string(),
  facebook: z.string(),
  userId: z.string(),
});
