"use client";

import {
  Form,
  FormField,
  Input,
  Button,
  Textarea,
} from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { Switch } from "@/components/ui/switch";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { useForm } from "react-hook-form";
import * as z from "zod"
import { quizSettingSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {useState} from "react"
import {TQuiz} from "@/types"
export function QuizSettings({ close }: { close: () => void }) {
  const [isEventName, setShowEventName] = useState(false)
  const [isPoweredBy, setShowPooweredBy] = useState(false)
  const form = useForm<z.infer<typeof quizSettingSchema>>({
    resolver: zodResolver(quizSettingSchema)
  });

  async function onSubmit(values: z.infer<typeof quizSettingSchema>) {
    const payload: Partial<TQuiz> = {
      branding: {
        ...values,
        poweredBy: isPoweredBy,
        eventName: isEventName,
       
      }
    }
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
        className="py-6 px-4 w-[95%] max-w-xl m-auto rounded-lg bg-white absolute inset-0 overflow-y-auto max-h-[85%] h-fit"
      >
        <div className="flex mb-4 items-center justify-between w-full">
          <h2 className="font-semibold text-lg sm:text-2xl">Quiz Settings</h2>
          <Button onClick={close}>
            <CloseOutline size={22} />
          </Button>
        </div>
        <Form {...form}>
          <form className="w-full flex items-start justify-start flex-col gap-y-3">
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

            <p className="font-semibold">Branding</p>

            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <p>Show Event Name</p>
              <Switch className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"/>
            </div>
            <div className="flex w-full text-mobile sm:text-sm items-center justify-between">
              <p>Show Powered by Zikoro</p>
              <Switch className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"/>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
