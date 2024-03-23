"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  Input,
  InputOffsetLabel,
  Button,
  ReactSelect,
} from "@/components";
import { newEventSchema } from "@/schemas";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@auth0/nextjs-auth0/client";
import { DateAndTimeAdapter } from "@/context/DateAndTimeAdapter";
import { useState, useMemo } from "react";
import { COUNTRY_CODE } from "@/utils";
import { useCreateEvent } from "@/hooks";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";

export default function CreateEvent({
  organizationId,
}: {
  organizationId: string;
}) {
  const [isStartDateOpen, setIsStartDateOpen] = useState<boolean>(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState<boolean>(false);
  const [startDateValue, setStartDateValue] = useState<string | null>(null);
  const [endDateValue, setEndDateValue] = useState<string | null>(null);
  const { createEvent, loading } = useCreateEvent();
  const { user } = useUser();

  const form = useForm<z.infer<typeof newEventSchema>>({
    resolver: zodResolver(newEventSchema),
  });

  async function onSubmit(values: z.infer<typeof newEventSchema>) {
    const eventAlias = uuidv4().replace(/-/g, "").substring(0, 20);
    await createEvent({
      ...values,
      startDateTime: startDateValue,
      endDateTime: endDateValue,
      eventAlias,
      organisationId: organizationId,
    });
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
            <div className="w-full grid grid-cols-2 items-center gap-2">
              <FormField
                control={form.control}
                name="startDateTime"
                render={() => (
                  <InputOffsetLabel label="Start date and time">
                    <DateTimePicker
                      open={isStartDateOpen}
                      onOpen={() => setIsStartDateOpen(!isStartDateOpen)}
                      onClose={() => setIsStartDateOpen(!isStartDateOpen)}
                      value={startDateValue}
                      onChange={(newValue) => {
                        setStartDateValue(newValue);
                      }}
                      slotProps={{
                        textField: {
                          // required: true,
                          placeholder: "Pick date and time",
                          InputProps: {
                            className: "flex flex-row-reverse text-sm",
                            endAdornment: (
                              <img
                                src={"/date-time.svg"}
                                alt="calendar-icon"
                                width={25}
                                height={25}
                                className="cursor-pointer"
                                onClick={() =>
                                  setIsStartDateOpen(!isStartDateOpen)
                                }
                              />
                            ),
                          },
                        },
                      }}
                      sx={{
                        width: "100%",

                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#f3f3f3",
                          },
                          "&:hover fieldset": {
                            borderColor: "#f3f3f3",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                    />
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="endDateTime"
                render={({ field }) => (
                  <InputOffsetLabel label="End date and time">
                    <DateTimePicker
                      open={isEndDateOpen}
                      onOpen={() => setIsEndDateOpen(!isEndDateOpen)}
                      onClose={() => setIsEndDateOpen(!isEndDateOpen)}
                      value={endDateValue}
                      onChange={(newValue) => {
                        setEndDateValue(newValue);
                      }}
                      slotProps={{
                        textField: {
                          // required: true,
                          placeholder: "Pick date and time",
                          InputProps: {
                            className: "flex flex-row-reverse",
                            endAdornment: (
                              <img
                                src={"/date-time.svg"}
                                alt="calendar-icon"
                                width={25}
                                height={25}
                                className="cursor-pointer"
                                onClick={() => setIsEndDateOpen(!isEndDateOpen)}
                              />
                            ),
                          },
                        },
                      }}
                      sx={{
                        width: "100%",

                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#f3f3f3",
                          },
                          "&:hover fieldset": {
                            borderColor: "#f3f3f3",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
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
            <div className="w-full grid grid-cols-2 items-center gap-2">
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
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-zikoro h-12 rounded-md text-gray-50 font-medium"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <span>Create Event</span>
            </Button>

            {/**
           <div className="w-full flex items-center gap-x-1 justify-center">
            <p>Already have an account?</p>
            <Link href="/login" className="text-zikoro font-medium">
              Sign in
            </Link>
          </div>
         */}
          </form>
        </Form>
      </>
    </DateAndTimeAdapter>
  );
}
