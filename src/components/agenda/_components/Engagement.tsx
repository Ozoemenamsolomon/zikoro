"use client";
import { useMemo, useState } from "react";
import { Star } from "@styled-icons/fluentui-system-regular/Star";
import { StarFullOutline } from "@styled-icons/typicons/StarFullOutline";
import { Form, FormField, Button, Textarea } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { useForm } from "react-hook-form";
import { cn } from "@/lib";
import { TAgenda, TAttendee } from "@/types";
import { getCookie, useSendReview } from "@/hooks";
import { Like } from "@styled-icons/foundation/Like";
export function Engagement({
  agenda,
  id,
  attendees,
}: {
  id: string;
  attendees: TAttendee[];
  agenda: TAgenda | null;
}) {
  const [rating, setRating] = useState(0);
  const user = getCookie("user");

  const attendeeId = useMemo(() => {
    return attendees?.find(
      ({ email, eventAlias }) =>
      eventAlias=== id && email === user?.userEmail
    )?.id;
  }, [attendees]);
  return (
    <div className="lg:col-span-3 p-2 lg:p-4 w-full">
      <div className="w-full h-fit bg-gray-100 rounded-xl">
        <div className="w-full flex items-center justify-between border-b border-gray-300 p-4">
          <h2 className="text-base sm:text-xl font-semibold  text-start">
            Reviews
          </h2>
          <Button className="w-fit h-fit px-0" onClick={() => setRating(0)}>
            <CloseOutline size={22} />
          </Button>
        </div>

        {rating > 0 ? (
          <ReviewComment
            rating={rating}
            sessionId={agenda?.id}
            attendeeId={attendeeId}
          />
        ) : (
          <div className="w-full flex flex-col p-6 items-start justify-start gap-y-2">
            <h3 className="text-base sm:text-lg font-semibold">
              How would you rate this session?
            </h3>
            <div className="w-[80%] mx-auto space-y-2">
              <div className="grid text-gray-500 grid-cols-5 gap-3 w-full">
                {[1, 2, 3, 4, 5]?.map((v, index) => (
                  <button
                    onClick={() => setRating(index + 1)}
                    key={v}
                    className={cn(index + 1 <= rating && "text-basePrimary")}
                  >
                    {index + 1 <= rating ? (
                      <StarFullOutline size={40} />
                    ) : (
                      <Star size={40} />
                    )}
                  </button>
                ))}
              </div>
              <div className="w-full grid grid-cols-2 items-center text-gray-500">
                <p className="text-xs flex item-start justify-start">Bad</p>
                <p className="text-xs flex items-end justify-end">Excellent</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type FormValue = {
  comments: string;
};
function ReviewComment({
  rating,
  sessionId,
  attendeeId,
}: {
  sessionId?: number;
  rating: number;
  attendeeId?: number;
}) {
  const form = useForm<FormValue>({});
  const { sendReview, isLoading } = useSendReview();
  const [isSend, setSend] = useState(false);

  async function onSubmit(values: FormValue) {
    const payload = {
      ...values,
      rating,
      sessionId,
      attendeeId,
    };
    await sendReview({ payload });
    setSend(true);
  }
  return (
    <div className="w-full ">
      <>
        {!isSend ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col  py-6 px-4 items-start justify-start gap-y-3"
            >
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <InputOffsetLabel label="">
                    <Textarea
                      placeholder="Please share your thoughts"
                      {...form.register("comments")}
                      className="placeholder:text-sm h-40 bg-gray-100 border-gray-300 focus:border-gray-500 placeholder:text-gray-500 text-gray-700"
                    ></Textarea>
                  </InputOffsetLabel>
                )}
              />

              <Button
                disabled={isLoading}
                className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
              >
                {isLoading && <LoaderAlt size={22} className="animate-spin" />}
                <span>Send Review</span>
              </Button>
            </form>
          </Form>
        ) : (
          <div className="w-full h-[250px] flex items-center justify-center flex-col gap-y-3">
            <Like size={40} className="text-basePrimary " />
            <p className="text-sm">Thanks for your feedback</p>
          </div>
        )}
      </>
    </div>
  );
}
