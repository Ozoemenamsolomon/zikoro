import * as z from "zod";

export const attendeeValidationSchema = z.array(
  z.object({
    email: z
      .string()
      .email({ message: "Email must be a valid email" })
      .refine(
        (value) =>
          value && /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(value),
        {
          message: "Invalid email address",
        }
      ),
    firstName: z.string().min(3, { message: "First Name is required" }),
    lastName: z.string().min(3, { message: "Last Name is required" }),
    phoneNumber: z
      .string()
      .refine((value) => value && /^(\+\d{11,}|\d{11,})$/.test(value), {
        message: "Phone number must be at least 11 digits",
      }),
    whatsappNumber: z
      .string()
      .refine((value) => value && /^(\+\d{11,}|\d{11,})$/.test(value), {
        message: "Whatsapp number must be at least 11 digits",
      }),
  })
);

export const eventBookingValidationSchema = z.object({
  attendeeApplication: attendeeValidationSchema,
  aboutUs: z.enum(["instagram", "facebook", "x", "linkedIn", "others"]),
  others: z
    .string()
    .refine((value) => value !== undefined && value.trim() !== "", {
      message: "Please provide a value for 'Others.'",
    })
    .optional(),
});

export const eventFeedBackSchema = z.object({
  comment: z.string().min(3, { message: "Comment is required" }),
  ratings: z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]),
});

export const newEventSchema = z.object({
  startDateTime: z.object({}),
  endDateTime: z.object({}),
  eventTitle: z.string().min(3, { message: "Title is required" }),
  eventAddress: z.string().min(3, { message: "Address is required" }),
  locationType: z.string(),
  expectedParticipants: z.string(),
  eventCity: z.string(),
  eventCountry: z.string(),
  organizationId: z.any()
});
