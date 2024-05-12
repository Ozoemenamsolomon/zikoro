import * as z from "zod";

export const quizSettingSchema = z.object({
  description: z.string().min(3, { message: "Description is required" }),
  coverTitle: z.string().min(3, { message: "Title is required" }),
  startDateTime: z.string(),
  coverImage: z.any(),
  
});
