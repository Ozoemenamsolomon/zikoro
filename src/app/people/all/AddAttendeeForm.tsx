"use client";
import Overlay from "@/components/Overlay";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const AttendeeSchema = z.object({
  registrationDate: z.string(),
  userEmail: z.string().refine((email) => /\S+@\S+\.\S+/.test(email), {
    message: "Invalid email address",
  }),
  firstName: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  email: z.string().refine((email) => /\S+@\S+\.\S+/.test(email), {
    message: "Invalid email address",
  }),
  jobTitle: z.string().optional(),
  organization: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  whatsappNumber: z.string().optional(),
  bio: z.string().optional(),
  x: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  amount: z.number(),
  certificate: z.boolean(),
  profilePicture: z.string().optional(),
});

export type AttendeeSchema = z.infer<typeof AttendeeSchema>;

export default function AddAttendeeForm({ isOpen, onClose }) {
  const defaultValues: Partial<AttendeeSchema> = {
    registrationDate: new Date().toISOString(),
    amount: 5000,
    certificate: true,
    userEmail: "ubahyusuf484@gmail.com"
  };

  const form = useForm<AttendeeSchema>({
    resolver: zodResolver(AttendeeSchema),
    defaultValues,
  });

  function onSubmit(data: z.infer<typeof AttendeeSchema>) {
    onClose();
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Overlay isOpen={isOpen} onClose={onClose} title="Attendee">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                    First name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                    Last name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                  Email
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                    Job title
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter job title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                    Company name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                    Phone number
                  </FormLabel>
                  <span className="text-sm absolute translate-y-1/2 left-2 text-slate-700 z-10 font-medium">
                    +234
                  </span>
                  <FormControl>
                    <Input
                      className="pl-12"
                      placeholder="Enter phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                    WhatsApp number
                  </FormLabel>
                  <span className="text-sm absolute translate-y-1/2 left-2 text-slate-700 z-10 font-medium">
                    +234
                  </span>
                  <FormControl>
                    <Input
                      className="pl-12"
                      placeholder="Enter whatsapp number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="profilePicture"
            render={({ field }) => (
              <FormItem className="relative">
                <div className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                  Profile picture
                </div>
                <FormLabel className="hover:cursor-pointer flex items-center gap-6 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <Camera className="w-6 h-6" />
                  <span className="text-slate-500">Select Image</span>
                </FormLabel>
                <FormControl>
                  <Input type="file" className="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Write a text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="x"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                  Twitter
                </FormLabel>
                <span className="text-sm absolute translate-y-1/2 right-4 text-slate-700 z-10 font-medium">
                  <Twitter className="w-4 h-4" />
                </span>
                <FormControl>
                  <Input
                    className="pr-12"
                    placeholder="https://www.x.com/"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                  LinkedIn
                </FormLabel>
                <span className="text-sm absolute translate-y-1/2 right-4 text-slate-700 z-10 font-medium">
                  <Linkedin className="w-4 h-4" />
                </span>
                <FormControl>
                  <Input
                    className="pr-12"
                    placeholder="https://www.linkedin.com/"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                  Instagram
                </FormLabel>
                <span className="text-sm absolute translate-y-1/2 right-4 text-slate-700 z-10 font-medium">
                  <Instagram className="w-4 h-4" />
                </span>
                <FormControl>
                  <Input
                    className="pr-12"
                    placeholder="https://www.instagram.com/"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute -top-1 right-4 bg-white text-slate-600 text-sm px-1.5">
                  Facebook
                </FormLabel>
                <span className="text-sm absolute translate-y-1/2 right-4 text-slate-700 z-10 font-medium">
                  <Facebook className="w-4 h-4" />
                </span>
                <FormControl>
                  <Input
                    className="pr-12"
                    placeholder="https://www.facebook.com/"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-basePrimary w-full">
            Save
          </Button>
        </form>
      </Form>
    </Overlay>
  );
}
