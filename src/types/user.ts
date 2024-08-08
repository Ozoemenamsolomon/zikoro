import { UserSchema } from "@/schemas/user";
import { z } from "zod";

// Optional: You can use the following line to enforce strict typing
export type TUser = z.infer<typeof UserSchema> & {
  id: number;
  referralCode: string;
};

type User = {
  email: string;
  created_at: string;
  email_confirmed_at: string;
  id: string;
};
export interface TAuthUser {
  user: User;
}
