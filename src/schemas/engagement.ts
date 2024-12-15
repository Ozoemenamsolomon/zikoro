import { z } from "zod";

export const formQuestion = z.object({
    question: z.string().min(3, { message: "Question is required" }),
    questionImage: z.any(),
    selectedType: z.string(),
    optionFields: z.any(),
    isRequired: z.boolean(),
    questionId: z.string(),
    questionDescription: z.string().optional()
})

export const formQuestionSchema = z.object({
    questions: z.array(formQuestion),
    title: z.string().min(3, { message: "Title is required" }),
    description: z.string().optional(),
    isActive:z.boolean(),
    
    
});

export const eventQaAskAndReplySchema = z.object({
    anonymous: z.boolean(),
    content: z.string().min(1, {message:"Field is rewuired"}),
    userNickName: z.string().optional()
})

export const formSettingSchema = z.object({
    title: z.string().min(3, { message: "Title is required" }),
    description: z.string().optional(),
    coverImage: z.any(),
    formSettings: z.object({
        isConnectedToEngagement: z.boolean(),
        showForm: z.string(),
        redirectUrl: z.string().optional(),
        isCollectUserEmail: z.boolean(),
        isCoverScreen:z.boolean(),
        displayType: z.string(),
        questionPerSlides: z.string().optional(),
        titleFontSize: z.string(),
        headingFontSize: z.string(),
        backgroundColor: z.string(),
        textColor:z.string(),
        buttonColor:z.string(),
        buttonText:z.string(),
        startButtonText:z.string(),
        textFontSize:z.string(),
        isCoverImage: z.boolean()
    })
})



export const formAnswerSchema = z.object( {
    attendeeEmail:z.any(),
    eventAlias: z.string(),
    formResponseAlias: z.string(),
    formAlias: z.string(),
    questions: z.array(formQuestion),
    responses: z.array(z.object({
        type:z.string(),
        response: z.any(),
        questionId: z.string()
    }))
})

export const eventQaSettingSchema = z.object({
    description: z.any(),
    coverTitle: z.string().min(3, { message: "Title is required" }),
    coverImage: z.any(),
  });