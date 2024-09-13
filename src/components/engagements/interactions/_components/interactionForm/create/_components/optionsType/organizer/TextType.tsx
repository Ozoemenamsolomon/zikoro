"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PiDotsSixBold } from "react-icons/pi";
import { IoImage } from "react-icons/io5";
import { Switch } from "@/components/ui/switch";
import { useMemo, useState } from "react";
import { Button } from "@/components/custom_ui/Button";
import { Copy } from "@styled-icons/ionicons-outline/Copy";
import { Delete } from "@styled-icons/fluentui-system-regular/Delete";
import { SelectedImage } from "../../formcomposables/SelectedImage";
//
export function TextType({ form }: { form: UseFormReturn<any, any, any> }) {
  const [isRequired, setIsRequired] = useState(false);

  const watchedImage = form.watch("questionImage");

  const image = useMemo(() => {
    if (typeof watchedImage === "string") {
      return watchedImage;
    } else if (watchedImage && watchedImage[0] && watchedImage instanceof FileList) {
      return URL.createObjectURL(watchedImage[0]);
    }
    else {
      return null
    }
  }, [watchedImage]);
  return (
    <div className="w-full border rounded-lg flex flex-col items-start justify-start gap-y-6 p-3 bg-white">
      <PiDotsSixBold size={40} className="self-center" />
      {/* question */}
      <div className="w-full gap-2 grid grid-cols-10">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem className="w-full col-span-9">
              <FormLabel>Question (Text)</FormLabel>
              <FormControl>
                <Input
                  {...form.register("question")}
                  className="w-full h-12 sm:h-14 px-0 border-x-0 border-t-0 border-b placeholder:text-gray-500 bg-gradient-to-tr rounded-none from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500"
                  placeholder="Enter question"
                />
              </FormControl>
            </FormItem>
          )}
        />
        {!image && (
          <label
            htmlFor={`question-image`}
            className="rounded-full self-end flex items-center justify-center h-12 sm:h-14 bg-gradient-to-tr  from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 relative"
          >
            <input
              id={`question-image`}
              type="file"
              className="w-full h-full absolute inset-0 z-20"
              accept="image/*"
              hidden
            />
            <IoImage size={40} className="text-gray-700" />
          </label>
        )}
        {image && <SelectedImage form={form} name="questionImage" image={image} />}
      </div>
      {/** Answer */}
      {/* <div className="w-full flex flex-col items-start justify-start gap-y-2">
      <FormField
          control={form.control}
          name="questionAnswer"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Answer (Text)</FormLabel>
              <FormControl>
                <Input
                  {...form.register("questionAnswer")}
                  className="w-full h-12 sm:h-14 px-0 border-x-0 border-t-0 border-b placeholder:text-gray-500 bg-transparent rounded-none  placeholder-gray-500"
                  placeholder="Enter answer"
                  required={isRequired}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div> */}
      {/** actions */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <p>Required</p>
          <Switch
            checked={isRequired}
            onClick={() => setIsRequired(!isRequired)}
            className="data-[state=checked]:bg-basePrimary data-[state=unchecked]:bg-gray-500"
          />
        </div>

        <div className="flex items-center gap-x-2">
          <Button className="px-0 h-11 w-11 flex items-center justify-start rounded-full border border-gray-700">
            <Copy size={20} className="text-gray-700" />
          </Button>
          <Button className="px-0 h-11 w-11 flex items-center justify-start rounded-full border border-red-500">
            <Delete size={20} className="text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
