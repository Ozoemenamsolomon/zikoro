import { favouriteContactSchema } from "@/schemas/favourites";
import { z } from "zod";
import { TAttendee } from "./attendee";

export type TFavouriteContact = z.infer<typeof favouriteContactSchema> & {
  attendees: TAttendee["id"][] | null;
};
