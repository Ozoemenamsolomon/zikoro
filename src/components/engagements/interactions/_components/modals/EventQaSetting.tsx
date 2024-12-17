"use client";

import { Form, FormField, Input, Button, Textarea } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { Switch } from "@/components/ui/switch";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { CloseOutline } from "styled-icons/evaicons-outline";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { eventQaSettingSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect, useState } from "react";
import { TEventQa, TOrgEvent } from "@/types";
import Image from "next/image";
import { generateInteractionAlias, uploadFile } from "@/utils";
import { useFetchSingleEvent } from "@/hooks";
import { usePostRequest } from "@/hooks/services/request";

type QaSettingProp = {
  eventAlias: string;
  close: () => void;
  eventQa?: TEventQa | null;
  refetch?: () => Promise<any>;
};
export function EventQaSetting({
  close,
  eventAlias,
  eventQa,
  refetch,
}: QaSettingProp) {
  const { postData } = usePostRequest<Partial<TEventQa>>("/engagements/qa");

  const {
    data: event,
  }: {
    data: TOrgEvent | null;
  } = useFetchSingleEvent(eventAlias);
  const [branding, setBranding] = useState({
    eventName: false,
    poweredBy: false,
  });
  const [loading, setLoading] = useState(false);
  const [accessibility, setAccessibility] = useState({
    visible: false,
    disable: false,
    live: false,
    allowAnonymous: false,
    mustReviewQuestion: true,
    cannotAskQuestion: false,
    canRespond: true,
    canTag: false,
    indicateAnsweredQuestions: false,
  });
  const form = useForm<z.infer<typeof eventQaSettingSchema>>({
    resolver: zodResolver(eventQaSettingSchema),
  });

  const coverImg = form.watch("coverImage");

  const qaAlias = useMemo(() => {
    return generateInteractionAlias();
  }, []);

  async function onSubmit(values: z.infer<typeof eventQaSettingSchema>) {
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
    const payload: Partial<TEventQa> = eventQa?.QandAAlias
      ? {
          ...eventQa,
          ...values,
          coverImage: promise,
          branding,
          accessibility,
          eventAlias,
          lastUpdated_at: new Date().toISOString(),
        }
      : {
          ...values,
          QandAAlias: qaAlias,
          eventAlias,
          coverImage: promise,
          branding,
          accessibility,
          lastUpdated_at: new Date().toISOString(),
        };

    await postData({ payload });
    if (refetch) refetch();
    setLoading(false);
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
    if (eventQa) {
      form.reset({
        coverImage: eventQa?.coverImage,
        coverTitle: eventQa?.coverTitle,
        description: eventQa?.description,
      });

      setBranding(eventQa?.branding);
      setAccessibility(eventQa?.accessibility);
    }
  }, [eventQa]);

  // console.log('wdqd', selectedFormId);
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
          <h2 className="font-semibold text-lg sm:text-2xl">QA Settings</h2>
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
                    className="placeholder:text-sm h-11 text-gray-700"
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
                    className="placeholder:text-sm   placeholder:text-gray-400 text-gray-700"
                  ></Textarea>
                </InputOffsetLabel>
              )}
            />
            {!addedImage && (
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
                      className="placeholder:text-sm h-11 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
            )}
            {addedImage && (
              <div className="w-[100px] relative h-[100px]">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.setValue("coverImage", null);
                  }}
                  className="h-6 w-6 rounded-full px-0 absolute top-3 right-3 bg-red-500 text-white"
                >
                  <CloseOutline size={16} />
                </Button>
                <Image
                  src={addedImage}
                  alt=""
                  className="w-[100px] h-[100px]"
                  width={300}
                  height={300}
                />
              </div>
            )}

            <p className="font-semibold">Branding</p>

            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <p>Show Event Name</p>
              <Switch
                disabled={loading}
                checked={branding?.eventName}
                onClick={() =>
                  setBranding({ ...branding, eventName: !branding?.eventName })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>
            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <p>Show Powered by Zikoro</p>
              <Switch
                checked={branding?.poweredBy}
                disabled={loading}
                onClick={() =>
                  setBranding({ ...branding, poweredBy: !branding?.poweredBy })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>

            <p className="font-semibold">Accessibility</p>

            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p>Make QA Visible to Everyone?</p>
                <p className="text-xs text-gray-500">
                  Users who are not registered for your event can access your QA
                </p>
              </div>
              <Switch
                disabled={loading}
                checked={accessibility?.visible}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    visible: !accessibility.visible,
                  })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>

            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p>Live Mode</p>
                <p className="text-xs text-gray-500">
                  {event &&
                  event?.organization?.subscriptionPlan.toLowerCase() === "free"
                    ? `Upgrade to higher subscription to use this feature.`
                    : `All  attendees will attempt at the same time.`}
                </p>
              </div>
              <Switch
                disabled={loading}
                checked={accessibility?.live}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    live: !accessibility.live,
                  })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>

            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p>Anonymized Entries </p>
                <p className="text-xs text-gray-500">
                  Participants can ask and respond to questions as anonymous
                  when turned on.
                </p>
              </div>
              <Switch
                disabled={loading}
                checked={accessibility?.allowAnonymous}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    allowAnonymous: !accessibility.allowAnonymous,
                  })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>
            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p> Moderation </p>
                <p className="text-xs text-gray-500">
                  Review questions before they are visible to all participants.
                </p>
              </div>
              <Switch
                disabled={loading}
                checked={accessibility?.mustReviewQuestion}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    mustReviewQuestion: !accessibility.mustReviewQuestion,
                  })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>
            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p> Close question </p>
                <p className="text-xs text-gray-500">
                  Restrict participants from asking new questions.
                </p>
              </div>
              <Switch
                disabled={loading}
                checked={accessibility?.cannotAskQuestion}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    cannotAskQuestion: !accessibility.cannotAskQuestion,
                  })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>

            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p>Replies</p>
                <p className="text-xs text-gray-500">
                  Participants can respond to any question.
                </p>
              </div>
              <Switch
                disabled={loading}
                checked={accessibility?.canRespond}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    canRespond: !accessibility.canRespond,
                  })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>

            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p>Answered questions</p>
                <p className="text-xs text-gray-500">
                  Highlight answered questions and make it visible to everyone.
                </p>
              </div>
              <Switch
                disabled={loading}
                checked={accessibility?.indicateAnsweredQuestions}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    indicateAnsweredQuestions:
                      !accessibility.indicateAnsweredQuestions,
                  })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>

            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p>Tags</p>
                <p className="text-xs text-gray-500">
                  Admin can add tags to questions.
                </p>
              </div>
              <Switch
                disabled={loading}
                checked={accessibility?.canTag}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    canTag: !accessibility.canTag,
                  })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="w-full gap-x-2 mt-3 text-gray-50 h-12 bg-basePrimary hover:bg-basePrimary/80 "
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <p>Submit</p>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
