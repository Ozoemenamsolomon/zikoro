import { z } from "zod";

export const accountDetailsSchema = z.object({
  bankCountry: z.string().optional(),
  currency: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  bankName: z.string().optional(),
  bankCode: z.string().optional(),
});

export const AffiliateSchema = z.object({
  id: z.number().optional(),
  created_at: z.string().optional(),
  userId: z.number(),
  userEmail: z.string(),
  firstName: z.string(),
  lastname: z.string(),
  email: z.string(),
  phoneNumber: z.string().optional(),
  // .regex(/^\d{11}$/, { message: "Phone number must be 11 digits long" }),
  accountDetails: accountDetailsSchema,
  payoutSchedule: z.string().optional().nullable(),
  affliateStatus: z.boolean(),
  note: z.string().optional(),
});
