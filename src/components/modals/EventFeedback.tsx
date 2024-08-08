"use client";
import { CloseOutline } from "styled-icons/evaicons-outline";
import {
  Form,
  FormField,
  Textarea,
  Button,
  FormMessage,
  FormItem,
} from "@/components";
import { useForm } from "react-hook-form";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { cn } from "@/lib";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFeedBackSchema } from "@/schemas";
import { useEventFeedBack } from "@/hooks";
import InputOffsetLabel from "../InputOffsetLabel";

export function EventFeedBack({ close }: { close: () => void }) {
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
        <FeedBackComp close={close} />
      </div>
    </div>
  );
}

export function FeedBackComp({ close }: { close: () => void }) {
  const { loading, sendFeedback } = useEventFeedBack();
  const form = useForm<z.infer<typeof eventFeedBackSchema>>({
    resolver: zodResolver(eventFeedBackSchema),
  });

  async function onSubmit(values: z.infer<typeof eventFeedBackSchema>) {
    const payload = {
      comment: values.comment,
      ratings: Number(values.ratings),
    };
    await sendFeedback(payload);
   close();
  }

  // console.log(form.watch("ratings"))
  // rating numbers
  const ratings = Array.from({ length: 10 }, (_, index) => String(index + 1));
  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col items-start justify-start">
          <h2 className="font-medium text-lg sm:text-xl">
            Zikoro wants your feedback
          </h2>
          <p className="text-xs sm:text-sm">
            Select a number and state your reason.
          </p>
        </div>
        {close && (
          <Button onClick={close} className="px-1 h-fit w-fit">
            <CloseOutline size={22} />
          </Button>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start w-full flex-col gap-y-3"
        >
          <div className="w-full flex flex-col items-start justify-start gap-y-2">
            <p className="text-sm">
              How likely are you to recommend Zikoro to a friend or colleague?
            </p>
            <div className="w-full grid grid-cols-10 items-center">
              {ratings.map((value, index) => (
                <FormField
                  key={value}
                  control={form.control}
                  name="ratings"
                  render={({ field }) => (
                    <FormItem>
                      <label
                        className={cn(
                          "h-10 w-full border-y flex items-center justify-center border-gray-300",
                          index === 0 ? "border-l border-r" : "border-r",
                          form.watch("ratings") === value && "bg-gray-300"
                        )}
                      >
                        <span>{value}</span>
                        <input {...field} hidden value={value} type="radio" />
                      </label>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            {form.formState?.errors?.ratings?.message && (
              <p className="text-sm  text-red-500">
                {form.formState.errors.ratings?.message}
              </p>
            )}
            <div className="text-sm w-full flex items-center justify-between">
              <p>Not Likely</p>

              <p>Very Likely</p>
            </div>
          </div>
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <InputOffsetLabel label="Why?">
                <Textarea
                  placeholder="Write a text. Your feedback will enable us to serve you better."
                  {...field}
                  className="w-full  placeholder:text-sm h-28 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                ></Textarea>
              </InputOffsetLabel>
            )}
          />

          <Button
            disabled={loading}
            className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
          >
            {loading && <LoaderAlt size={22} className="animate-spin" />}
            <span>Submit Feedback</span>
          </Button>
        </form>
      </Form>
    </>
  );
}
