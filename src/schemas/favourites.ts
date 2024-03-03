import { z } from "zod";

export const favouriteContactSchema = z.object({
  id: z.number().nullable(),
  created_at: z.string(),
  eventId: z.string().nullable(),
  userEmail: z.string().nullable(),
  userId: z.number().nullable(),
});
