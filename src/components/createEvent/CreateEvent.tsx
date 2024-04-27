"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, Input, Button, ReactSelect } from "@/components";
import { newEventSchema } from "@/schemas";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateAndTimeAdapter } from "@/context/DateAndTimeAdapter";
import { useMemo, useState } from "react";
import { COUNTRY_CODE } from "@/utils";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { useCreateEvent, getCookie, useGetUserOrganizations } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import InputOffsetLabel from "../InputOffsetLabel";
import _ from "lodash";
import { CreateOrganization } from "../eventHome";

type OrganizationListType = {
  label: string;
  value: any;
};

export default function CreateEvent() {
  const { createEvent, loading } = useCreateEvent();
  const { organizations: organizationList } = useGetUserOrganizations();
  const [isOpen, setOpen] = useState(false);

  const form = useForm<z.infer<typeof newEventSchema>>({
    resolver: zodResolver(newEventSchema),
  });

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
    const userData = getCookie("user");
    const today = new Date();
    const eventAlias = uuidv4().replace(/-/g, "").substring(0, 20);
    await createEvent({
      ...values,
      expectedParticipants: Number(values?.expectedParticipants),
      eventAlias,
      createdBy: userData?.id,
      published: false,
      eventStatus: "new",
      eventAppAccess: formatDate(
        new Date(today.getTime() - 24 * 60 * 60 * 1000)
      ),
      eventStatusDetails: [
        {
          createdAt: today.toISOString(),
          status: "new",
          user: userData?.userEmail,
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
  }, [COUNTRY_CODE]);

  return (
    <DateAndTimeAdapter>
      <>
        <div className="w-full flex flex-col gap-y-1 mb-6 items-start justify-start">
          <h2 className="font-medium text-lg sm:text-xl">Create New Event</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start w-full flex-col gap-y-3"
          >
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
                  <ReactSelect
                    {...field}
                    placeHolder="Select an Organization"
                    label="Organization"
                    options={formattedList}
                  />
                )}
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="hover:bg-basePrimary  text-basePrimary  rounded-md border border-basePrimary hover:text-gray-50 gap-x-2 h-11 sm:h-12 font-medium"
              >
                <PlusCircle size={22} />
                <p>Organization</p>
              </Button>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-2">
              <FormField
                control={form.control}
                name="startDateTime"
                render={() => (
                  <InputOffsetLabel label="Start date and time">
                    <Input
                      placeholder="Enter event title"
                      type="datetime-local"
                      {...form.register("startDateTime")}
                      className="placeholder:text-sm h-12 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700 accent-basePrimary"
                    />
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="endDateTime"
                render={({ field }) => (
                  <InputOffsetLabel label="End date and time">
                    <Input
                      placeholder="Enter event title"
                      type="datetime-local"
                      {...form.register("endDateTime")}
                      className="placeholder:text-sm h-12 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700 accent-basePrimary"
                    />
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
                  <ReactSelect
                    {...field}
                    placeHolder="Select the Country"
                    label="Event Country"
                    options={countriesList}
                  />
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="locationType"
              render={({ field }) => (
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
              )}
            />

            <Button
              disabled={loading}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <span>Create Event</span>
            </Button>
          </form>
        </Form>

        {isOpen && <CreateOrganization close={onClose} />}
      </>
    </DateAndTimeAdapter>
  );
}
