"use client";

import { Form, FormField, Input, Button } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { ArrowBackOutline } from "@styled-icons/evaicons-outline/ArrowBackOutline";
import { useForm } from "react-hook-form";
import { CirclePicker } from "react-color";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import React, { useState } from "react";
import { CreatedPreview } from "@/components/composables";
import { toast } from "@/components/ui/use-toast";
import { useUpdateEvent } from "@/hooks";

type FormValue = {
  name: string;
};

type TrackType = {
  name: string;
  color: string;
};
export function AddTrack({
  setActive,
  close,
  eventId,
  sessionTrack,
  refetch,
}: {
  close: () => void;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  eventId: string;
  sessionTrack?: TrackType[];
  refetch?: () => Promise<any>;
}) {
  const form = useForm<FormValue>();
  const [trackColor, settrackColor] = useState<string>("");
  const { loading, update: addSessionTrack } = useUpdateEvent();
  //  const { loading, createEventIndustry } = useCreateEventIndustry();

  async function onSubmit(value: FormValue) {
    if (trackColor === "" || value.name === undefined) {
      toast({
        variant: "destructive",
        description: "Pls, Select a Color or Name",
      });
      return;
    }
    const payload =
      Array.isArray(sessionTrack) && sessionTrack.length > 0
        ? [...sessionTrack, { name: value?.name, color: trackColor }]
        : [{ name: value?.name, color: trackColor }];

    await addSessionTrack({ sessionTrack: payload }, eventId);
    if (refetch) refetch();
    /**
     await createEventIndustry(data, eventId, {
      name: value.name,
      color: trackColor,
    });

    form.reset({
      name: "",
    });
    settrackColor("");
    refetch();
   */

    /**
     setCreatedTracks((prev) => [
      ...prev,
      { name: value.name, color: trackColor },
    ]);
    */
  }

  // FN to remove from the list of industries

  async function remove(id: number) {
    const updatedList = sessionTrack?.filter((_, index) => index !== id);

    await addSessionTrack({ sessionTrack: updatedList }, eventId);
    if (refetch) refetch();
  }

  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[320] inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[500px] box-animation h-fit flex flex-col gap-y-6 rounded-lg bg-white m-auto absolute inset-0 py-8 px-3 sm:px-6"
      >
        <div className="w-full flex items-center gap-x-2">
          <Button onClick={() => setActive(1)} className="px-1 h-fit w-fit">
            <ArrowBackOutline size={22} />
          </Button>
          <h2 className="font-medium text-lg sm:text-xl">Create New Track</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start w-full flex-col gap-y-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <InputOffsetLabel label="Track">
                  <Input
                    type="text"
                    placeholder="track"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="w-full my-8 h-fit"
            >
              <CirclePicker
                width="100%"
                color={trackColor}
                onChangeComplete={(color) => settrackColor(color.hex)}
                circleSize={36}
              />
            </div>
            {Array.isArray(sessionTrack) && sessionTrack?.length > 0 && (
              <div className="w-full flex flex-col gap-y-4 items-start justify-start">
                <h3>Your Created Tracks</h3>

                <div className="w-full flex flex-wrap items-center gap-4">
                  {Array.isArray(sessionTrack) &&
                    sessionTrack.map(({ name, color }, index) => (
                      <CreatedPreview
                        key={name}
                        name={name}
                        remove={() => remove(index)}
                        color={color}
                      />
                    ))}
                </div>
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="mt-4 h-12 w-full gap-x-2 bg-basePrimary text-gray-50 font-medium"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <span>Create Track</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
