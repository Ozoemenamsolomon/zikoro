"use client";

import { UseFormReturn, useForm } from "react-hook-form";
import {
  Form,
  FormField,
  Input,
  Button,
  ReactSelect,
  FormItem,
  FormMessage,
} from "@/components";
import { newEventSchema } from "@/schemas";
import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import {
  COUNTRY_CODE,
  formateJSDate,
  generateAlias,
  parseFormattedDate,
  uploadFile,
} from "@/utils";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { useCreateEvent, getCookie, useGetUserOrganizations } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import InputOffsetLabel from "../InputOffsetLabel";
import _ from "lodash";
import { useRouter } from "next/navigation";
import { CreateOrganization } from "../eventHome";
import useUserStore from "@/store/globalUserStore";
import { ArrowBack } from "@styled-icons/material-outlined/ArrowBack";
import { ImageAdd } from "@styled-icons/boxicons-regular/ImageAdd";
import DatePicker from "react-datepicker";
import { DateRange } from "@styled-icons/material-outlined/DateRange";
import { cn } from "@/lib";
type OrganizationListType = {
  label: string;
  value: any;
};

export default function CreateEvent() {
  const { createEvent, loading } = useCreateEvent();
  const [isStartDate, setStartDate] = useState(false);
  const [isEndDate, setEndDate] = useState(false);
  const { user: userData } = useUserStore();

  const router = useRouter();
  const { organizations: organizationList, getOrganizations } =
    useGetUserOrganizations();
  const [isOpen, setOpen] = useState(false);

  const form = useForm<z.infer<typeof newEventSchema>>({
    resolver: zodResolver(newEventSchema),
    defaultValues: {
      startDateTime: formateJSDate(new Date()),
      endDateTime: formateJSDate(new Date()),
    },
  });

  const startDate = form.watch("startDateTime");
  const endDate = form.watch("endDateTime");

  function formatDate(date: Date): string {
    return date.toISOString();
  }
  const formattedList: OrganizationListType[] = useMemo(() => {
    const restructuredList = organizationList?.map(
      ({ id, organizationName }) => {
        return { value: String(id), label: organizationName };
      }
    );
    return _.uniqBy(restructuredList, "value");
  }, [organizationList]);

  async function onSubmit(values: z.infer<typeof newEventSchema>) {
   
    const today = new Date();

    const newPromise = new Promise(async (resolve) => {
      if (values?.eventPoster && values?.eventPoster[0]) {
        const image = await uploadFile(values?.eventPoster[0], "image");
        resolve(image);
      } else if (typeof values?.eventPoster === "string") {
        resolve(values?.eventPoster);
      } else {
        resolve(null);
      }
    });
    const eventImage: any = await newPromise;

    const eventAlias = generateAlias();
    await createEvent({
      ...values,
      expectedParticipants: Number(values?.expectedParticipants),
      eventAlias,
      eventPoster: eventImage,
      createdBy: String(userData?.id)!,
      published: false,
      eventStatus: "new",
      eventAppAccess: formatDate(
        new Date(today.getTime() - 24 * 60 * 60 * 1000)
      ),
      eventStatusDetails: [
        {
          createdAt: today.toISOString(),
          status: "new",
          user: userData?.userEmail!,
        },
      ],
    });
  }

  function onClose() {
    setOpen((prev) => !prev);
  }

  const countriesList = useMemo(() => {
    return COUNTRY_CODE.map((country) => ({
      label: country.name,
      value: country.name,
    }));
  }, []);

  const poster = form.watch("eventPoster");

  const image = useMemo(() => {
    if (typeof poster === "string") {
      return poster;
    } else if (poster && poster[0]) {
      return URL.createObjectURL(poster[0]);
    } else {
      return "";
    }
  }, [poster]);

  return (
    <>
      <div className="bg-[#EEF0FF] fixed overflow-y-auto w-full h-full">
        <div className="px-4 max-w-4xl py-6 h-fit mx-auto ">
          <h2 className="font-semibold text-basePrimary text-center mb-4 text-lg sm:text-2xl">
            Create New Event
          </h2>

          <div className="flex flex-col w-full  rounded-lg h-fit  bg-white shadow py-7 px-3 sm:px-4">
            <div className="w-full flex items-center justify-between mb-3">
              <Button
                onClick={() => router.back()}
                className="px-0 w-fit h-fit"
              >
                <ArrowBack size={20} />
              </Button>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-8 items-start w-full  gap-3"
              >
                <div className="w-full md:col-span-3">
                  <div className="w-full rounded-lg p-4 bg-basePrimary bg-opacity-80 h-56 flex items-center justify-center relative">
                    <div className="w-full h-full bg-white/40 absolute inset-0"></div>
                    {image && (
                      <Image
                        src={image}
                        width={500}
                        height={500}
                        className="w-full h-56 inset-0 z-10 rounded-lg absolute"
                        alt=""
                      />
                    )}
                    <label
                      htmlFor="eventImageUpload"
                      className="relative bg-white/50 flex z-20 items-center gap-x-2 w-full px-4  rounded-md outline-none border border-white h-12"
                    >
                      <div className="bg-basePrimary  rounded-full text-white flex items-center justify-center h-9 w-9">
                        <div className="w-full h-full bg-white/40 absolute inset-0"></div>
                        <ImageAdd size={20} />
                      </div>
                      <span className="text-sm text-white">
                        Upload Event Thumbnail
                      </span>
                      <input
                        id="eventImageUpload"
                        type="file"
                        {...form.register("eventPoster")}
                        accept="image/*"
                        className="w-full h-full absolute inset-0 "
                        hidden
                      />
                    </label>
                  </div>
                </div>
                <div className="w-full flex flex-col items-start gap-y-3 md:col-span-5">
                  <FormField
                    control={form.control}
                    name="eventTitle"
                    render={({ field }) => (
                      <InputOffsetLabel label="Event Title">
                        <Input
                          type="text"
                          placeholder="Enter the event title"
                          {...field}
                          className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                        />
                      </InputOffsetLabel>
                    )}
                  />
                  <div className="w-full flex items-center gap-x-2">
                    <FormField
                      control={form.control}
                      name="organisationId"
                      render={({ field }) => (
                        <FormItem className="w-full relative">
                          <ReactSelect
                            {...field}
                            placeHolder="Select a Workspace"
                            label="Workspace"
                            options={formattedList}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onClose();
                      }}
                      className="hover:bg-basePrimary  text-basePrimary  rounded-md border border-basePrimary hover:text-gray-50 gap-x-2 h-11 sm:h-12 font-medium"
                    >
                      <PlusCircle size={22} />
                      <p>Workspace</p>
                    </Button>
                  </div>

                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-2">
                    <FormField
                      control={form.control}
                      name="startDateTime"
                      render={() => (
                        <InputOffsetLabel label="Start date and time">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault()
                              setStartDate((prev) => !prev)
                            }}
                            role="button"
                            className="w-full relative h-12"
                          >
                            <button className="absolute left-3 top-[0.6rem]">
                              <DateRange size={22} className="text-gray-600" />
                            </button>
                            <Input
                              placeholder=" Start Date Time"
                              type="text"
                              {...form.register("startDateTime")}
                              className="placeholder:text-sm pl-10 pr-4 h-12 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700 accent-basePrimary"
                            />
                            {isStartDate && (
                              <SelectDate
                                value={startDate}
                                className="sm:left-0 right-0"
                                name="startDateTime"
                                form={form}
                                close={() => setStartDate((prev) => !prev)}
                              />
                            )}
                          </div>
                        </InputOffsetLabel>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDateTime"
                      render={({ field }) => (
                        <InputOffsetLabel label="End date and time">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault()
                              setEndDate((prev) => !prev)
                            }}
                            role="button"
                            className="w-full relative h-12"
                          >
                            <button className="absolute left-3 top-[0.6rem]">
                              <DateRange size={22} className="text-gray-600" />
                            </button>
                            <Input
                              placeholder="End Date Time"
                              type="text"
                              {...form.register("endDateTime")}
                              className="placeholder:text-sm pl-10 pr-4 h-12 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700 accent-basePrimary"
                            />
                            {/** */}
                            {isEndDate && (
                              <SelectDate
                                value={endDate}
                                form={form}
                                name="endDateTime"
                                close={() => setEndDate((prev) => !prev)}
                              />
                            )}
                          </div>
                        </InputOffsetLabel>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="expectedParticipants"
                    render={({ field }) => (
                      <InputOffsetLabel label="Expected No of Participants">
                        <Input
                          type="number"
                          placeholder="Enter the number of expected participants"
                          {...field}
                          className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                        />
                      </InputOffsetLabel>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventAddress"
                    render={({ field }) => (
                      <InputOffsetLabel label="Event Address">
                        <Input
                          type="text"
                          placeholder="Enter Event Address"
                          {...field}
                          className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                        />
                      </InputOffsetLabel>
                    )}
                  />
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-2">
                    <FormField
                      control={form.control}
                      name="eventCity"
                      render={({ field }) => (
                        <InputOffsetLabel label="Event City">
                          <Input
                            type="text"
                            placeholder="Enter City"
                            {...field}
                            className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                          />
                        </InputOffsetLabel>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventCountry"
                      render={({ field }) => (
                        <FormItem className="w-full relative">
                          <ReactSelect
                            {...field}
                            placeHolder="Select the Country"
                            label="Event Country"
                            options={countriesList}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="locationType"
                    render={({ field }) => (
                      <FormItem className="w-full relative">
                        <ReactSelect
                          {...field}
                          placeHolder="Select the Location Type"
                          label="Location Type"
                          options={[
                            { value: "Hybrid", label: "Hybrid" },
                            { value: "Onsite", label: "Onsite" },
                            { value: "Virtual", label: "Virtual" },
                          ]}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    disabled={loading}
                    className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
                  >
                    {loading && (
                      <LoaderAlt size={22} className="animate-spin" />
                    )}
                    <span>Create Event</span>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {isOpen && (
        <CreateOrganization close={onClose} refetch={getOrganizations} />
      )}
    </>
  );
}

function SelectDate<T>({
  className,
  form,
  close,
  name,
  value,
}: {
  form: UseFormReturn<z.infer<typeof newEventSchema>, any, any>;
  close: () => void;
  className?: string;
  name: any;
  value: string;
}) {
  const selectedDate = useMemo(() => {
    return parseFormattedDate(value);
  }, [value]);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault()
      }}
      className={cn(
        "absolute left-0 sm:-left-24 md:left-[-8rem] top-[3.2rem]",
        className
      )}
    >
      <button
         onClick={(e) => {
          e.stopPropagation();
          e.preventDefault()
          close()
        }}
        className="w-full h-full inset-0 fixed z-20"
      ></button>
      <div className="relative z-50 w-fit">
        <DatePicker
          selected={selectedDate}
          showTimeSelect
          minDate={new Date()}
          onChange={(date) => {
            form.setValue(name, formateJSDate(date!));
          }}
          inline
        />
      </div>
    </div>
  );
}
