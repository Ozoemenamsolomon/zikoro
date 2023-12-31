import { z } from "zod";

export const tagSchema = z.object({
  label: z.string(),
  color: z.string(),
});

export const tagsSchema = z.object({
  id: z.number().optional(),
  created_at: z.date().optional(),
  email: z.string(),
  tags: z.array(tagSchema),
});

export const attendeeTagsSchema = z.object({
  id: z.number().optional(),
  created_at: z.string().optional(),
  eventId: z.string(),
  email: z.string().email(),
  contactAttendeeEmail: z.string().email(),
  contactAttendeeTags: z.array(tagSchema),
  attendeeId: z.number(),
  contactAttendeeId: z.number(),
});
