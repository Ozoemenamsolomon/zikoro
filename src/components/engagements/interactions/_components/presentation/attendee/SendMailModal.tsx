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
// import { CloseOutline } from "styled-icons/evaicons-outline";
import { Navigation } from "styled-icons/feather";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMailQuizSchema } from "@/schemas";
import { TQuiz, TQuestion, TAnswer } from "@/types";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useSendQuizScore } from "@/hooks";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { InlineIcon } from "@iconify/react";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RxLink2 } from "react-icons/rx";
import { SlSocialLinkedin, SlSocialFacebook } from "react-icons/sl";
import copy from "copy-to-clipboard";
export function SendMailModal<T>({
  close,
  quiz,
  id,
  isAttendee,
  actualQuiz,
  attendeeEmail,
  answers,
}: {
  close: () => void;
  quiz: TQuiz<T[]> | null;
  id: string;
  isAttendee: boolean;
  actualQuiz: TQuiz<TQuestion[]> | null;
  attendeeEmail?: string;
  answers?: TAnswer[];
}) {
  const { updateQuiz, isLoading } = useSendQuizScore();
  const form = useForm<z.infer<typeof sendMailQuizSchema>>({
    resolver: zodResolver(sendMailQuizSchema),
    defaultValues: {
      email: attendeeEmail,
    },
  });
  const [isShow, showSuccess] = useState(false);
  const url =
    quiz?.interactionType !== "poll"
      ? `${window.location.origin}/quiz/${quiz?.eventAlias}/present/${quiz?.quizAlias}`
      : `${window.location.origin}/poll/${quiz?.eventAlias}/present/${quiz?.quizAlias}`;
  function copyLink() {
    copy(url);
    showSuccess(true);
    setTimeout(() => showSuccess(false), 2000);
  }

  const attendeePoint = useMemo(() => {
    if (answers && Array.isArray(answers) && answers?.length > 0) {
      return answers
        ?.filter((ans) => ans.quizParticipantId === id)
        ?.reduce((acc, curr) => acc + Number(curr?.attendeePoints), 0);
    } else {
      return 0;
    }
  }, [quiz]);

  async function onSubmit(values: z.infer<typeof sendMailQuizSchema>) {
    // console.log(values);
    const updatedQuiz: Partial<TQuiz<TQuestion[]>> = {
      ...actualQuiz,
      quizParticipants: actualQuiz?.quizParticipants?.map((participant) => {
        if (participant?.id === id) {
          return {
            ...participant,
            email: values?.email,
            attemptedQuiz: quiz!,
          };
        }
        return { ...participant };
      }),
    };

    const payload = {
      quiz: updatedQuiz,
      mailto: {
        email: values?.email,
        createQuiz: `/create`,
        attendeePoint,
        url,
        leaderboard:
          quiz?.interactionType !== "poll"
            ? `/interaction/quiz/scoreboard/${actualQuiz?.quizAlias}?id=${id}`
            : `/interaction/poll/sheet/${actualQuiz?.quizAlias}?id=${id}`,
      },
    };
    await updateQuiz({ payload });
    close();
  }

  const socials = [
    {
      Icon: FaWhatsapp,
      link: `https://api.whatsapp.com/send?text=${url} `,
    },

    {
      Icon: FaXTwitter,
      link: `https://x.com/intent/tweet?url=${url}`,
    },
    {
      Icon: SlSocialFacebook,
      link: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    },
    {
      Icon: SlSocialLinkedin,
      link: `https://www.linkedin.com/shareArticle?url=${url}`,
    },
  ];
  return (
    <div className="w-full h-full inset-0 fixed px-4 overflow-y-auto bg-[#F9FAFF]">
      <div className="w-full mx-auto max-w-[1300px]">
        <Image
          className="w-full h-fit"
          src="/qhurray.png"
          alt=""
          width={2000}
          height={200}
        />
        <div className="w-full flex flex-col items-center justify-center gap-y-8 sm:gap-y-16">
          <div className="space-y-2 flex flex-col items-center justify-center">
            <h2 className="text-center">
              <span className="gradient-text bg-basePrimary font-semibold text-lg sm:text-2xl">
                Hurray{" "}
              </span>{" "}
              🥳
            </h2>
            <p>{`You have completed the ${
              quiz?.interactionType !== "poll" ? "quiz" : "poll"
            }`}</p>
          </div>
          <h1 className="font-semibold text-2xl text-center sm:text-4xl">
            {quiz?.coverTitle}
          </h1>
          {quiz?.interactionType !== "poll" && (
            <div className="space-y-2 flex flex-col items-center justify-center">
              <p className="font-medium text-lg sm:text-2xl">{attendeePoint?.toFixed(0)}</p>
              <p className="flex items-center gap-x-2">
                <InlineIcon
                  icon="solar:star-circle-bold-duotone"
                  fontSize={22}
                  color="#9D00FF"
                />
                Points
              </p>
            </div>
          )}
        </div>

        <div className="w-[95%] max-w-xl bg-white mx-auto h-fit my-6 sm:my-10 rounded-lg flex flex-col gap-3 items-center justify-center  p-4">
          <p className="text-center">Share the quiz with friends</p>
          <div className="w-full bg-[#F9FAFF] rounded-lg p-4 sm:p-6 flex flex-row gap-x-3 items-center justify-center">
            {socials.map(({ Icon, link }, index) => (
              <Link
                key={index}
                href={link}
                target="_blank"
                className="w-[46px] h-[46px] rounded-full bg-white flex items-center justify-center"
              >
                <Icon size={40} />
              </Link>
            ))}
            <button
              onClick={copyLink}
              className="w-[46px] h-[46px] rounded-full bg-white flex items-center justify-center"
            >
              <RxLink2 size={40} />

              {isShow && (
                <p className="absolute text-xs w-[100px] -top-10 bg-black/50 text-white font-medium rounded-md px-3 py-2 transition-transform tranition-all duration-300 animate-fade-in-out">
                  Link Copied
                </p>
              )}
            </button>
          </div>
        </div>

        <div className="w-[95%] max-w-xl bg-white mx-auto h-fit  rounded-lg flex flex-col  p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col items-center justify-center gap-y-2"
            >
              <h2 className="font-semibold text-base sm:text-xl">
                Thanks for Participating
              </h2>
              <p className="text-xs sm:text-sm ">
                Do you wish to receive the result?
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
                        className=" placeholder:text-sm h-11 sm:h-12 mt-5 mb-2 border-basePrimary bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500   text-zinc-700"
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

        {quiz?.interactionType !== "poll" && (
          <div className="w-full mt-6 sm:mt-10 flex items-center justify-center gap-x-3">
            <Button
              className="rounded-lg border border-basePrimary gap-x-2 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end"
              onClick={close}
            >
              <InlineIcon
                fontSize={22}
                icon="iconoir:leaderboard-star"
                color="#9D00FF"
              />
              <p className="gradient-text bg-basePrimary">LeaderBoard</p>
            </Button>
          </div>
        )}

        <div className="w-full  mt-16 sm:mt-32 h-fit relative sm:h-[200px] px-4 bg-gradient-to-tr rounded-lg from-custom-bg-gradient-start to-custom-bg-gradient-end">
          <div className=" flex flex-col sm:flex-row mx-auto items-center justify-between h-fit w-full max-w-3xl">
            <Image
              alt=""
              className="relative object-cover -top-12"
              width={227}
              height={249}
              src="/qhuman.png"
            />
            <div className="flex flex-col items-start justify-start gap-y-3">
              <h3 className="font-semibold text-base sm:text-2xl text-center sm:text-start">
                {`Organize your own ${
                  quiz?.interactionType !== "poll" ? "quiz" : "poll"
                } now`}
              </h3>
              <Link
                href={`/create`}
                className="text-white font-medium flex items-center justify-center h-11 text-center px-6 rounded-lg bg-basePrimary"
              >
                {`Create your own ${
                  quiz?.interactionType !== "poll" ? "quiz" : "poll"
                }!`}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
