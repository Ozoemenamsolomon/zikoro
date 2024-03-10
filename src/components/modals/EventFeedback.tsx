import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import {
  Form,
  FormField,
  Textarea,
  InputOffsetLabel,
  Button,
} from "@/components";
import { useForm } from "react-hook-form";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { cn } from "@/lib";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFeedBackSchema } from "@/validations";
import { useEventFeedBack } from "@/hooks";

export function EventFeedBack({
  close,
}: {

  close: () => void;
}) {
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
    close()
  }

 // console.log(form.watch("ratings"))
  // rating numbers
  const ratings = Array.from({ length: 10 }, (_, index) => String(index + 1));
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
          <h2 className="font-medium text-lg sm:text-xl">
            Zikoro wants your feedback
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
                    )}
                  />
                ))}
              </div>
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
                    className=" placeholder:text-sm h-28 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  ></Textarea>
                </InputOffsetLabel>
              )}
            />

            <Button
              disabled={loading}
              className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-zikoro h-12 rounded-md text-gray-50 font-medium"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <span>Submit Feedback</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}