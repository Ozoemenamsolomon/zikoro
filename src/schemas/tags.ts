import { z } from "zod";

export const tagSchema = z.object({
  label: z.string(),
  color: z.string(),
});

export const tagsSchema = z.object({
  id: z.number().optional(),
  created_at: z.date().optional(),
  userEmail: z.string(),
  tags: z.array(tagSchema),
  userId: z.number(),
});

export const attendeeTagsSchema = z.object({
  id: z.number().optional(),
  created_at: z.string().optional(),
  eventId: z.string(),
  userEmail: z.string().email(),
  attendeeEmail: z.string().email(),
  attendeeTags: z.array(tagSchema),
  attendeeId: z.number(),
  userId: z.number(),
});
