"use client";

import {
  Form,
  FormField,
  Input,
  Button,
  ReactSelect,
  Textarea,
} from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { CloseOutline } from "styled-icons/evaicons-outline";
import { useForm, UseFormReturn } from "react-hook-form";
import { AddTrack, activityType, sessionType } from "..";
import { CloseCircle } from "styled-icons/evaicons-solid";
import DatePicker from "react-datepicker";
import { cn } from "@/lib";
import { Portal } from "@/components";
import { DateRange } from "styled-icons/material-outlined";
import {
  useGetEventAttendees,
  useFetchPartners,
  useCreateAgenda,
  useUpdateAgenda,
  useGetQuizzes,
} from "@/hooks";
import { useEffect, useMemo, useState } from "react";
import { TAttendee, TExPartner, TAgenda, TPartner } from "@/types";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sessionSchema } from "@/schemas";
import Image from "next/image";
import { Event } from "@/types";
import { BoothStaffWidget } from "@/components/partners/sponsors/_components";
import { PlusCircle } from "styled-icons/bootstrap";
import { nanoid } from "nanoid";
import { formateJSDate, formatFileSize, generateAlias, parseFormattedDate, uploadFile } from "@/utils";
import { FilePdf } from "styled-icons/fa-regular";
import { TEngagementFormQuestion } from "@/types/engagements";
import { useGetData } from "@/hooks/services/request";

type TSessionFile<T> = {
  size: string;
  file: T;
  name: string;
  id: string;
};

function SelectDate({
  className,
  form,
  close,
  name,
  value,
  minimumDate,
  maximumDate
}: {
  form: UseFormReturn<z.infer<typeof sessionSchema>, any, any>;
  close: () => void;
  className?: string;
  name: any;
  value: string;
  minimumDate?: Date;
  maximumDate?:Date
}) {
  const selectedDate = useMemo(() => {
    return parseFormattedDate(value);
  }, [value]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      className={cn(
        "absolute left-0 sm:left-0 md:left-0 top-[3.0rem]",
        className
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          close();
        }}
        className="w-full h-full inset-0 fixed z-[70]"
      ></button>
      <div className="relative z-[80] w-[320px]">
        <DatePicker
          selected={selectedDate}
          showTimeSelect
          minDate={minimumDate || new Date()}
          maxDate={maximumDate || new Date()}
          onChange={(date) => {
            // console.log(formateJSDate(date!));
            form.setValue(name, formateJSDate(date!));
          }}
          inline
        />
      </div>
    </div>
  );
}

export function AddSession({
  eventId,
  eventStartDate,
  close,
  event,
  refetch,
  session,
  refetchSession,
}: {
  close: () => void;
  eventId: string;
  eventStartDate?: string;
  event?: Event | null;
  refetch?: () => Promise<any>;
  refetchSession?: () => Promise<any>;
  session?: TAgenda;
}) {
  const { attendees } = useGetEventAttendees(eventId);
  const { data }: { data: TPartner[] } = useFetchPartners(eventId);
  const { createAgenda } = useCreateAgenda();
  const { updateAgenda } = useUpdateAgenda();
  const [loading, setLoading] = useState(false);
  const [chosenModerators, setChosenModerators] = useState<TAttendee[]>([]);
  const { quizzes } = useGetQuizzes(eventId);
  const [isStartDate, setStartDate] = useState(false);
  const [isEndDate, setEndDate] = useState(false);
  const { data: forms } = useGetData<TEngagementFormQuestion[]>(
    `/engagements/${eventId}/form`
  );
  const [chosenSpeakers, setChosenSpeakers] = useState<TAttendee[]>([]);
  const [chosenSponsors, setChosenSponsors] = useState<any[]>([]); // don't forget to resolve the type issue here
  const [chosenFiles, setChosenFiles] = useState<TSessionFile<File | string>[]>(
    []
  );
  const [active, setActive] = useState(1);
  const [isNotSameDay, setIsNotSameDay] = useState(false);

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      activity: "Custom",
    },
  });

  const selectedSpeaker = form.watch("sessionSpeakers");
  const selectedModerator = form.watch("sessionModerators");
  const selectedSponsor = form.watch("sessionSponsors");
  const addedFile = form.watch("sessionFiles");
  const startTime = form.watch("startDateTime");
  const endTime = form.watch("endDateTime");
  const activity = form.watch("activity");
  const locationType = form.watch("sessionType");


  const minStartDate = useMemo(() => {
    if (event?.startDateTime) {
      return parseFormattedDate(event?.startDateTime)
    }
    else return new Date()
  },[event])

  const minEndDate = useMemo(() => {
    if (event?.endDateTime) {
      return parseFormattedDate(event?.endDateTime)
    }
    else return new Date()
  },[event])

  const startDate = useMemo(() => {
    if (startTime) {
      form.setValue("startDateTime", formateJSDate(startTime));
      return formateJSDate(startTime);
    } else {
      form.setValue("startDateTime", formateJSDate(new Date()));
      return formateJSDate(new Date());
    }
  }, [startTime]);

  const endDate = useMemo(() => {
    if (endTime) {
      form.setValue("endDateTime", formateJSDate(endTime));
      return formateJSDate(endTime);
    } else {
      form.setValue("endDateTime", formateJSDate(new Date()));
      return formateJSDate(new Date());
    }
  }, [endTime]);

  const endMinMaxDate = useMemo(() => {
    if (startDate) {
      return parseFormattedDate(startDate)
    }
    else return new Date()
  },[startDate])

  // set other activity
  useEffect(() => {
    if (activity !== "Custom") {
      form.setValue("sessionTitle", activity);
    }
  }, [activity]);

  // sponsor
  const sponsors = useMemo(() => {
    const filtered = data?.filter(({ companyLogo }) => {
      return companyLogo;
    });

    return filtered?.map(({ companyName }) => {
      return {
        label: companyName,
        value: companyName,
      };
    });
  }, [data]);
  // moderators

  const formattedAttendees = useMemo(() => {
    return attendees?.map(({ firstName, lastName, email }) => {
      return {
        label: `${firstName} ${lastName}`,
        value: email,
      };
    });
  }, [attendees]);

  // session tracks
  const formattedSessions = useMemo(() => {
    if (Array.isArray(event?.sessionTrack) && event?.sessionTrack?.length > 0) {
      return event?.sessionTrack?.map(({ name }) => {
        return {
          value: name,
          label: name,
        };
      });
    } else {
      return [];
    }
  }, [event?.sessionTrack]);

  // // start date
  // useEffect(() => {
  //   if (eventStartDate) {
  //     form.setValue("startDateTime", eventStartDate);
  //     form.setValue("endDateTime", eventStartDate);
  //   }
  // }, [eventStartDate]);

  // adding speakers
  useEffect(() => {
    if (selectedSpeaker) {
      // check if speaker is already selected
      const isSpeakerAlreadyPresent = chosenSpeakers?.some(
        ({ email }) => email === selectedSpeaker
      );

      // return if speaker is already selected
      if (isSpeakerAlreadyPresent) return;

      // get the speaker from the attendees array
      const presentAttendee = attendees?.find(
        ({ email }) => email === selectedSpeaker
      );

      if (presentAttendee)
        setChosenSpeakers((prev) => [...prev, presentAttendee]);
    }
  }, [selectedSpeaker]);

  // adding moderators
  useEffect(() => {
    if (selectedModerator) {
      // check if moderator is already selected
      const isModeratorAlreadyPresent = chosenModerators?.some(
        ({ email }) => email === selectedModerator
      );

      // return if moderator is already selected
      if (isModeratorAlreadyPresent) return;

      // get the moderator from the attendees array
      const presentAttendee = attendees?.find(
        ({ email }) => email === selectedModerator
      );

      if (presentAttendee)
        setChosenModerators((prev) => [...prev, presentAttendee]);
    }
  }, [selectedModerator]);

  // adding sponsor
  useEffect(() => {
    if (selectedSponsor) {
      // check if sponsor is already selected
      const isSponsorAlreadyPresent = chosenSponsors?.some(
        ({ companyName }) => companyName === selectedSponsor
      );

      // return if sponsor is already selected
      if (isSponsorAlreadyPresent) return;

      // get the speaker from the attendees array
      const presentSponsor = data?.find(
        ({ companyName }) => companyName === selectedSponsor
      );

      if (presentSponsor)
        setChosenSponsors((prev) => [...prev, presentSponsor]);
    }
  }, [selectedSponsor]);

  //sessionFiles
  useEffect(() => {
    if (addedFile?.length > 0) {
      const pdfFile: FileList = addedFile;
      for (let i = 0; i < pdfFile.length; i++) {
        let file = pdfFile[i];
        setChosenFiles((prev) => [
          ...prev,
          {
            name: file?.name,
            file: file,
            size: formatFileSize(file.size),
            id: nanoid(),
          },
        ]);
      }
    }
  }, [addedFile]);

  // delete a  selected attendees
  function removeSpeaker(email: string) {
    setChosenSpeakers(chosenSpeakers.filter((v) => v.email !== email));
  }
  // delete a  selected attendees
  function removeModerator(email: string) {
    setChosenModerators(chosenModerators.filter((v) => v.email !== email));
  }

  // remove selected file
  function removeFile(id: string) {
    setChosenFiles(chosenFiles.filter((v) => v.id !== id));
  }

  async function onSubmit(values: z.infer<typeof sessionSchema>) {

    if (isNotSameDay) return;


    let engagementType = null;
    if (
      Array.isArray(quizzes) ||
      Array.isArray(forms) ||
      values?.engagementAlias
    ) {
      const filteredQuizzes =
        quizzes?.filter((quiz) => !quiz?.accessibility?.disable) || [];
      const filteredForms = forms?.filter((form) => !form?.isActive) || [];

      const fq = filteredQuizzes?.find(
        (v) => v?.quizAlias === values?.engagementAlias
      )?.interactionType;
      engagementType = fq || "form" || null;
    }

    let files: TSessionFile<string>[] = [];
    setLoading(true);
    if (chosenFiles?.length > 0) {
      const promise = chosenFiles?.map((item) => {
        const { file, ...restItems } = item;
        return new Promise(async (resolve) => {
          if (typeof file === "string") {
            resolve({ ...restItems, file });
          } else {
            const fileString = await uploadFile(file, "pdf");
            resolve({ ...restItems, file: fileString });
          }
        });
      });

      const result: any[] = await Promise.all(promise);

      files = result;
    }

    const sessionAlias = generateAlias();

    let sessionData: any;
    if (session) {
      const { isMyAgenda, ...restData } = session;
      sessionData = restData;
    }

    console.log("ffff", sessionData)

    const payload: Partial<TAgenda> = session?.id
      ? {
          ...sessionData,
          ...values,
          Track: values?.Track || "No Track",
          sessionModerators: chosenModerators,
          sessionSpeakers: chosenSpeakers,
          sessionSponsors: chosenSponsors,
          sessionFiles: files,
          eventAlias: event?.eventAlias,
          eventId: String(event?.id),
          engagementType,
        }
      : {
          ...values,
          Track: values?.Track || "No Track",
          sessionModerators: chosenModerators,
          sessionSpeakers: chosenSpeakers,
          sessionSponsors: chosenSponsors,
          sessionFiles: files,
          sessionAlias,
          eventAlias: event?.eventAlias,
          eventId: String(event?.id),
          engagementType,
        };


        // console.log({chosenModerators, chosenSpeakers, chosenSponsors})
       console.log({payload})

        // return   setLoading(false);

    // return
    const asyncFn = session?.id ? updateAgenda : createAgenda;
    await asyncFn({ payload });
    setLoading(false);
    if (refetchSession) refetchSession();
    close();
  }

  console.log("form values", form.getValues())

   //
   useEffect(() => {
    if (startTime && endTime) {
      const start = startTime.split(" ")[0];
      const end = endTime.split(" ")[0];
      if (start !== end) {
        setIsNotSameDay(true);
      } else {
        setIsNotSameDay(false);
      }
    }
  }, [startTime, endTime]);

  // to update
  useEffect(() => {
    if (session) {
      form.reset({
        sessionTitle: session?.sessionTitle,
        startDateTime: session?.startDateTime,
        endDateTime: session?.endDateTime,
        activity: session?.activity,
        description: session?.description,
        sessionType: session?.sessionType,
        sessionUrl: session?.sessionUrl ?? "",
        sessionVenue: session?.sessionVenue ?? "",
        Track: session?.Track ?? "No Track",
      });

      if (Array.isArray(session?.sessionSpeakers)) {
        setChosenSpeakers(session?.sessionSpeakers);
      }
      if (Array.isArray(session?.sessionModerators)) {
        setChosenModerators(session?.sessionModerators);
      }
      if (Array.isArray(session?.sessionSponsors)) {
        setChosenSponsors(session?.sessionSponsors);
      }
      if (Array.isArray(session?.sessionFiles)) {
        setChosenFiles(session?.sessionFiles);
      }
    }
  }, [session]);

  const engagements = useMemo(() => {
    if (Array.isArray(quizzes) || Array.isArray(forms)) {
      const filteredQuizzes =
        quizzes?.filter((quiz) => !quiz?.accessibility?.disable) || [];
      const filteredForms = forms?.filter((form) => !form?.isActive) || [];
      const quizSelect = filteredQuizzes?.map((v) => {
        return {
          value: v?.quizAlias,
          label: v?.coverTitle,
        };
      });
      const formSelect = filteredForms?.map((v) => {
        return {
          value: v?.formAlias,
          label: v?.title,
        };
      });

      return [...quizSelect, ...formSelect];
    }
    return [];
  }, [quizzes, forms]);

  const prevengagement = useMemo(() => {
    if ((Array.isArray(quizzes) || Array.isArray(forms)) && session) {
      const filteredQuizzes =
        quizzes?.filter((quiz) => !quiz?.accessibility?.disable) || [];
      const filteredForms = forms?.filter((form) => !form?.isActive) || [];
      const quizSelect = filteredQuizzes?.map((v) => {
        return {
          value: v?.quizAlias,
          label: v?.coverTitle,
        };
      });
      const formSelect = filteredForms?.map((v) => {
        return {
          value: v?.formAlias,
          label: v?.title,
        };
      });

      const newArray = [...quizSelect, ...formSelect];

      return newArray?.find((v) => v?.value === session?.engagementAlias) || "";
    }
    return "";
  }, [quizzes, forms, session]);

  return (
    <Portal>
      <div
        //  onClick={close}
        role="button"
        className="w-full h-full fixed inset-0 z-[300] bg-black/50"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={cn(
            "py-6 px-4 w-[95%] max-w-2xl m-auto rounded-lg bg-white absolute inset-0 overflow-y-auto max-h-[85%] h-fit",
            active === 2 && "hidden"
          )}
        >
          <div className="flex mb-4 items-center justify-between w-full">
            <h2 className="font-semibold text-lg sm:text-2xl">Add Session</h2>
            <Button onClick={close}>
              <CloseOutline size={22} />
            </Button>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-start flex-col justify-start gap-y-4 w-full"
            >
              <div className="flex flex-col w-full items-start justify-start gap-y-1">
                <p className="text-xs text-gray-500 sm:text-[13px]">
                  Select the type of activity you are creating
                </p>
                <div className="w-full grid-cols-5 items-center grid ">
                  {activityType?.map((value, index, arr) => (
                    <FormField
                      key={value}
                      control={form.control}
                      name="activity"
                      render={({ field }) => (
                        <label
                          className={cn(
                            "h-12 w-full border-y border-r flex items-center justify-center border-gray-700",
                            index === 0 ? "border-l  rounded-l-md" : "",
                            index === arr?.length - 1 && "rounded-r-md",
                            form.watch("activity") === value &&
                              "bg-basePrimary/20 border-basePrimary  "
                          )}
                        >
                          <span>{value}</span>
                          <input {...field} hidden value={value} type="radio" />
                        </label>
                      )}
                    />
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="sessionTitle"
                render={({ field }) => (
                  <InputOffsetLabel label="Title">
                    <Input
                      placeholder="Session Title"
                      type="text"
                      {...form.register("sessionTitle")}
                      className="placeholder:text-sm h-11 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
              <div className=" gap-4 w-full grid grid-cols-1 sm:grid-cols-2 items-center relative">
                {form.watch("startDateTime") && (
                  <FormField
                    control={form.control}
                    name="startDateTime"
                    render={() => (
                      <InputOffsetLabel label="Start Time">
                        <div
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setStartDate((prev) => !prev);
                        }}
                        role="button"
                        className="w-full relative h-11"
                      >
                        <button className="absolute left-3 top-[0.5rem]">
                          <DateRange size={22} className="text-gray-600" />
                        </button>
                        <Input
                          placeholder=" Start Time"
                          type="text"
                          {...form.register("startDateTime")}
                          className="placeholder:text-sm pl-11 pr-4 h-11 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700 accent-basePrimary"
                        />
                        {isStartDate && (
                          <SelectDate
                           value={startDate}
                           minimumDate={minStartDate}
                           maximumDate={minEndDate}
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
                )}

                <FormField
                  control={form.control}
                  name="endDateTime"
                  render={({ field }) => (
                    <InputOffsetLabel label="End Time">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setEndDate((prev) => !prev);
                        }}
                        role="button"
                        className="w-full relative h-11"
                      >
                        <button className="absolute left-3 top-[0.5rem]">
                          <DateRange size={22} className="text-gray-600" />
                        </button>
                        <Input
                          placeholder=" End Time"
                          type="text"
                          {...form.register("endDateTime")}
                          className="placeholder:text-sm pl-11 pr-4 h-11 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700 accent-basePrimary"
                        />
                        {isEndDate && (
                          <SelectDate
                           value={endDate}
                           minimumDate={endMinMaxDate}
                           maximumDate={endMinMaxDate}
                            className="sm:left-0 right-0"
                            name="endDateTime"
                            form={form}
                            close={() => setEndDate((prev) => !prev)}
                          />
                        )}
                      </div>
                    </InputOffsetLabel>
                  )}
                />
                 <p
                  className={cn(
                    "w-full text-xs col-span-full text-gray-500",
                    isNotSameDay && "text-red-500"
                  )}
                >
                  Start and End time must be the same day
                </p>
             
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <InputOffsetLabel label="Description">
                    <Textarea
                      placeholder="Enter the description"
                      {...form.register("description")}
                      className="placeholder:text-sm   placeholder:text-gray-400 text-gray-700"
                    ></Textarea>
                  </InputOffsetLabel>
                )}
              />
              {activity === "Custom" && (
                <>
                  <div className="w-full flex items-end gap-x-2">
                    <FormField
                      control={form.control}
                      name="Track"
                      render={({ field }) => (
                        <InputOffsetLabel label="Track">
                          <ReactSelect
                            {...form.register("Track")}
                            placeHolder="Select Track"
                            defaultValue={{
                              value: session?.Track,
                              label: session?.Track,
                            }}
                            label="Track"
                            options={formattedSessions}
                          />
                        </InputOffsetLabel>
                      )}
                    />
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setActive(2);
                      }}
                      className="hover:bg-basePrimary  text-basePrimary  rounded-md border border-basePrimary hover:text-gray-50 gap-x-2 h-[3.2rem] font-medium"
                    >
                      <PlusCircle size={22} />
                      <p>Track</p>
                    </Button>
                  </div>
                  <div className="flex flex-col w-full items-start justify-start gap-y-1">
                    <p className="text-xs text-gray-500 sm:text-[13px]">
                      Select Session Type
                    </p>
                    <div className="w-full grid-cols-3 items-center grid ">
                      {sessionType?.map((value, index, arr) => (
                        <FormField
                          key={value}
                          control={form.control}
                          name="sessionType"
                          render={({ field }) => (
                            <label
                              className={cn(
                                "h-12 w-full border-y flex items-center justify-center border-gray-700",
                                index === 0
                                  ? "border-l border-r rounded-l-md"
                                  : "border-r",
                                index === arr?.length - 1 && "rounded-r-md",
                                form.watch("sessionType") === value &&
                                  "bg-basePrimary/20 border-basePrimary"
                              )}
                            >
                              <span>{value}</span>
                              <input
                                {...field}
                                hidden
                                value={value}
                                type="radio"
                              />
                            </label>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {
                    <div
                      className={cn(
                        " gap-4 w-full grid grid-cols-1 items-center relative",
                        locationType &&
                          locationType === "Hybrid" &&
                          "sm:grid-cols-2"
                      )}
                    >
                      {locationType &&
                        (locationType === "Hybrid" ||
                          locationType === "Onsite") && (
                          <FormField
                            control={form.control}
                            name="sessionVenue"
                            render={() => (
                              <InputOffsetLabel label="Venue">
                                <Input
                                  placeholder=""
                                  type="text"
                                  {...form.register("sessionVenue")}
                                  className="placeholder:text-sm h-11 text-gray-700 accent-basePrimary"
                                />
                              </InputOffsetLabel>
                            )}
                          />
                        )}

                      {locationType &&
                        (locationType === "Hybrid" ||
                          locationType === "Virtual") && (
                          <FormField
                            control={form.control}
                            name="sessionUrl"
                            render={({ field }) => (
                              <InputOffsetLabel label="Meeting URL">
                                <Input
                                  placeholder=""
                                  type="text"
                                  {...form.register("sessionUrl")}
                                  className="placeholder:text-sm h-11 text-gray-700"
                                />
                              </InputOffsetLabel>
                            )}
                          />
                        )}
                    </div>
                  }
                  <FormField
                    control={form.control}
                    name="sessionSpeakers"
                    render={({ field }) => (
                      <InputOffsetLabel label="Speaker">
                        <ReactSelect
                          {...form.register("sessionSpeakers")}
                          placeHolder="Select Speaker"
                          label="Speaker"
                          options={formattedAttendees}
                        />
                      </InputOffsetLabel>
                    )}
                  />

                  <div className="w-full grid grid-cols-2 items-center gap-4">
                    {Array.isArray(chosenSpeakers) &&
                      chosenSpeakers.map(
                        ({
                          firstName,
                          lastName,
                          organization,
                          email,
                          jobTitle,
                          profilePicture,
                        }) => (
                          <BoothStaffWidget
                            key={email}
                            email={email}
                            remove={removeSpeaker}
                            image={profilePicture}
                            name={`${firstName} ${lastName}`}
                            company={organization}
                            profession={jobTitle}
                            isAddingBoothStaff
                          />
                        )
                      )}
                  </div>

                  <FormField
                    control={form.control}
                    name="sessionModerators"
                    render={({ field }) => (
                      <InputOffsetLabel label="Moderator">
                        <ReactSelect
                          {...form.register("sessionModerators")}
                          placeHolder="Select Moderator"
                          options={formattedAttendees}
                        />
                      </InputOffsetLabel>
                    )}
                  />
                  <div className="w-full grid grid-cols-2 items-center gap-4">
                    {Array.isArray(chosenModerators) &&
                      chosenModerators.map(
                        ({
                          firstName,
                          lastName,
                          organization,
                          email,
                          jobTitle,
                          profilePicture,
                        }) => (
                          <BoothStaffWidget
                            key={email}
                            email={email}
                            remove={removeModerator}
                            image={profilePicture}
                            name={`${firstName} ${lastName}`}
                            company={organization}
                            profession={jobTitle}
                            isAddingBoothStaff
                          />
                        )
                      )}
                  </div>

                  <FormField
                    control={form.control}
                    name="sessionSponsors"
                    render={({ field }) => (
                      <InputOffsetLabel label="Sponsor">
                        <ReactSelect
                          {...form.register("sessionSponsors")}
                          placeHolder="Select Sponsor"
                          options={sponsors}
                        />
                      </InputOffsetLabel>
                    )}
                  />
                  <p className="w-full text-xs col-span-full text-gray-500">
                    Only sponsors with logo will appear here
                  </p>
                  <div className="w-full flex flex-wrap items-start gap-4">
                    {Array.isArray(chosenSponsors) &&
                      chosenSponsors.map(({ companyLogo, companyName }) => (
                        <Image
                          src={companyLogo}
                          alt={companyName}
                          width={200}
                          height={100}
                          className=" w-[100px] object-contain h-[40px]"
                        />
                      ))}
                  </div>

                  <FormField
                    control={form.control}
                    name="sessionFiles"
                    render={({ field }) => (
                      <InputOffsetLabel label=" File">
                        <Input
                          type="file"
                          multiple
                          accept="application/pdf"
                          placeholder="File"
                          {...form.register("sessionFiles")}
                          className=" placeholder:text-sm h-12  text-gray-700"
                        />
                      </InputOffsetLabel>
                    )}
                  />

                  <div className="w-full grid grid-cols-2 gap-4 items-center">
                    {Array.isArray(chosenFiles) &&
                      chosenFiles?.map((item) => (
                        <div
                          key={item?.id}
                          className="w-full group border relative rounded-lg p-3 flex items-start justify-start gap-x-2"
                        >
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              removeFile(item?.id);
                            }}
                            className="sm:hidden block sm:group-hover:block w-fit h-fit px-0 absolute right-1 top-1 text-black"
                          >
                            <CloseCircle size={20} />
                          </Button>

                          <FilePdf size={25} className="text-red-500" />
                          <div className="space-y-1">
                            <p className="text-[13px] sm:text-sm text-gray-500">
                              {item?.name}
                            </p>
                            <p className="text-[11px] sm:text-xs text-gray-400">
                              {item?.size}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
              <FormField
                control={form.control}
                name="engagementAlias"
                render={({ field }) => (
                  <InputOffsetLabel label="Connect Engagement">
                    <ReactSelect
                      {...form.register("engagementAlias")}
                      placeHolder="Select Engagement"
                      defaultValue={prevengagement}
                      options={engagements}
                    />
                  </InputOffsetLabel>
                )}
              />

              <Button
                disabled={loading}
                className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
              >
                {loading && <LoaderAlt size={22} className="animate-spin" />}
                <span>Save</span>
              </Button>
            </form>
          </Form>
        </div>
      </div>
      {active === 2 && (
        <AddTrack
          close={close}
          refetch={refetch}
          eventId={eventId}
          sessionTrack={event?.sessionTrack}
          setActive={setActive}
        />
      )}
    </Portal>
  );
}
