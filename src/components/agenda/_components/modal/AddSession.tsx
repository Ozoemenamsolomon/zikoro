"use client";

import { Form, FormField, Input, Button, ReactSelect } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { useForm } from "react-hook-form";
import { activityType, sessionType } from "..";
import { cn } from "@/lib";
import { useGetEventAttendees, useFetchPartners } from "@/hooks";
import { useEffect, useMemo, useState } from "react";
import { TAttendee, TPartner } from "@/types";

import { BoothStaffWidget } from "@/components/partners/sponsors/_components";

export function AddSession({ eventId, close }: {close:() => void; eventId: string }) {
  const { attendees } = useGetEventAttendees(eventId);
  const { data }: { data: TPartner[] } = useFetchPartners(eventId);
  const [chosenModerators, setChosenModerators] = useState<TAttendee[]>([]);
  const [chosenSpeakers, setChosenSpeakers] = useState<TAttendee[]>([]);
  const [chosenSponsors, setChosenSponsors] = useState<TPartner[]>([]);
  const form = useForm({});

  const selectedSpeaker = form.watch("speaker");
  const selectedModerator = form.watch("moderator");
  const selectedSponsor = form.watch("sponsor");

  // sponsor
  const sponsors = useMemo(() => {
    const filtered = data?.filter(({ partnerType }) => {
      return partnerType === "sponsor";
    });

    return filtered?.map(({ companyName }) => {
      return {
        label: companyName,
        value: companyName,
      };
    });
  }, [data]);
  // moderators
  const moderators = useMemo(() => {
    const filtered = attendees?.filter(({ ticketType }) => {
      return ticketType === "moderator";
    });
    return filtered?.map(({ firstName, lastName, email }) => {
      return {
        label: `${firstName} ${lastName}`,
        value: email,
      };
    });
  }, [attendees]);

  // speakers
  const speakers = useMemo(() => {
    const filtered = attendees?.filter(({ ticketType }) => {
      return ticketType === "speaker";
    });
    return filtered?.map(({ firstName, lastName, email }) => {
      return {
        label: `${firstName} ${lastName}`,
        value: email,
      };
    });
  }, [attendees]);

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

  // delete a  selected attendees
  function removeSpeaker(email: string) {
    setChosenSpeakers(chosenSpeakers.filter((v) => v.email !== email));
  }
  // delete a  selected attendees
  function removeModerator(email: string) {
    setChosenModerators(chosenModerators.filter((v) => v.email !== email));
  }
  return (
    <div 
    onClick={close}
    role="button"

    className="w-full h-full fixed inset-0 z-[300] bg-black/50">
      <div 
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="py-6 px-4 w-[95%] max-w-2xl m-auto rounded-lg bg-white absolute inset-0 overflow-y-auto max-h-[85%] h-fit">
        <div className="flex mb-4 items-center justify-between w-full">
          <h2 className="font-semibold text-lg sm:text-2xl">Add Session</h2>
          <Button
          onClick={close}
          >
            <CloseOutline size={22} />
          </Button>
        </div>

        <Form {...form}>
          <form className="flex items-start flex-col justify-start gap-y-4 w-full">
            <div className="flex flex-col w-full items-start justify-start gap-y-1">
              <p className="text-xs text-gray-500 sm:text-[13px]">
                Select the type of activity you are creating
              </p>
              <div className="w-full grid-cols-5 items-center grid ">
                {activityType?.map((value, index, arr) => (
                  <FormField
                    key={value}
                    control={form.control}
                    name="activityType"
                    render={({ field }) => (
                      <label
                        className={cn(
                          "h-11 w-full border-y flex items-center justify-center border-gray-700",
                          index === 0
                            ? "border-l border-r rounded-l-md"
                            : "border-r",
                            index === arr?.length - 1 && "rounded-r-md",
                          form.watch("activityType") === value &&
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
                    className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <div className=" gap-4 w-full grid grid-cols-1 sm:grid-cols-2 items-center relative">
              <FormField
                control={form.control}
                name="startDateTime"
                render={() => (
                  <InputOffsetLabel label="Start Time">
                    <Input
                      placeholder=""
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
                  <InputOffsetLabel label="End Time">
                    <Input
                      placeholder=""
                      type="datetime-local"
                      {...form.register("endDateTime")}
                      className="placeholder:text-sm h-12 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
            </div>

            <div className="flex flex-col w-full items-start justify-start gap-y-1">
              <p className="text-xs text-gray-500 sm:text-[13px]">
                Select Session Type
              </p>
              <div className="w-full grid-cols-5 items-center grid ">
                {sessionType?.map((value, index, arr) => (
                  <FormField
                    key={value}
                    control={form.control}
                    name="sessionType"
                    render={({ field }) => (
                      <label
                        className={cn(
                          "h-11 w-full border-y flex items-center justify-center border-gray-700",
                          index === 0
                          ? "border-l border-r rounded-l-md"
                          : "border-r",
                          index === arr?.length - 1 && "rounded-r-md",
                        form.watch("sessionType") === value &&
                          "bg-basePrimary/20 border-basePrimary"
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
              name="speaker"
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  placeHolder="Select Speaker"
                  label="Speaker"
                  options={speakers}
                />
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
              name="moderator"
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  placeHolder="Select Moderator"
                  label="Moderator"
                  options={moderators}
                />
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
              name="file"
              render={({ field }) => (
                <InputOffsetLabel label=" File">
                  <Input
                    type="file"
                    accept="application/pdf,.docx,.doc"
                    placeholder="File"
                    {...form.register("file")}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />

            <Button
              disabled={false}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
            >
              {"" && <LoaderAlt size={22} className="animate-spin" />}
              <span>Save</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
