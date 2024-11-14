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
import { TAttendee, TAttendeeType, TCompletedFields } from "@/types/attendee";
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
import { COUNTRY_CODE } from "@/utils/countryCode";
import { attendeeTypeOptions } from "@/data/attendee";
import {
  generateAlphanumericHash,
  uploadFile,
  uploadFiles,
} from "@/utils/helpers";
import { useParams } from "next/navigation";
import { getCookie } from "@/hooks";
import { useGetData } from "@/hooks/services/request";
import { EngagementsSettings } from "@/types/engagements";
import useUserStore from "@/store/globalUserStore";
import useEventStore from "@/store/globalEventStore";
import { ReactSelect } from "../custom_ui/ReactSelect";

export default function AddAttendeeForm({
  attendee,
  isOpen,
  onClose,
  action,
}: {
  action: (payload: Partial<TAttendee>) => Promise<void>;
  attendee?: TAttendee;
  isOpen: boolean;
  onClose: () => void;
}) {
  console.log(attendee?.completedFields);
  const { toast } = useToast();
  const { eventId } = useParams();
  const { user } = useUserStore();
  const { event } = useEventStore();

  const isEventOwner = user && String(event?.createdBy) === String(user.id);

  const defaultValues: Partial<TAttendee> = attendee
    ? {
        ...attendee,
      }
    : {
        attendeeType: ["attendee"],
        country: "Nigeria",
      };

  const form = useForm<TAttendee>({
    resolver: zodResolver(AttendeeSchema),
    defaultValues,
  });

  const {
    data: engagementsSettings,
    isLoading: engagementsSettingsIsLoading,
    getData: getEngagementsSettings,
  } = useGetData<EngagementsSettings>(`engagements/${eventId}/settings`);

  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!attendee) return form.reset();

    form.reset({
      ...attendee,
    });
  }, [attendee]);

  const attendeeType = watch("attendeeType");
  const country = watch("country");
  const phoneNumber = watch("phoneNumber");
  const profilePicture = watch("profilePicture");

  useEffect(() => {
    console.log(
      !!COUNTRY_CODE.find(
        ({ dial_code }) =>
          phoneNumber &&
          dial_code === phoneNumber?.substring(0, dial_code.length - 1)
      )
    );
  }, [phoneNumber]);

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
    if (!user) return null;

    const payload: Partial<TAttendee> = {
      ...data,
      eventId: Array.isArray(eventId) ? eventId[0] : eventId,
      ticketType: "in-house",
      registrationCompleted: true,
      userId: user.id,
      userEmail: user.userEmail,
      registrationDate: new Date().toISOString(),
    };

    let completedFields: TCompletedFields =
      // attendee && attendee.completedFields ? [...attendee.completedFields] : [];
      [];

    if (attendee) {
      payload.id = attendee.id;
    } else {
      payload.attendeeAlias = generateAlphanumericHash(7);
    }

    const attendeeProfilePoints = parseInt(
      engagementsSettings?.pointsAllocation["update profile"].points || 0
    );

    let newProfilePoints = attendee?.attendeeProfilePoints ?? 0;

    console.log(completedFields);
    console.log(newProfilePoints);

    for (const [key, value] of Object.entries(data)) {
      console.log(key, completedFields.includes(key), value);
      if (!completedFields.includes(key) && value) {
        console.log(key);
        newProfilePoints += attendeeProfilePoints;
        completedFields.push(key);
      }

      if (completedFields.includes(key) && !value) {
        newProfilePoints -= attendeeProfilePoints;
        completedFields = completedFields.filter((field) => field !== key);
      }
    }

    console.log(newProfilePoints);
    console.log(completedFields);

    await action({
      ...payload,
      completedFields,
      attendeeProfilePoints: newProfilePoints,
    });

    onClose();
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
    } catch (error) {
      alert("error uploading profile picture");
      console.error("Error uploading file:", error);
    } finally {
      setProfilePictureUploading(false);
    }
  };

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      title={`${attendee ? "Update" : "Create"} Attendee`}
    >
      <Form {...form}>
        <form
          autoComplete="off"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
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
                    <ReactSelect
                      placeHolder="Enter Country"
                      defaultValue={{
                        label: field.value,
                        value: field.value,
                      }}
                      {...form.register("country")}
                      options={COUNTRY_CODE.map(({ name }) => ({
                        label: name,
                        value: name,
                      }))}
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
                  <FormItem className="w-full bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 h-fit relative">
                    <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                      Phone number
                      <sup className="text-red-700">*</sup>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                        placeholder="Enter phone number"
                        {...field}
                        type="number"
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
                  <FormItem className="w-full bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 h-fit relative">
                    <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                      WhatsApp number
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                        placeholder="Enter whatsapp number"
                        {...field}
                        type="number"
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
                <span className="text-gray-500 truncate">
                  Profile Uploaded successfully
                </span>
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
          {isEventOwner && (
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
          )}

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
          <div className="flex flex-col gap-0.5">
            <FormField
              control={form.control}
              name="appointmentLink"
              render={({ field }) => (
                <FormItem className="w-full bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 h-fit relative">
                  <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                    Appointment Link
                  </FormLabel>
                  <span className="text-sm absolute translate-y-1/2 right-4 text-gray-700 z-10 font-medium">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4.222 19.778c.975.975 2.255 1.462 3.535 1.462 1.281-.001 2.562-.487 3.536-1.462l2.828-2.829-1.414-1.414-2.828 2.829c-1.169 1.167-3.072 1.169-4.243 0-1.169-1.17-1.169-3.073 0-4.243l2.829-2.828L7.051 9.879l-2.829 2.828C2.273 14.656 2.273 17.829 4.222 19.778zM19.778 11.293c1.948-1.949 1.948-5.122 0-7.071-1.95-1.95-5.123-1.948-7.071 0L9.879 7.051l1.414 1.414 2.828-2.829c1.17-1.167 3.073-1.169 4.243 0 1.169 1.17 1.169 3.073 0 4.243l-2.829 2.828 1.414 1.414L19.778 11.293z" />
                      <path
                        transform="rotate(-134.999 12 12)"
                        d="M11 5.999H13V18H11z"
                      />
                    </svg>
                  </span>
                  <FormControl>
                    <Input
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 pr-12"
                      placeholder="https://appointment.link"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://bookings.zikoro.com/workspace/schedule"
            >
              <span className="text-xs font-medium text-basePrimary">
                create your appointment link with this URL
              </span>
            </a>
          </div>
          <FormField
            control={form.control}
            name="x"
            render={({ field }) => (
              <FormItem className="w-full bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 h-fit relative">
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
              <FormItem className="w-full bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 h-fit relative">
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
              <FormItem className="w-full bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 h-fit relative">
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
              <FormItem className="w-full bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 h-fit relative">
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
          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem className="w-full bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 h-fit relative">
                <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                  Website
                </FormLabel>
                <span className="text-sm absolute translate-y-1/2 right-4 text-gray-700 z-10 font-medium">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 496 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z" />
                  </svg>
                </span>
                <FormControl>
                  <Input
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 pr-12"
                    placeholder="https://www.orthoex.ng/"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={profilePictureIsUploading || engagementsSettingsIsLoading}
            type="submit"
            className="bg-basePrimary w-full"
          >
            Save
          </Button>
        </form>
      </Form>
    </Overlay>
  );
}
