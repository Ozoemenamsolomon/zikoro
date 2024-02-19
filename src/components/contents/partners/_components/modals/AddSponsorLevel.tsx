"use client";

import { Form, FormField, Input, InputOffsetLabel, Button } from "@/components";
import { useForm } from "react-hook-form";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";

export function AddSponsorLevel({
  close,
  eventId,
  refetch
}: {
  eventId: string;
  close: () => void;
  refetch: () => Promise<any>
}) {
  const form = useForm({

  });
 // const { loading, createExhibitionHall } = useCreateEventExhibitionHall();

  async function onSubmit(values:any) {
   // await createExhibitionHall(eventId, values);
  //  refetch()
    close()
    form.reset();
  }

  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100] overflow-y-auto pt-14  inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[500px] box-animation h-fit flex  flex-col gap-y-6 rounded-lg bg-white  m-auto absolute inset-x-0 py-6 px-3 sm:px-4"
      >
        <div className="w-full flex items-center justify-between">
          <h2 className="font-medium text-lg sm:text-xl">
            Create Sponsor Level
          </h2>
          <Button onClick={close} className="px-1 h-fit w-fit">
            <CloseOutline size={22} />
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start w-full flex-col gap-y-3"
          >
            <FormField
              control={form.control}
              name="sponsorType"
              render={({ field }) => (
                <InputOffsetLabel label="Sponsor Level">
                  <Input
                    type="text"
                    placeholder="Enter the Hall Name"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />

            <Button
              disabled={loading}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-zikoro h-12 rounded-md text-gray-50 font-medium"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <span>Create Sponsor Level</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
