import { attendeeTagsSchema, tagSchema, tagsSchema } from "@/schemas/tags";
import { z } from "zod";

export type TTag = z.infer<typeof tagSchema>;

export type TTags = z.infer<typeof tagsSchema>;

export type TAttendeeTags = z.infer<typeof attendeeTagsSchema>;
