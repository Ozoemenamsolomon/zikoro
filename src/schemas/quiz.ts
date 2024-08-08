import * as z from "zod";

export const quizSettingSchema = z.object({
  description: z.any(),
  coverTitle: z.string().min(3, { message: "Title is required" }),
  coverImage: z.any(),
});

const optionsSchema = z.array(
  z.object({
    optionId: z.string(),
    option: z.string().min(3, { message: "Option is required" }),
    isAnswer: z.string(),
  })
);

export const quizQuestionSchema = z
  .object({
    question: z.string().min(3, { message: " Question is required" }),
    questionImage: z.any(),
    duration: z.string().optional(),
    points: z.string().optional(),
    feedBack: z.any(),
    options: optionsSchema,
    interactionType: z.string(),
  })
  .refine((data) => data.interactionType === "poll" || data.duration, {
    message: "Duration is required",
    path: ["duration"],
  })
  .refine((data) => data.interactionType === "poll" || data.points, {
    message: "Point is required'",
    path: ["points"],
  });

export const joinLiveQuizSchema = z.object({
  code: z.string().min(5, { message: "Code is required" }),
});

export const sendMailQuizSchema = z.object({
  email: z
    .string()
    .email({ message: "Email must be a valid email" })
    .min(1, { message: "Email is required" }),
});
