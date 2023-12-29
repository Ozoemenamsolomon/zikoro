import { tagSchema, tagsSchema } from "@/schemas/tags";
import { z } from "zod";

export type Tags = z.infer<typeof tagSchema>;

export type TTags = z.infer<typeof tagsSchema>;
