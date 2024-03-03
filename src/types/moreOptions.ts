import { ChangeAttendeeTypeSchema } from "@/schemas/moreoptions";
import { z } from "zod";

export type TChangeAttendeetype = z.infer<typeof ChangeAttendeeTypeSchema>;
