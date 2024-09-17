"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, UseFieldArrayRemove } from "react-hook-form";
import { PiDotsSixBold } from "react-icons/pi";
import { IoImage } from "react-icons/io5";
import { useMemo } from "react";
import { SelectedImage } from "../../formcomposables/SelectedImage";
import { z } from "zod";
import { formQuestionSchema } from "@/schemas/engagement";
import { cn } from "@/lib";
import { BottomAction } from "../../formcomposables";
export function DateType({
  form,
  index,
  remove,
  append
}: {
  form: UseFormReturn<z.infer<typeof formQuestionSchema>, any, any>;
  index: number;
remove: UseFieldArrayRemove
append:(i:number) => void;
}) {
  //const [isRequired, setIsRequired] = useState(false);

  const watchedImage = form.watch(`questions.${index}.questionImage`);

  const image = useMemo(() => {
    if (typeof watchedImage === "string") {
      return watchedImage;
    } else if (
      watchedImage &&
      watchedImage[0] &&
      watchedImage instanceof FileList
    ) {
      return URL.createObjectURL(watchedImage[0]);
    } else {
      return null;
    }
  }, [watchedImage]);
  return (
    <div className="w-full border rounded-lg flex flex-col items-start justify-start gap-y-8 p-3 bg-white">
      <PiDotsSixBold size={40} className="self-center text-gray-400" />
      {/* question */}
      <div className="w-full gap-2 grid grid-cols-10">
        <FormField
          control={form.control}
          name={`questions.${index}.question`}
          render={({ field }) => (
            <FormItem className={cn("w-full col-span-9", image && "col-span-full")}>
              <FormLabel>Question (Date)</FormLabel>
              <FormControl>
                <Input
                  {...form.register(`questions.${index}.question`)}
                  className="w-full h-12 sm:h-14 border-x-0 border-t-0 border-b px-2 placeholder:text-gray-500 bg-gradient-to-tr rounded-none from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500"
                  placeholder="Enter question"
                />
              </FormControl>
            </FormItem>
          )}
        />
        {!image && (
         <div className="w-full flex items-end justify-end">
           <label
            htmlFor={`questions.${index}.questionImage`}
            className="rounded-full  self-end w-12 sm:w-14 flex items-center justify-center h-12 sm:h-14 bg-gradient-to-tr  from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 relative"
          >
            <input
              id={`questions.${index}.questionImage`}
              type="file"
              className="w-full h-full absolute inset-0 z-20"
              accept="image/*"
              hidden
              {...form.register(`questions.${index}.questionImage`)}
            />
            <IoImage size={24} className="text-gray-700" />
          </label>
         </div>
        )}
        {image && (
          <SelectedImage form={form} index={index} image={image} />
        )}
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
      <BottomAction form={form} remove={remove} index={index} append={append}/>
  
    </div>
  );
}
