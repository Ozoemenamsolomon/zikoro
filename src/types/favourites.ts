import { favouriteContactSchema } from "@/schemas/favourites";
import { z } from "zod";

export type TFavouriteContact = z.infer<typeof favouriteContactSchema>;
