import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { Form, FormField, Input, Button } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { zodResolver } from "@hookform/resolvers/zod";
import { rewardSchema } from "@/schemas";
import { useCreateReward } from "@/hooks";
import { uploadFile } from "@/utils";

export function CreateReward({
  close,
  eventId,
  eventName,
  refetch,
}: {
  eventId: string;
  eventName?: string;
  close: () => void;
  refetch: () => Promise<any>;
}) {
  const form = useForm<z.infer<typeof rewardSchema>>({
    resolver: zodResolver(rewardSchema),
  });
  const { createReward, loading } = useCreateReward();

  async function onSubmit(values: z.infer<typeof rewardSchema>) {
    const img = await uploadFile(values.image[0], "image");

    await createReward({
      ...values,
      image: img,
      eventId,
      eventName,
    });
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
        className="w-[95%] sm:w-[500px] box-animation h-fit flex flex-col gap-y-6 rounded-lg bg-white m-auto absolute inset-0 py-6 px-3 sm:px-4"
      >
        <div className="w-full flex items-center justify-between">
          <h2 className="font-medium text-lg sm:text-xl">Create Reward</h2>
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
              name="rewardTitle"
              render={({ field }) => (
                <InputOffsetLabel label="Reward Title ">
                  <Input
                    type="text"
                    placeholder="Enter Reward Title"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <InputOffsetLabel label="Image">
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Select Image"
                    {...form.register("image")}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <InputOffsetLabel label="Quantity ">
                  <Input
                    type="number"
                    placeholder="Enter the quantity"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="point"
              render={({ field }) => (
                <InputOffsetLabel label="Points Needed">
                  <Input
                    type="number"
                    placeholder="Enter the quantity"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />

            <Button
              disabled={loading}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <span>Create Reward</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
