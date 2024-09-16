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
import { useMemo, useState } from "react";
import { SelectedImage } from "../../formcomposables/SelectedImage";
import { z } from "zod";
import { formQuestionSchema } from "@/schemas/engagement";
import { cn } from "@/lib";
import { BottomAction } from "../../formcomposables";
import { HiOutlineStar } from "react-icons/hi2";
//
export function RatingType({
  form,
  index,
  remove,
}: {
  form: UseFormReturn<z.infer<typeof formQuestionSchema>, any, any>;
  index: number;
  remove: UseFieldArrayRemove;
}) {
  const [selectedRating, setSelectedRating] = useState(5);
  const [isOpen, setOpen] = useState(false);
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

  function handleToggle() {
    setOpen((p) => !p);
  }

  return (
    <div className="w-full border rounded-lg flex flex-col items-start justify-start gap-y-8 p-3 bg-white">
      <PiDotsSixBold size={40} className="self-center text-gray-400" />
      {/* question */}
      <div className="w-full gap-2 grid grid-cols-10">
        <FormField
          control={form.control}
          name={`questions.${index}.question`}
          render={({ field }) => (
            <FormItem
              className={cn("w-full col-span-9", image && "col-span-full")}
            >
              <FormLabel>Question (Text)</FormLabel>
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
        {image && <SelectedImage form={form} index={index} image={image} />}
      </div>

      <div className="w-full flex items-center gap-x-3 justify-center p-3">
        <p>Choose Level:</p>
        <div className="relative">
          <p className="border rounded-lg px-3 py-2">{selectedRating}</p>

          {isOpen && (
            <div className="absolute top-9">
              <div
                onClick={() => setOpen(false)}
                role="button"
                className="w-full h-full inset-0 fixed z-[98]"
              ></div>
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white rounded-lg border w-[50px] z-[100]"
              >
                {[...Array(10)].map((value, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedRating(value)}
                    className="w-full flex items-center justify-center p-2 hover:bg-gray-200"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-2">
          {[...Array(selectedRating)].map((_, index) => (
            <HiOutlineStar size={28} key={index} />
          ))}
        </div>
      </div>

      {/** actions */}
      <BottomAction form={form} remove={remove} index={index} />
    </div>
  );
}
