"use client";

import { Form, FormField, Input, Button } from "@/components";
import { useForm } from "react-hook-form";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useUpdateEvent } from "@/hooks";
import { nanoid } from "nanoid";
import { CreatedPreview } from "@/components/composables";
import InputOffsetLabel from "@/components/InputOffsetLabel";

type FormValue = {
  type: string;
};

export function AddSponsorLevel({
  close,
  eventId,
  setActive,
  sponsorLevels,
  refetch,
}: {
  eventId: string;
  close: () => void;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  refetch: () => Promise<any>;
  sponsorLevels: { id: string; type: string }[] | undefined;
}) {
  const form = useForm<FormValue>({});
  const { loading, update: addSponsors } = useUpdateEvent();

  async function onSubmit(values: FormValue) {
    const payload =
      Array.isArray(sponsorLevels) && sponsorLevels.length > 0
        ? [...sponsorLevels, { ...values, id: nanoid() }]
        : [{ ...values, id: nanoid() }];

    await addSponsors(
      { sponsorCategory: payload },
      eventId,
      "Category Added Successfully"
    );

    form.reset();
    refetch();
  }

  async function remove(index: string) {
    const updatedList = sponsorLevels?.filter(({ id }) => id !== index);

    await addSponsors(
      { sponsorCategory: updatedList },
      eventId,
      "Category Deleted Successfully"
    );
    refetch();
  }

  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100]  pt-14  inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[500px] box-animation h-fit flex  flex-col gap-y-6 rounded-lg bg-white  m-auto absolute inset-0 py-6 px-3 sm:px-4"
      >
        <div className="w-full flex items-center justify-between">
          <h2 className="font-medium text-lg sm:text-xl">
            Create Sponsor Category
          </h2>
          <Button onClick={() => setActive(1)} className="px-1 h-fit w-fit">
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
              name="type"
              render={({ field }) => (
                <InputOffsetLabel label="Sponsor Level">
                  <Input
                    type="text"
                    placeholder="Enter the Hall Name"
                    {...field}
                    className=" placeholder:text-sm h-11 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />

            <div className="w-full flex flex-col items-start justify-start gap-y-2">
              <h2 className="font-semibold text-lg">
                {" "}
                Created Sponsor Category
              </h2>

              <div className="w-full flex flex-wrap items-center gap-4">
                {Array.isArray(sponsorLevels) &&
                  sponsorLevels.map(({ type, id }) => (
                    <CreatedPreview
                      key={type}
                      name={type}
                      remove={() => remove(id)}
                      color={"#000000"}
                    />
                  ))}
              </div>
            </div>

            <Button
              disabled={loading}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <span>Create Sponsor Category</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
