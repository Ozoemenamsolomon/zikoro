import { UserSchema } from "@/schemas/user";
import { z } from "zod";

// Optional: You can use the following line to enforce strict typing
export type TUser = z.infer<typeof UserSchema>;
