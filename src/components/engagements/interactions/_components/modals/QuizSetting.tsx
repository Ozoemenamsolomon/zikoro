"use client";

import { Form, FormField, Input, Button, Textarea } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { Switch } from "@/components/ui/switch";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { CloseOutline } from "styled-icons/evaicons-outline";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { quizSettingSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect, useState } from "react";
import { TQuiz, TQuestion, TOrgEvent } from "@/types";
import Image from "next/image";
import { generateInteractionAlias, uploadFile } from "@/utils";
import { useCreateQuiz, useUpdateQuiz, useFetchSingleEvent } from "@/hooks";
import { SelectFormModal } from "./SelectFormModal";
import { TEngagementFormQuestion } from "@/types/engagements";

//******** */
// NB: This modal is used for creating, and updating quiz and poll
// interactionType is either 'quiz' or 'poll'
//******* */

type QuizSettingsProp = {
  eventAlias: string;
  close: () => void;
  quiz?: TQuiz<TQuestion[]> | null;
  refetch?: () => Promise<any>;
  interactionType?: string;
};
export function QuizSettings({
  close,
  eventAlias,
  quiz,
  refetch,
  interactionType,
}: QuizSettingsProp) {
  const { createQuiz } = useCreateQuiz();
  const {
    data: event,
  }: {
    data: TOrgEvent | null;
  } = useFetchSingleEvent(eventAlias);
  const [selectedForm, setSelectedForm] =
    useState<TEngagementFormQuestion | null>(null);
  const { updateQuiz } = useUpdateQuiz();
  const [isOpen, setIsOpen] = useState(false);
  const [branding, setBranding] = useState({
    eventName: false,
    poweredBy: false,
  });
  const [loading, setLoading] = useState(false);
  const [accessibility, setAccessibility] = useState({
    visible: false,
    review: false,
    countdown: true,
    timer: true,
    countdownTransition: true,
    disable: false,
    live: false,
    isCollectPhone: false,
    isCollectEmail: false,
    isForm: false,
    showAnswer: interactionType === "quiz" ? true : false,
    showResult: interactionType === "quiz" ? true : false,
  });
  const form = useForm<z.infer<typeof quizSettingSchema>>({
    resolver: zodResolver(quizSettingSchema),
  });

  const coverImg = form.watch("coverImage");

  const quizAlias = useMemo(() => {
    return generateInteractionAlias();
  }, []);

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

    const payload: Partial<TQuiz<TQuestion[]>> = quiz?.quizAlias
      ? {
          ...quiz,
          ...values,
          branding,
          accessibility,
          eventAlias,
          lastUpdated_at: new Date().toISOString(),
          coverImage: promise,
          formAlias: accessibility?.isForm ? selectedForm?.formAlias : "",
        }
      : {
          ...values,
          branding,
          eventAlias,
          interactionType: interactionType,
          accessibility,
          quizAlias,
          lastUpdated_at: new Date().toISOString(),
          coverImage: promise,
          formAlias: accessibility?.isForm ? selectedForm?.formAlias : "",
        };
    const asynQuery = quiz?.quizAlias ? updateQuiz : createQuiz;
    await asynQuery({ payload });
    setLoading(false);
    window.open(
      `/event/${eventAlias}/engagements/interactions/${
        quiz?.quizAlias || quizAlias
      }`,
      "_self"
    );
    // if (refetch) refetch();
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
      // setShowPooweredBy(quiz?.branding?.poweredBy);
      // setShowEventName(quiz?.branding?.eventName);
      setBranding(quiz?.branding);
      setAccessibility(quiz?.accessibility);
    }
  }, [quiz]);

  const isQuiz = useMemo(() => {
    return interactionType === "quiz";
  }, [interactionType]);

  function changeSelectedForm(form: TEngagementFormQuestion) {
    setSelectedForm(form);
  }
  function toggleSelectFormModal() {
    setIsOpen((p) => !p);
  }

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
          <h2 className="font-semibold text-lg sm:text-2xl">
            {isQuiz ? "Quiz" : "Poll"} Settings
          </h2>
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
                <p>Make{isQuiz ? " Quiz " : " Poll "}Visible to Everyone?</p>
                <p className="text-xs text-gray-500">
                  Users who are not registered for your event can access your
                  {isQuiz ? "quiz" : "poll"}
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

            {accessibility?.visible && (
              <>
                <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
                  <div className="flex flex-col items-start justify-start">
                    <p>Collect player's Email</p>
                  </div>
                  <Switch
                    disabled={loading}
                    checked={accessibility?.isCollectEmail}
                    onClick={() =>
                      setAccessibility({
                        ...accessibility,
                        isCollectEmail: !accessibility.isCollectEmail,
                        isCollectPhone: false,
                      })
                    }
                    className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
                  />
                </div>
                <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
                  <div className="flex flex-col items-start justify-start">
                    <p>Collect player's Phone Number</p>
                  </div>
                  <Switch
                    disabled={loading}
                    checked={accessibility?.isCollectPhone}
                    onClick={() =>
                      setAccessibility({
                        ...accessibility,
                        isCollectPhone: !accessibility.isCollectPhone,
                        isCollectEmail: false,
                      })
                    }
                    className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
                  />
                </div>
              </>
            )}

            {isQuiz && (
              <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
                <div className="flex flex-col items-start justify-start">
                  <p>Review answers after each question</p>
                  <p className="text-xs text-gray-500">
                    You will see how people answered each question before the
                    next question appears.
                  </p>
                </div>
                <Switch
                  disabled={loading}
                  checked={accessibility?.review}
                  onClick={() =>
                    setAccessibility({
                      ...accessibility,
                      review: !accessibility.review,
                    })
                  }
                  className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
                />
              </div>
            )}
            {isQuiz && (
              <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
                <p>Question Answer Visibility</p>

                <Switch
                  disabled={loading}
                  checked={accessibility?.showAnswer}
                  onClick={() =>
                    setAccessibility({
                      ...accessibility,
                      showAnswer: !accessibility.showAnswer,
                    })
                  }
                  className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
                />
              </div>
            )}
            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p>Show {isQuiz ? "Quiz" : "Poll"} Result</p>
                <p className="text-xs text-gray-500">
                  Participants will see the score sheet immediately after the{" "}
                  {isQuiz ? "quiz" : "poll"}.
                </p>
              </div>
              <Switch
                disabled={loading}
                checked={accessibility?.showResult}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    showResult: !accessibility.showResult,
                  })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>
            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <p>Show countdown before the next question</p>

              <Switch
                disabled={loading}
                checked={accessibility?.countdown}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    countdown: !accessibility.countdown,
                  })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>

            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p>Show timer</p>
                <p className="text-xs text-gray-500">
                  The timer shown while attempting the quiz will be turned off.
                </p>
              </div>
              <Switch
                disabled={loading}
                checked={accessibility?.timer}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    timer: !accessibility.timer,
                  })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>
            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p>Show countdown transition</p>
                <p className="text-xs text-gray-500">
                  Countdown appears before each new question.
                </p>
              </div>
              <Switch
                disabled={loading}
                checked={accessibility.countdownTransition}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    countdownTransition: !accessibility.countdownTransition,
                  })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>

            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p>Disable {isQuiz ? "quiz" : "poll"}</p>
                <p className="text-xs text-gray-500">
                  Participants will no longer be able to join this{" "}
                  {isQuiz ? "quiz" : "poll"}.
                </p>
              </div>
              <Switch
                disabled={loading}
                checked={accessibility.disable}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    disable: !accessibility.disable,
                  })
                }
                className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              />
            </div>
            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p>Live Mode</p>
                <p className="text-xs text-gray-500">
                  {event && event?.organization?.subscriptionPlan === "Free"
                    ? `Upgrade to higher subscription to use this feature.`
                    : `All ${
                        isQuiz ? `quiz` : `poll`
                      } participants will attempt the ${
                        isQuiz ? `quiz` : `poll`
                      } at the same time.`}
                </p>
              </div>
              {/***={loading} */}
              <Switch
                disabled={event?.organization?.subscriptionPlan === "Free"}
                checked={accessibility.live}
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
              <div className="flex flex-col items-start  justify-start">
                <p>Form</p>
                <p className="text-xs text-gray-500">
                  Create a custom forms to collect your defined user data before
                  they can participate.
                </p>
                {accessibility?.isForm && (
                  <div className="flex mt-1 items-start flex-col gap-3">
                    {selectedForm && (
                      <div className="w-[250px] h-[250px]">
                        <div className="w-full border p-3 rounded-lg grid grid-cols-10 gap-x-3 bg-white border-basePrimary">
                          {selectedForm?.coverImage &&
                          (selectedForm?.coverImage as string).startsWith(
                            "https"
                          ) ? (
                            <Image
                              alt=""
                              src={selectedForm?.coverImage}
                              width={500}
                              height={500}
                              className="w-full col-span-3 h-[100px] rounded-lg object-cover"
                            />
                          ) : (
                            <div className="col-span-3 h-[100px] rounded-lg bg-gray-200 animate-pulse"></div>
                          )}
                          <div className="w-full col-span-7 flex items-start justify-start flex-col gap-2">
                            <h2 className="font-medium text-base sm:text-lg">
                              {selectedForm?.title ?? ""}
                            </h2>
                            <p className="w-full text-ellipsis overflow-hidden whitespace-nowrap">
                              {selectedForm?.description ?? ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleSelectFormModal();
                      }}
                      className="text-basePrimary px-0  h-fit w-fit underline"
                    >
                      Select/Create a Form
                    </Button>
                  </div>
                )}
              </div>
              <Switch
                disabled={loading}
                checked={accessibility?.isForm}
                onClick={() =>
                  setAccessibility({
                    ...accessibility,
                    isForm: !accessibility.isForm,
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
              <p>Done</p>
            </Button>
          </form>
        </Form>
      </div>

      {isOpen && (
        <SelectFormModal
          selectedForm={selectedForm}
          eventId={eventAlias}
          close={toggleSelectFormModal}
          setSelectedForm={changeSelectedForm}
        />
      )}
    </div>
  );
}
