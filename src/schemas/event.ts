import * as z from "zod";

export const attendeeValidationSchema = z.array(
  z.object({
    email: z.string().email({ message: "Email must be a valid email" }),
    firstName: z.string().min(3, { message: "First Name is required" }),
    ticketType: z.string(),
    lastName: z.string().min(3, { message: "Last Name is required" }),
    attendeeAlias: z.string(),
    phoneNumber: z
      .string()
      .refine((value) => value && /^\d{11,}$/.test(value.replace(/\D/g, "")), {
        message: "Phone number must be at least 11 digits long",
      })
      .refine((value) => value && /^\+\d{1,3}/.test(value), {
        message: "Phone number must include start with a country code",
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
  startDateTime: z.string().min(1, { message: "Start Date is required" }),
  endDateTime: z.string().min(1, { message: "End Date is required" }),
  eventTitle: z.string().min(3, { message: "Title is required" }),
  eventAddress: z.string().min(3, { message: "Address is required" }).optional(),
  locationType: z.string().min(1, { message: "LocationType is required" }),
  expectedParticipants: z
    .string()
    .min(1, { message: "Expected Participant is required" }),
  eventCity: z.string().min(1, { message: "City is required" }).optional(),
  eventAlias: z.any(),
  eventCountry: z.string().min(2, { message: "Country is required" }).optional(),
  organisationId: z.string().min(2, { message: "Organization is required" }),
  eventPoster: z.any(),
})

const eventPricing = z.array(
  z.object({
    ticketQuantity: z
      .string()
      .min(1, { message: "Ticket Quantity is required" }),
    attendeeType: z.string().min(1, { message: "Attendee Type is required" }),
    description: z.any(),
    price: z.string().min(1, { message: "Price is required" }),
    validity: z.string().min(1, { message: "Validity is required" }),
    accessibility: z.boolean(),
  })
);

export const updateEventSchema = z.object({
  startDateTime: z.any(),
  endDateTime: z.any(),
  eventTitle: z.string().min(3, { message: "Title is required" }),
  eventAddress: z.any(),
  locationType: z.string().min(1, { message: "Location is required" }),
  expectedParticipants: z.string(),
  eventCity: z.any(),
  eventCountry: z.any(),
  eventVisibility: z.any(),
  industry: z.any(),
  eventCategory: z.any(),
  eventPoster: z.any(),
  pricingCurrency: z.any(),
  description: z.any(),
  pricing: eventPricing,
  eventTimeZone: z.any(),
})

export const rewardSchema = z.object({
  rewardTitle: z.string().min(3, { message: "Title is required" }),
  image: z.any(),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  point: z.string().min(1, { message: "Point is required" }),
});

export const addPartnerToTierSchema = z.object({
  companyName: z.string().min(3, { message: "Name is required" }),
  email: z.string().email({ message: "Email must be a valid email" }),
  companyLogo: z.any(),
  city: z.string().min(3, { message: "City is required" }),
  country: z.string().min(3, { message: "Country is required" }),
  contactFirstName: z.string().min(3, { message: "First Name is required" }),
  contactLastName: z.string().min(3, { message: "Last Name is required" }),
  website: z.any(),
  phoneNumber: z
  .string()
  .refine((value) => value && /^\d{11,}$/.test(value.replace(/\D/g, "")), {
    message: "Phone number must be at least 11 digits long",
  })
  .refine((value) => value && /^\+\d{1,3}/.test(value), {
    message: "Phone number must include start with a country code",
  }),
  whatsApp: z
  .string()
  .optional()
  .refine((value) => !value || /^\+\d{1,3}/.test(value), {
    message: "WhatsApp number must start with a country code",
  }),
});

export const partnerDetails = z.array(
  z.object({
    validity: z.string().min(1, { message: "Validity is required" }),
    partnerType: z.string().min(1, { message: "Partner Type is required" }),
    tierName: z.string().min(2, { message: "Tier Name is required" }),
    quantity: z.string().min(1, { message: "Quantity is required" }),
    price: z.string().min(1, { message: "Price is required" }),
    currency: z.string().min(1, { message: "Currency is required" }),
    color: z.string(),
    description: z.any(),
    id: z.string()
  })
);

export const partnerTierSchema = z.object({
  partnerTier: partnerDetails,
});
