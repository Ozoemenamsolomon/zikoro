import { z } from "zod";

export const accountDetailsSchema = z.object({
  bankCountry: z.string(),
  currency: z.string(),
  accountNumber: z.string(),
  accountName: z.string(),
  bankName: z.string(),
  bankCode: z.number().optional(),
});

export const AffiliateSchema = z.object({
  id: z.number().optional(),
  created_at: z.string().optional(),
  userId: z.number(),
  userEmail: z.string(),
  firstName: z.string(),
  lastname: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  // .regex(/^\d{11}$/, { message: "Phone number must be 11 digits long" }),
  accountDetails: accountDetailsSchema,
  payoutSchedule: z.string().optional().nullable(),
  affliateStatus: z.boolean(),
});
