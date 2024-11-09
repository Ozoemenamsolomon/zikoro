import * as z from "zod";

export const sessionSchema = z.object({
  activity: z.string(),
  sessionTitle: z.string().min(3, { message: "Title is required" }),
  startDateTime: z.string(),
  endDateTime: z.string(),
  Track: z.any(),
  description: z.any(),
  sessionType: z.any(),
  sessionSponsors: z.any(),
  sessionUrl: z.any(),
  sessionSpeakers: z.any(),
  sessionModerators: z.any(),
  sessionFiles: z.any(),
  sessionVenue:z.any(),
  engagementAlias: z.any()
});
