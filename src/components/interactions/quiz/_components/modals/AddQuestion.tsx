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
import { useForm } from "react-hook-form";
import { duration, points } from "..";
export function AddQuestion({ close }: { close: () => void }) {
  const form = useForm({});
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

        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <InputOffsetLabel label="Question">
              <Input
                placeholder="Cover Title"
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
            <FormItem className="relative h-fit">
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
            <FormItem className="relative h-fit">
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
      </div>
    </div>
  );
}
