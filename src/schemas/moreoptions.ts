import { z } from "zod";

export const ChangeAttendeeTypeSchema = z.object({
  attendeeType: z.array(z.string()),
  attendeesId: z.array(z.string()),
});
