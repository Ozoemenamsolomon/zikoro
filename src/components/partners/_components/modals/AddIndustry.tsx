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
  useCreateEventIndustry,
  useFetchSingleEvent,
  useUpdateEvent,
} from "@/hooks";

type FormValue = {
  name: string;
};

export function AddIndustry({
  setActive,
  close,
  eventId,
}: {
  close: () => void;
  eventId: string;

  setActive: React.Dispatch<React.SetStateAction<number>>;
}) {
  const form = useForm<FormValue>();
  const [industryColor, setIndustryColor] = useState<string>("");
  // const [createdIndustry, setCreatedIndustry] = useState<IndustryType[]>([]);
  // const { loading, createEventIndustry } = useCreateEventIndustry();
  const { data, refetch } = useFetchSingleEvent(eventId);
  const { loading, update: createEventIndustry } = useUpdateEvent();
  async function onSubmit(value: FormValue) {
    if (industryColor === "" || value.name === undefined) {
      toast({
        variant: "destructive",
        description: "Pls, Select a Color or Name",
      });
      return;
    }

    const payload =
      Array.isArray(data?.partnerIndustry) && data?.partnerIndustry.length > 0
        ? [
            ...data?.partnerIndustry,
            { name: value?.name, color: industryColor },
          ]
        : [{ name: value?.name, color: industryColor }];
    await createEventIndustry(
      { partnerIndustry: payload },
      eventId,
      "Industry Created Successfully"
    );

    form.reset({
      name: "",
    });
    setIndustryColor("");
    refetch();
  //  close();

    /*
     setCreatedIndustry((prev) => [
      ...prev,
      { name: value.name, color: industryColor },
    ]);
    */
  }

  // FN to remove from the list of industries
  async function remove(id: number) {
    const updatedList = data?.partnerIndustry?.filter(
      (_, index) => index !== id
    );

    await createEventIndustry({ partnerIndustry: updatedList }, eventId, "Industries Updated Successfully");
    refetch();
  }

  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100] inset-0 bg-black/50"
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
          <h2 className="font-medium text-lg sm:text-xl">
            Create New Industry
          </h2>
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
                <InputOffsetLabel label="Industry Name">
                  <Input
                    type="text"
                    placeholder="Industry"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            {/** */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="w-full my-8 h-fit"
            >
              <CirclePicker
                width="100%"
                color={industryColor}
                onChangeComplete={(color) => setIndustryColor(color.hex)}
                circleSize={36}
              />
            </div>
            {/** */}
            {Array.isArray(data?.partnerIndustry) &&
              data?.partnerIndustry?.length > 0 && (
                <div className="w-full flex flex-col gap-y-4 items-start justify-start">
                  <h3>Your Created Industry</h3>

                  <div className="w-full flex flex-wrap items-center gap-4">
                    {Array.isArray(data?.partnerIndustry) &&
                      data?.partnerIndustry.map(({ name, color }, index) => (
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
              <span>Create Industry</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
