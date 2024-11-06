import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Email must be a valid email" })
    .min(1, { message: "Email is required" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .min(1, { message: "Password is required" }),
});

export const onboardingSchema = z.object({

  firstName: z.string().min(1, { message: "Username is required" }),
  lastName: z.string().min(1, { message: "Username is required" }),
  phoneNumber: z.string().refine((value) => value && /^\d{10,}$/.test(value), {
    message: "Phone number must be at least 10 digits",
  }),
  city: z.string().min(1, { message: "City is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  referralCode: z.string(),
  referredBy: z.any()
});

export const organizationSchema = z.object({
  organizationName: z.string().min(1, { message: "Organisation name is required"}),
  organizationType: z.string().min(1, { message: "Organisation type is required"}),
  subscriptionPlan: z.string().min(1, { message: "Subscription plan is required"}),
  userEmail: z.string(),
  lastName: z.string(),
  firstName: z.string(),
  organizationAlias: z.string()
})