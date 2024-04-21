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
import {
  useFetchCreatedEventIndustries,
  useCreateEventIndustry,
} from "@/hooks";

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
}: {
  close: () => void;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}) {
  const form = useForm<FormValue>();
  const [trackColor, settrackColor] = useState<string>("");
  const [createdTracks, setCreatedTracks] = useState<TrackType[]>([]);
  //  const { loading, createEventIndustry } = useCreateEventIndustry();
  //  const { data, refetch } = useFetchCreatedEventIndustries(eventId);

  async function onSubmit(value: FormValue) {
    if (trackColor === "" || value.name === undefined) {
      toast({
        variant: "destructive",
        description: "Pls, Select a Color or Name",
      });
      return;
    }

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

    setCreatedTracks((prev) => [
      ...prev,
      { name: value.name, color: trackColor },
    ]);
  }

  // FN to remove from the list of industries

  function remove(id: number) {
    const updatedList = createdTracks.filter((_, index) => index !== id);

    setCreatedTracks(updatedList);
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
            {Array.isArray(createdTracks) && createdTracks?.length > 0 && (
              <div className="w-full flex flex-col gap-y-4 items-start justify-start">
                <h3>Your Created Tracks</h3>

                <div className="w-full flex flex-wrap items-center gap-4">
                  {Array.isArray(createdTracks) &&
                    createdTracks.map(({ name, color }) => (
                      <CreatedPreview
                        key={name}
                        name={name}
                        //  remove={remove}

                        color={color}
                      />
                    ))}
                </div>
              </div>
            )}
            <Button
              type="submit"
              disabled={false}
              className="mt-4 h-12 w-full gap-x-2 bg-basePrimary text-gray-50 font-medium"
            >
              {"" && <LoaderAlt size={22} className="animate-spin" />}
              <span>Create Track</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
