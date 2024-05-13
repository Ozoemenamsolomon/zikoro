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
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { useFieldArray, useForm } from "react-hook-form";
import { duration, points } from "..";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { CloseCircle } from "@styled-icons/ionicons-outline/CloseCircle";
import { nanoid } from "nanoid";
import { cn } from "@/lib";
import { quizQuestionSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import {TQuiz} from "@/types"
import {uploadFile} from "@/utils"

type AddQuestionProp = {
  updateQuiz: ({ payload }: { payload: Partial<TQuiz>; }) => Promise<void>;
  close: () => void;
  quiz?: TQuiz | null
}
export function AddQuestion({ close, updateQuiz, quiz }: AddQuestionProp) {
  const form = useForm<z.infer<typeof quizQuestionSchema>>({
   resolver: zodResolver(quizQuestionSchema),
    defaultValues: {
      options: [{ optionId: nanoid(), option: "", isAnswer: '' }],
    },
  });

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "options",
  });

  async function onSubmit(values: z.infer<typeof quizQuestionSchema>) {
      console.log('val',values)
      if (!quiz) return
      const image = new Promise( async (resolve) => {
        if (typeof values?.questionImage === "string") {
          resolve(values?.questionImage)
        }
        else if (values?.questionImage && values?.questionImage[0]) {
          const img = await uploadFile(values?.questionImage[0], "image")
          resolve(img)
        }
        else {
          resolve(null)
        }
      })

      const promise: any = await image

      const updateQuestion = {
        ...values,
        questionImage: promise
      }
      const payload: Partial<TQuiz> = {
          ...quiz,
          questions: quiz?.questions?.length > 0 ? [...quiz?.questions, {...updateQuestion}] : [{...updateQuestion}],
          totalDuration: quiz?.totalDuration > 0 ? Number(quiz?.totalDuration)+ Number(values?.duration) :  Number(values?.duration),
          totalPoints: quiz?.totalDuration > 0 ? Number(quiz?.totalPoints) + Number(values?.points): Number(values?.points),
          lastUpdated_at: new Date().toISOString()
        }
        await updateQuiz({payload})

       // const questionAnswer =null
  }

  
// console.log(form.getValues("options"))
  function handleRadioChange(id: number) {
    const optionId = form.getValues(`options.${id}.optionId`)
    const option = form.getValues(`options.${id}.option`)
    console.log(option)
    const updatedField = fields.map((field, index) => {
      return {
        ...field,
        option: index === id ? option : field.option,
        isAnswer: index === id ? optionId :""
      }
    })

    form.setValue("options", updatedField)

  }
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
          <h2 className="font-semibold text-lg sm:text-2xl">Create Question</h2>
          <Button onClick={close}>
            <CloseOutline size={22} />
          </Button>
        </div>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-start justify-start gap-y-3">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <InputOffsetLabel label="Question">
              <Input
                placeholder="Enter the  Question"
                type="text"
                {...form.register("question")}
                className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
              />
            </InputOffsetLabel>
          )}
        />
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
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem className="relative w-full h-fit">
              <FormControl>
                <ReactSelect
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
            className="w-full relative h-12 border-input grid grid-cols-12 rounded-md  px-2 pb-2 pt-1 items-center border "
          >
            <span className="absolute font-medium top-0 z-10 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">{`Option ${
              index + 1
            }`}</span>
            <label className="flex items-center justify-center col-span-1">
              <input
                {...form.register(`options.${index}.isAnswer` as const)}
                type="radio"
                name={`isAnswer`}
               value={field.optionId}
               onChange={() => handleRadioChange(index)}
                className="h-5 w-5 accent-basePrimary"
              />
            </label>
            <Input
              type="text"
              {...form.register(`options.${index}.option` as const)}
              placeholder="Enter Option"
              className="col-span-10 w-full rounded-none border-x-0 border-t-0 border-b-0"
            />
            <button
              disabled={fields.length === 1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                remove(index);
              }}
              className="col-span-1 text-red-500"
            >
              <CloseCircle size={20} />
            </button>
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
                isAnswer: '',
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
        <FormField
          control={form.control}
          name="feedBack"
          render={({ field }) => (
            <InputOffsetLabel label="Additional FeedBack">
              <Textarea
                placeholder="Enter the feedBack"
                {...form.register("feedBack")}
                className="placeholder:text-sm  focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
              ></Textarea>
            </InputOffsetLabel>
          )}
        />

        <Button className="w-full hover:bg-basePrimary/80 mt-3 gap-x-2 bg-basePrimary text-gray-50">
          {"" && <LoaderAlt size={22} className="animate-spin" />}
          <p> Submit</p>
        </Button>

        </form>
        </Form>
      </div>
    </div>
  );
}
