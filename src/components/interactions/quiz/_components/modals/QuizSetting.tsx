"use client";

import { Form, FormField, Input, Button, Textarea } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { Switch } from "@/components/ui/switch";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { quizSettingSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect, useState } from "react";
import { TQuiz, TQuestion } from "@/types";
import Image from "next/image";
import { generateAlias, uploadFile } from "@/utils";
import { useCreateQuiz, useUpdateQuiz } from "@/hooks";

type QuizSettingsProp = {
  eventAlias: string;
  close: () => void;
  quiz?: TQuiz<TQuestion[]> | null;
  refetch?: () => Promise<any>;
};
export function QuizSettings({
  close,
  eventAlias,
  quiz,
  refetch,
}: QuizSettingsProp) {
  const { createQuiz } = useCreateQuiz();
  const { updateQuiz } = useUpdateQuiz();
  const [isEventName, setShowEventName] = useState(false);
  const [isPoweredBy, setShowPooweredBy] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof quizSettingSchema>>({
    resolver: zodResolver(quizSettingSchema),
  });

  const coverImg = form.watch("coverImage");

  async function onSubmit(values: z.infer<typeof quizSettingSchema>) {
    setLoading(true);
    const image = new Promise(async (resolve) => {
      if (typeof values?.coverImage === "string") {
        resolve(values?.coverImage);
      } else if (values?.coverImage && values?.coverImage[0]) {
        const img = await uploadFile(values?.coverImage[0], "image");
        resolve(img);
      } else {
        resolve(null);
      }
    });

    const promise: any = await image;

    const quizAlias = generateAlias();

    const payload: Partial<TQuiz<TQuestion[]>> = quiz?.quizAlias
      ? {
          ...quiz,
          ...values,
          branding: {
            poweredBy: isPoweredBy,
            eventName: isEventName,
          },
          eventAlias,
          quizAlias,
          lastUpdated_at: new Date().toISOString(),
          coverImage: promise,
        }
      : {
          ...values,
          branding: {
            poweredBy: isPoweredBy,
            eventName: isEventName,
          },
          eventAlias,
          quizAlias,
          lastUpdated_at: new Date().toISOString(),
          coverImage: promise,
        };
    const asynQuery = quiz?.quizAlias ? updateQuiz : createQuiz;
    await asynQuery({ payload });
    setLoading(false);
    if (refetch) refetch();
    close();
  }

  const addedImage = useMemo(() => {
    if (typeof coverImg === "string") {
      return coverImg;
    } else if (coverImg && coverImg[0]) {
      return URL.createObjectURL(coverImg[0]);
    } else {
      return null;
    }
  }, [coverImg]);

  useEffect(() => {
    if (quiz) {
      form.reset({
        coverImage: quiz?.coverImage,
        coverTitle: quiz?.coverTitle,
        description: quiz?.description,
      });
      setShowPooweredBy(quiz?.branding?.poweredBy);
      setShowEventName(quiz?.branding?.eventName);
    }
  }, [quiz]);

  return (
    <div
      onClick={close}
      role="button"
      className="w-full h-full fixed inset-0 z-[300] bg-black/50"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="py-6 px-4 w-[95%] max-w-xl m-auto rounded-lg bg-white absolute inset-0 overflow-y-auto max-h-[85%] h-fit"
      >
        <div className="flex mb-4 items-center justify-between w-full">
          <h2 className="font-semibold text-lg sm:text-2xl">Quiz Settings</h2>
          <Button onClick={close}>
            <CloseOutline size={22} />
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex items-start justify-start flex-col gap-y-3"
          >
            <FormField
              control={form.control}
              name="coverTitle"
              render={({ field }) => (
                <InputOffsetLabel label="Cover Title">
                  <Input
                    placeholder="Cover Title"
                    type="text"
                    {...form.register("coverTitle")}
                    className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <InputOffsetLabel label="Description">
                  <Textarea
                    placeholder="Enter the description"
                    {...form.register("description")}
                    className="placeholder:text-sm  focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  ></Textarea>
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <InputOffsetLabel label="Cover Image">
                  <Input
                    placeholder=""
                    type="file"
                    accept="image/*"
                    {...form.register("coverImage")}
                    className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />

            {addedImage && (
              <Image
                src={addedImage}
                alt=""
                className="w-[100px] h-[100px]"
                width={300}
                height={300}
              />
            )}

            <p className="font-semibold">Branding</p>

            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <p>Show Event Name</p>
              <Switch
                disabled={loading}
                checked={isEventName}
                onClick={() => setShowEventName((prev) => !prev)}
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>
            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <p>Show Powered by Zikoro</p>
              <Switch
                checked={isPoweredBy}
                disabled={loading}
                onClick={() => setShowPooweredBy((prev) => !prev)}
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>
            <Button
              disabled={loading}
              type="submit"
              className="w-full gap-x-2 mt-3 text-gray-50 h-12 bg-basePrimary hover:bg-basePrimary/80 "
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <p>Done</p>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
