"use client";
import Overlay from "@/components/Overlay";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { useCreateAttendee } from "@/hooks/attendees";

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
  attendeeType: z.array(z.string()),
});

export type AttendeeSchema = z.infer<typeof AttendeeSchema>;

type TAttendeeType = {
  label: string;
  value: string;
};

const attendeeTypeOptions: TAttendeeType[] = [
  {
    label: "Attendee",
    value: "attendee",
  },
  {
    label: "Speaker",
    value: "speaker",
  },
  {
    label: "Sponsor",
    value: "sponsor",
  },
  {
    label: "Exhibitor",
    value: "exhibitor",
  },
  {
    label: "Moderator",
    value: "moderator",
  },
  {
    label: "Organizer",
    value: "organizer",
  },
];

export default function AddAttendeeForm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const defaultValues: Partial<AttendeeSchema> = {
    registrationDate: new Date().toISOString(),
    amount: 5000,
    certificate: true,
    userEmail: "ubahyusuf484@gmail.com",
    attendeeType: ["attendee"],
  };

  const { createAttendee, isLoading, error } = useCreateAttendee();

  const form = useForm<AttendeeSchema>({
    resolver: zodResolver(AttendeeSchema),
    defaultValues,
  });

  const { watch, setValue } = form;

  const attendeeType = watch("attendeeType");
  console.log(attendeeType);

  const toggleAttendeeType = (value: string) => {
    const newAttendeeType = () => {
      if (attendeeType.includes(value)) {
        // If value is already in the array, remove it
        return attendeeType.filter((item: string) => item !== value);
      } else {
        // If value is not in the array, add it
        return [...attendeeType, value];
      }
    };

    setValue("attendeeType", newAttendeeType());
  };

  async function onSubmit(data: z.infer<typeof AttendeeSchema>) {
    onClose();
    console.log("here");
    const response = await createAttendee();
    console.log(response);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          {/* <code className="text-white">{response}</code> */}
        </pre>
      ),
    });
  }

  return (
    <Overlay isOpen={isOpen} onClose={onClose} title="Attendee">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-4 h-fit">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <InputOffsetLabel label="First name">
                    <Input
                      placeholder="Enter first name"
                      {...field}
                      className="placeholder:text-sm placeholder:text-slate-500 mt-0"
                    />
                  </InputOffsetLabel>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <InputOffsetLabel label={"Last name"}>
                    <Input
                      placeholder={"Enter last name"}
                      {...field}
                      className="placeholder:text-sm placeholder:text-slate-500"
                    />
                  </InputOffsetLabel>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <InputOffsetLabel label={"Email"}>
                <Input
                  placeholder="Enter email"
                  {...field}
                  className="placeholder:text-sm placeholder:text-slate-500"
                />
              </InputOffsetLabel>
            )}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <InputOffsetLabel label={"Job title"}>
                    <Input
                      placeholder="Enter job title"
                      {...field}
                      className="placeholder:text-sm placeholder:text-slate-500"
                    />
                  </InputOffsetLabel>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <InputOffsetLabel label={"Company name"}>
                    <Input
                      placeholder="Enter company name"
                      {...field}
                      className="placeholder:text-sm placeholder:text-slate-500"
                    />
                  </InputOffsetLabel>
                )}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <InputOffsetLabel label={"Last name"}>
                    <Input
                      placeholder="Enter city"
                      {...field}
                      className="placeholder:text-sm placeholder:text-slate-500"
                    />
                  </InputOffsetLabel>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <InputOffsetLabel label={"Country"}>
                    <Input
                      placeholder="Enter country"
                      {...field}
                      className="placeholder:text-sm placeholder:text-slate-500"
                    />
                  </InputOffsetLabel>
                )}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-slate-600 text-[10px] px-1">
                      Phone number
                    </FormLabel>
                    <span className="text-sm absolute top-1/2 left-2 text-slate-700 z-10 font-medium">
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
            </div>
            <div className="flex-1">  
            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-slate-600 text-[10px] px-1">
                    WhatsApp number
                  </FormLabel>
                  <span className="text-sm absolute top-1/2 left-2 text-slate-700 z-10 font-medium">
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
          </div>
          <FormField
            control={form.control}
            name="profilePicture"
            render={({ field }) => (
              <FormItem className="relative">
                <div className="absolute top-0 -translate-y-1/2 right-4 bg-white text-slate-600 text-[10px] px-1">
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
          <div className="flex flex-col gap-4 w-full rounded-md border border-input bg-background px-3 py-4 text-sm relative">
            <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-slate-600 text-[10px] px-1">
              Attendee Type
            </span>
            <div className="flex gap-2 flex-wrap justify-between">
              {attendeeTypeOptions.map(({ label, value }) => (
                <button
                  className={`text-sm p-1.5 mx-auto border-2 rounded font-medium",
                    ${
                      attendeeType.includes(value)
                        ? "text-earlyBirdColor border-earlyBirdColor bg-[#EEF0FF]"
                        : "border-slate-600 text-slate-600 bg-white"
                    }
                  `}
                  type="button"
                  onClick={() => toggleAttendeeType(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-medium text-slate-500">
              You can assign multiple roles to the attendee
            </span>
          </div>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <InputOffsetLabel label="bio">
                <Textarea
                  placeholder="Write a text"
                  {...field}
                  className="placeholder:text-sm placeholder:text-slate-500"
                />
              </InputOffsetLabel>
            )}
          />
          <FormField
            control={form.control}
            name="x"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-slate-600 text-[10px] px-1">
                  Twitter
                </FormLabel>
                <span className="text-sm absolute translate-y-1/2 right-4 text-slate-700 z-10 font-medium">
                  <Twitter className="w-4 h-4" />
                </span>
                <FormControl>
                  <Input
                    className="placeholder:text-sm placeholder:text-slate-500 pr-12"
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
                <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-slate-600 text-[10px] px-1">
                  LinkedIn
                </FormLabel>
                <span className="text-sm absolute translate-y-1/2 right-4 text-slate-700 z-10 font-medium">
                  <Linkedin className="w-4 h-4" />
                </span>
                <FormControl>
                  <Input
                    className="placeholder:text-sm placeholder:text-slate-500 pr-12"
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
                <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-slate-600 text-[10px] px-1">
                  Instagram
                </FormLabel>
                <span className="text-sm absolute translate-y-1/2 right-4 text-slate-700 z-10 font-medium">
                  <Instagram className="w-4 h-4" />
                </span>
                <FormControl>
                  <Input
                    className="placeholder:text-sm placeholder:text-slate-500 pr-12"
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
                <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-slate-600 text-[10px] px-1">
                  Facebook
                </FormLabel>
                <span className="text-sm absolute translate-y-1/2 right-4 text-slate-700 z-10 font-medium">
                  <Facebook className="w-4 h-4" />
                </span>
                <FormControl>
                  <Input
                    className="placeholder:text-sm placeholder:text-slate-500 pr-12"
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
