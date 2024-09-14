import { z } from "zod";

export const formQuestion = z.object({
    question: z.string().min(3, { message: "Question is required" }),
    questionImage: z.any(),
    selectedType: z.string(),
    optionFields: z.any(),
    isRequired: z.boolean(),
    questionId: z.string(),
})

export const formQuestionSchema = z.object({
    questions: z.array(formQuestion),
    title: z.string().min(3, { message: "Title is required" }),
    description: z.string().min(3, { message: "Description is required" }),
    coverImage: z.any(),
    
    
    
});