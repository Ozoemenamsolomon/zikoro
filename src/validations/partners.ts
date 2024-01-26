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

export const jobSchema = z.object({
  jobTitle: z.string().min(3, { message: "Title is required" }),
  companyName: z.string().min(3, { message: "Company Name is required" }),
  maxSalary: z.string().min(3, { message: "Max. Salary is required" }),
  minSalary: z.string().min(3, { message: "Min. Salary is required" }),
  salaryDuration: z.string().min(3, { message: "Salary Duration is required" }),
  flexibility: z.string().min(3, { message: "Flexibility Type is required" }),
  description: z.string().min(3, { message: "Job Description is required" }),
  city: z.string().min(3, { message: "City is required" }),
  country: z.string().min(3, { message: "Country is required" }),
  employmentType: z.string().min(3, { message: "Employment Type is required" }),
  experienceLevel: z
    .string()
    .min(3, { message: "Experience Level is required" }),
  qualification: z.string().min(3, { message: "Qualification is required" }),
});

export const partnerSchema = z.object({
    partnersType: z.string().min(3, { message: "Title is required" }),
    companyName: z.string().min(3, { message: "Company Name is required" }),
    description: z.string().min(3, { message: "Job Description is required" }),
    city: z.string().min(3, { message: "City is required" }),
    country: z.string().min(3, { message: "Country is required" }),
    media: z.string().min(3, { message: "Media is required" }),
    logo: z
      .string()
      .min(3, { message: "Company logo is required" }),
      website: z.string().min(3, { message: "Website Link is required" }),
      exhibitionHall: z.string().min(3, { message: "Exhibition Hall is required" }),
  });