"use client";

import {
  Form,
  FormField,
  Input,
  Button,
  ReactSelect,
  Textarea,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { CloseOutline } from "styled-icons/evaicons-outline";
import { useFieldArray, useForm } from "react-hook-form";
import { duration, points } from "..";
import { PlusCircle } from "styled-icons/bootstrap";
import { CloseCircle } from "styled-icons/ionicons-outline";
import { nanoid } from "nanoid";
import { cn } from "@/lib";
import { quizQuestionSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast"
import { TQuiz, TAnswer, TQuestion } from "@/types";
import { useUpdateQuiz } from "@/hooks";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { uploadFile } from "@/utils";
import InteractionInput from "../custom_ui/InteractionInput";

type AddQuestionProp = {
  refetch?: () => Promise<any>;
  close: () => void;
  quiz?: TQuiz<TQuestion[]> | null;
  question?: TQuestion;
};
export function AddQuestion({
  refetch,
  close,
  quiz,
  question,
}: AddQuestionProp) {
  const { updateQuiz } = useUpdateQuiz();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof quizQuestionSchema>>({
    resolver: zodResolver(quizQuestionSchema),
    defaultValues: {
      options: [{ optionId: nanoid(), option: "", isAnswer: "" }],
    },
  });
  const {
    formState: { errors },
  } = form;

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "options",
  });

  async function onSubmit(values: z.infer<typeof quizQuestionSchema>) {
    // console.log('val',values)
    if (!quiz) return;
    const isCorrectAnswerNotSelected = values?.options?.every(
      (value) => value?.isAnswer?.length <= 0
    );

    if (isCorrectAnswerNotSelected) {
      toast.error("You have not selected the correct answer")
      return
    };
   
    setLoading(true);
   
    const image = await new Promise(async (resolve) => {
      if (typeof values?.questionImage === "string") {
        resolve(values?.questionImage);
      } else if (values?.questionImage && values?.questionImage[0]) {
        const img = await uploadFile(values?.questionImage[0], "image");
        resolve(img);
      } else {
        resolve(null);
      }
    });

    const updatedQuestion = {
      ...values,
      id: nanoid(),
      questionImage: image as string,
    };

    // filter question
    const filteredQuestion = quiz?.questions?.filter(
      ({ id }) => id !== question?.id
    );
    const editingQuestion = quiz?.questions?.find(
      ({ id }) => id === question?.id
    );
    const payload: Partial<TQuiz<TQuestion[]>> = {
      ...quiz,
      questions:
        quiz?.questions?.length > 0
          ? editingQuestion?.id
            ? [
                ...filteredQuestion,
                {
                  ...editingQuestion,
                  ...values,
                  questionImage: image as string,
                },
              ]
            : [...quiz?.questions, { ...updatedQuestion }]
          : [{ ...updatedQuestion }],
      totalDuration:
        quiz?.totalDuration > 0
          ? Number(quiz?.totalDuration) + Number(values?.duration)
          : Number(values?.duration),
      totalPoints:
        quiz?.totalDuration > 0
          ? Number(quiz?.totalPoints) + Number(values?.points)
          : Number(values?.points),
      lastUpdated_at: new Date().toISOString(),
    };
    await updateQuiz({ payload });
    setLoading(false);
    if (refetch) refetch();
    close();
  }

  const questionImg = form.watch("questionImage");
  const addedImage = useMemo(() => {
    if (typeof questionImg === "string") {
      return questionImg;
    } else if (questionImg && questionImg[0]) {
      return URL.createObjectURL(questionImg[0]);
    } else {
      return null;
    }
  }, [questionImg]);

  // console.log(form.getValues("options"))
  function handleRadioChange(id: number) {
    const fields = form.watch("options");
    const optionId = form.getValues(`options.${id}.optionId`);

    // option: index === id ? option : field.option,
    const updatedField = fields.map((field, index) => {
      if (index === id) {
        return {
          ...field,

          isAnswer: optionId,
        };
      }

      return { ...field };
    });

    form.setValue("options", updatedField);
  }

  useEffect(() => {
    if (question) {
      form.reset({
        question: question?.question,
        questionImage: question?.questionImage,
        duration: question?.duration,
        points: question?.points,
        feedBack: question?.feedBack,
        options: question?.options,
      });
    }
  }, [question]);
  const questionValue = form.watch("question");
  const feedBackValue = form.watch("feedBack");

  const defaultQuestionValue = useMemo(() => {
    if (typeof questionValue === "string" && questionValue?.length > 0) {
      return questionValue;
    } else {
      return "";
    }
  }, [questionValue]);

  const defaultFeedBackValue = useMemo(() => {
    if (typeof feedBackValue === "string" && feedBackValue?.length > 0) {
      return feedBackValue;
    } else {
      return "";
    }
  }, [feedBackValue]);

  //console.log({defaultQuestionValue, defaultFeedBackValue})
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
        className="py-6 px-4 w-[95%] max-w-2xl m-auto rounded-lg bg-white absolute inset-0 overflow-y-auto max-h-[85%] h-fit"
      >
        <div className="flex mb-4 items-center justify-between w-full">
          <h2 className="font-semibold text-lg sm:text-2xl">Add Question</h2>
          <Button onClick={close}>
            <CloseOutline size={22} />
          </Button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col items-start justify-start gap-y-3"
          >
            {(defaultQuestionValue || !question) && (
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <InputOffsetLabel label="Question">
                    <InteractionInput
                      defaultValue={defaultQuestionValue}
                      placeholder="Enter the Question"
                      onChange={(value) => {
                        form.setValue("question", value);
                      }}
                      error={errors?.question?.message}
                    />
                  </InputOffsetLabel>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="questionImage"
              render={({ field }) => (
                <InputOffsetLabel label="Image">
                  <Input
                    placeholder=""
                    type="file"
                    accept="image/*"
                    {...form.register("questionImage")}
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
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="relative w-full h-fit">
                  <FormControl>
                    <ReactSelect
                      defaultValue={
                        question
                          ? duration?.find(
                              ({ value }) => value === question?.duration
                            )
                          : ""
                      }
                      placeHolder="Select duration"
                      options={duration}
                      {...form.register("duration")}
                      label="Duration"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem className="relative w-full h-fit">
                  <FormControl>
                    <ReactSelect
                      defaultValue={
                        question
                          ? points?.find(
                              ({ value }) => value === question?.points
                            )
                          : ""
                      }
                      placeHolder="Select points"
                      options={points}
                      {...form.register("points")}
                      label="Points"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="w-full relative grid grid-cols-12  px-2 pb-2 pt-1 items-center  "
              >
                <span className="absolute font-medium top-0 z-10 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">{`Option ${
                  index + 1
                }`}</span>

                <div className="w-full relative col-span-12">
                  <InteractionInput
                    placeholder="Enter Option"
                    defaultValue={field.option}
                    onChange={(value) => {
                      form.setValue(`options.${index}.option` as const, value);
                    }}
                    error={
                      errors?.options ? errors?.options[index]?.message : ""
                    }
                  />
                  <label className="flex absolute right-2 top-[3.5rem] ">
                    <input
                      {...form.register(`options.${index}.isAnswer` as const)}
                      type="radio"
                      name={`isAnswer`}
                      value={field.optionId}
                      onChange={() => handleRadioChange(index)}
                      className="h-5 w-5 accent-basePrimary"
                    />
                  </label>
                  <button
                    disabled={fields.length === 1}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      remove(index);
                    }}
                    className="absolute right-2 top-[0.5rem] text-red-500"
                  >
                    <CloseCircle size={20} />
                  </button>
                </div>
              </div>
            ))}
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                append([
                  {
                    optionId: nanoid(),
                    option: "",
                    isAnswer: "",
                  },
                ]);
              }}
              className={cn(
                "px-0 text-sm w-fit h-fit font-medium text-basePrimary gap-x-2",
                fields?.length === 4 && "hidden"
              )}
            >
              <PlusCircle size={18} />
              <p>Options</p>
            </Button>
            {(defaultFeedBackValue || !question) && (
              <FormField
                control={form.control}
                name="feedBack"
                render={({ field }) => (
                  <InputOffsetLabel label="Additional FeedBack">
                    <InteractionInput
                      placeholder="Enter the feedBack"
                      defaultValue={defaultFeedBackValue}
                      onChange={(value) => {
                        form.setValue("feedBack", value);
                      }}
                    />
                  </InputOffsetLabel>
                )}
              />
            )}

            <Button
              disabled={loading}
              type="submit"
              className="w-full hover:bg-basePrimary/80 mt-3 gap-x-2 bg-basePrimary text-gray-50"
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <p> Submit</p>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
