import { z } from "zod";

export const tagSchema = z.object({
  label: z.string(),
  color: z.string(),
  value: z.string(),
});

export const tagsSchema = z.object({
  id: z.bigint().optional(),
  created_at: z.date().optional(),
  email: z.string(),
  tags: z.array(tagSchema).nullable(),
});
