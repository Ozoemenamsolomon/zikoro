import * as z from "zod";

export const quizSettingSchema = z.object({
  description: z.string().min(3, { message: "Description is required" }),
  coverTitle: z.string().min(3, { message: "Title is required" }),
  coverImage: z.any(),
  
});

const optionsSchema =  z.array(
  z.object({
    optionId: z.string(),
    option: z.string().min(3, { message: "Option is required" }),
    isAnswer: z.string(),
   
  })
);

export const quizQuestionSchema = z.object({
  question: z.string().min(3, {message:" Question is required"}),
  questionImage: z.any(),
  duration: z.string().min(1, {message: "Duration is required"}),
  points: z.string().min(1, {message: "Points is required"}),
  feedBack: z.any(),
  options: optionsSchema

})

