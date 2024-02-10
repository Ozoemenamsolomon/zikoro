import { z } from "zod";

const accountDetailsSchema = z.object({
  bankCountry: z.string(),
  currency: z.string(),
  accountNumber: z.string(),
  accountName: z.string(),
  bankName: z.string(),
});

export const AffiliateSchema = z.object({
  id: z.number().optional(),
  created_at: z.date().optional(),
  organizationId: z.number(),
  organizationName: z.string(),
  userId: z.number(),
  userEmail: z.string(),
  firstName: z.string(),
  lastname: z.string(), // Corrected capitalization of 'lastName'
  email: z.string(),
  phoneNumber: z
    .string()
    .regex(/^\d{11}$/, { message: "Phone number must be 11 digits long" }),
  accountDetails: accountDetailsSchema,
  payoutSchedule: z.string().optional(),
  
  affliateStatus: z.boolean(),
});
