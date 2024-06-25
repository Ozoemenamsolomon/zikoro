"use client";

import {
  Button,
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Input,
} from "@/components";
import { useForm } from "react-hook-form";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { Navigation } from "@styled-icons/feather/Navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMailQuizSchema } from "@/schemas";
import { TAnswer, TQuiz, TRefinedQuestion, TQuestion } from "@/types";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { useGetQuiz, useGetQuizAnswer, useSendQuizScore } from "@/hooks";
import lz from "lzutf8";
export function SendMailModal({
  close,
  quiz,
  id,
  isAttendee,
  quizAnswer,
  actualQuiz
}: {
  close: () => void;
  quiz: TQuiz<TRefinedQuestion[]> | null;
  id: string;
  isAttendee: boolean;
  quizAnswer: TAnswer[];
  actualQuiz: TQuiz<TQuestion[]>|null
}) {
  const { updateQuiz, isLoading } = useSendQuizScore();
  const form = useForm<z.infer<typeof sendMailQuizSchema>>({
    resolver: zodResolver(sendMailQuizSchema),
  });

  async function onSubmit(values: z.infer<typeof sendMailQuizSchema>) {
   // console.log(values);
    const updatedQuiz: Partial<TQuiz<TQuestion[]>> = {
      ...actualQuiz,
      quizParticipants: actualQuiz?.quizParticipants?.map((participant) => {
        if (participant?.id === id) {
          return {
            ...participant,
            email: values?.email,
          };
        }
        return { ...participant };
      }),
    };

    const encodedQuiz = encodeURIComponent(JSON.stringify(quiz));
    const encodedQuizAnswer = encodeURIComponent(JSON.stringify(quizAnswer));

    const payload = {
      quiz: updatedQuiz,
      mailto: {
        email: values?.email,
        url: `/interaction/quiz/scoreboard/${actualQuiz?.quizAlias}?quiz=${encodedQuiz}&quizAnswer=${encodedQuizAnswer}&id=${id}`,
      },
    };
    await updateQuiz({ payload });
  }

  return (
    <div className="w-full h-full inset-0 fixed overflow-y-auto bg-gray-100">
      <div className="w-[95%] max-w-xl bg-white m-auto h-fit inset-0 absolute rounded-lg flex flex-col  p-4">
        <div className="w-full flex items-end justify-end mb-3">
          <Button onClick={close}>
            <CloseOutline size={22} />
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col items-center justify-center gap-y-2"
          >
            <h2 className="font-semibold text-base sm:text-xl">
              Thanks for Participating
            </h2>
            <p className="text-xs sm:text-sm ">
              Do you wish to receive the quiz result?
            </p>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      {...form.register("email")}
                      className=" placeholder:text-sm h-11 sm:h-12 mt-5 mb-2 border-basePrimary bg-transparent  placeholder:text-zinc-500 text-zinv-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
              className="w-[180px] mt-2 gap-x-2 px-4 h-11 sm:h-12 text-white bg-basePrimary rounded-lg"
            >
              <p>Send</p>
              <Navigation size={18} />
              {isLoading && <LoaderAlt size={20} className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
