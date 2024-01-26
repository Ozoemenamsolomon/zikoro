import * as z from "zod";

const bannerSchema = z.array(
  z.object({
    file: z.string().min(3, { message: "Field is required" }),
    link: z
      .string()
      .min(3, { message: "Banner Link is required" })
      .refine((value) => value && /^[https://]/.test(value), {
        message: "Banner Link is Invalid",
      }),
  })
);
export const addBannerSchema = z.object({
  banners: bannerSchema,
});
