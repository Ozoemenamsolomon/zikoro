"use client";
import Overlay from "@/components/Overlay";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
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
import { useCreateAttendee } from "@/hooks/services/attendee";
import { AttendeeSchema } from "@/schemas/attendee";
import { TAttendee, TAttendeeType } from "@/types/attendee";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import COUNTRY_CODE from "@/utils/countryCode";
import { attendeeTypeOptions } from "@/data/attendee";
import { uploadFile, uploadFiles } from "@/utils/helpers";

export default function AddAttendeeForm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("+234");
  const [whatsappCountryCode, setWhatsAppCountryCode] =
    useState<string>("+234");
  const defaultValues: Partial<TAttendee> = {
    registrationDate: new Date().toISOString(),
    certificate: true,
    userEmail: "ubahyusuf484@gmail.com",
    attendeeType: ["attendee"],
    eventId: "1234567890",
    country: "Nigeria",
  };

  const { createAttendee, isLoading, error } = useCreateAttendee();

  const form = useForm<TAttendee>({
    resolver: zodResolver(AttendeeSchema),
    defaultValues,
  });

  const { watch, setValue } = form;

  const attendeeType = watch("attendeeType");
  const country = watch("country");
  const profilePicture = watch("profilePicture");

  useEffect(() => {
    const newCountry = COUNTRY_CODE.find(({ name }) => country === name);

    if (newCountry) {
      setPhoneCountryCode(newCountry.dial_code);
      setWhatsAppCountryCode(newCountry.dial_code);
    }
  }, [country]);

  const toggleAttendeeType = (value: string) => {
    const newAttendeeType = () => {
      if (attendeeType && attendeeType.includes(value)) {
        // If value is already in the array, remove it
        return attendeeType.filter((item: string) => item !== value);
      } else if (attendeeType && !attendeeType.includes(value)) {
        // If value is not in the array, add it
        return [...attendeeType, value];
      } else {
        return [value];
      }
    };

    setValue("attendeeType", newAttendeeType());
  };

  async function onSubmit(data: z.infer<typeof AttendeeSchema>) {
    onClose();
    const payload = {
      ...data,
      phoneNumber: data.phoneNumber
        ? phoneCountryCode + data.phoneNumber
        : "N/A",
      whatsappNumber: data.whatsappNumber
        ? whatsappCountryCode + data.whatsappNumber
        : "N/A",
    };

    await createAttendee({ payload });
  }

  const [profilePictureIsUploading, setProfilePictureUploading] =
    useState<boolean>(false);

  const uploadProfilePicture = async (file: File | null) => {
    try {
      if (!file) return;
      setProfilePictureUploading(true);
      const { url, error } = await uploadFile(file, "image");

      if (error) throw error;
      alert("File uploaded successfully");

      setValue("profilePicture", url || "");
      console.log("File uploaded successfully!", url);
    } catch (error) {
      alert("error uploading profile picture");
      console.error("Error uploading file:", error);
    } finally {
      setProfilePictureUploading(false);
    }
  };

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
                  <InputOffsetLabel isRequired label="First name">
                    <Input
                      placeholder="Enter first name"
                      {...field}
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
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
                  <InputOffsetLabel isRequired label={"Last name"}>
                    <Input
                      placeholder={"Enter last name"}
                      {...field}
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
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
              <InputOffsetLabel isRequired label={"Email"}>
                <Input
                  placeholder="Enter email"
                  {...field}
                  className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
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
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
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
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
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
                  <InputOffsetLabel isRequired label={"City"}>
                    <Input
                      placeholder="Enter city"
                      {...field}
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
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
                  <InputOffsetLabel isRequired label={"Country"}>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Enter country"
                            className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRY_CODE.map(({ name }) => (
                          <SelectItem value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <FormItem className="relative h-fit">
                    <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                      Phone number
                      <sup className="text-red-700">*</sup>
                    </FormLabel>
                    <input
                      type="text"
                      className="!mt-0 text-sm absolute top-1/2 -translate-y-1/2 left-2 text-gray-700 z-10 font-medium h-full w-fit max-w-[36px] border-y-[1px]"
                      value={phoneCountryCode}
                      onInput={(e) =>
                        setPhoneCountryCode(e.currentTarget.value)
                      }
                    />
                    <FormControl>
                      <Input
                        className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 pl-12"
                        placeholder="Enter phone number"
                        {...field}
                        type="number"
                        maxLength={10}
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
                    <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                      WhatsApp number
                    </FormLabel>
                    <input
                      type="text"
                      className="!mt-0 text-sm absolute top-1/2 -translate-y-1/2 left-2 text-gray-700 z-10 font-medium h-10 w-fit max-w-[36px] border-y-[1px]"
                      value={whatsappCountryCode}
                      onInput={(e) =>
                        setWhatsAppCountryCode(e.currentTarget.value)
                      }
                    />
                    <FormControl>
                      <Input
                        className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 pl-12"
                        placeholder="Enter whatsapp number"
                        {...field}
                        type="number"
                        maxLength={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
              Profile picture
            </div>
            <label
              htmlFor="profilePicture"
              className="hover:cursor-pointer flex items-center gap-6 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <Camera className="w-6 h-6" />
              {profilePictureIsUploading ? (
                <span className="text-gray-500">Loading...</span>
              ) : profilePicture ? (
                <span className="text-gray-500 truncate">{profilePicture}</span>
              ) : (
                <span className="text-gray-200">Select Image</span>
              )}
            </label>
            <div className="opacity-0 absolute w-full h-full top-0 hover:cursor-pointer">
              <Input
                name="profilePicture"
                type="file"
                onChange={(e) =>
                  e.target.files && uploadProfilePicture(e.target.files[0])
                }
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full rounded-md border border-input bg-background px-3 py-4 text-sm relative">
            <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
              Attendee Type
            </span>
            <div className="flex gap-2 flex-wrap justify-between">
              {attendeeTypeOptions.map(({ label, value }) => (
                <button
                  className={`text-sm p-1.5 mx-auto border-2 rounded font-medium",
                    ${
                      attendeeType && attendeeType.includes(value)
                        ? "text-earlyBirdColor border-earlyBirdColor bg-[#EEF0FF]"
                        : "border-gray-600 text-gray-600 bg-white"
                    }
                  `}
                  type="button"
                  onClick={() => toggleAttendeeType(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-tiny font-medium text-gray-500">
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
                  className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                />
              </InputOffsetLabel>
            )}
          />
          <FormField
            control={form.control}
            name="x"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                  Twitter
                </FormLabel>
                <span className="text-sm absolute translate-y-1/2 right-4 text-gray-700 z-10 font-medium">
                  <Twitter className="w-4 h-4" />
                </span>
                <FormControl>
                  <Input
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 pr-12"
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
                <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                  LinkedIn
                </FormLabel>
                <span className="text-sm absolute translate-y-1/2 right-4 text-gray-700 z-10 font-medium">
                  <Linkedin className="w-4 h-4" />
                </span>
                <FormControl>
                  <Input
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 pr-12"
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
                <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                  Instagram
                </FormLabel>
                <span className="text-sm absolute translate-y-1/2 right-4 text-gray-700 z-10 font-medium">
                  <Instagram className="w-4 h-4" />
                </span>
                <FormControl>
                  <Input
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 pr-12"
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
                <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                  Facebook
                </FormLabel>
                <span className="text-sm absolute translate-y-1/2 right-4 text-gray-700 z-10 font-medium">
                  <Facebook className="w-4 h-4" />
                </span>
                <FormControl>
                  <Input
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 pr-12"
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
