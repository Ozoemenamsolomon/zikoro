import * as z from "zod";

export const attendeeValidationSchema = z.array(
  z.object({
    email: z
      .string()
      .email({ message: "Email must be a valid email" })
      .min(1, { message: "Email is required" }),
    firstName: z.string().min(3, { message: "First Name is required" }),
    lastName: z.string().min(3, { message: "Last Name is required" }),
    phoneNumber: z
      .string()
      .refine((value) => value && /^\d{11,}$/.test(value), {
        message: "Phone number must be at least 11 digits",
      }),
    whatsappNumber: z
      .string()
      .refine((value) => value && /^\d{11,}$/.test(value), {
        message: "Whatsapp number must be at least 11 digits",
      }),
  })
);

export const eventBookingValidationSchema = z.object({
  attendeeApplication: attendeeValidationSchema,
  aboutUs: z.enum(["instagram", "facebook", "x", "others"]),
  others: z
    .string()
    .refine((value) => value !== undefined && value.trim() !== "", {
      message: "Please provide a value for 'Others.'",
    })
    .optional(),
});
