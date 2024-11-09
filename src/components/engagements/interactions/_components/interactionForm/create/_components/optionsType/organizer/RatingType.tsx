"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, UseFieldArrayRemove } from "react-hook-form";
import { PiDotsSixBold } from "react-icons/pi";
// import { IoImage } from "react-icons/io5";
import { useEffect, useMemo, useState } from "react";
import { SelectedImage } from "../../formcomposables/SelectedImage";
import { z } from "zod";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { formQuestionSchema } from "@/schemas/engagement";
import { cn } from "@/lib";
import { BottomAction } from "../../formcomposables";
import { HiOutlineStar } from "react-icons/hi2";
//
export function RatingType({
  form,
  index,
  remove,
  append
}: {
  form: UseFormReturn<z.infer<typeof formQuestionSchema>, any, any>;
  index: number;
  remove: UseFieldArrayRemove;
  append:(i:number) => void;
}) {
  const prevSelectedRating = form.watch(`questions.${index}.optionFields`)
  const [selectedRating, setSelectedRating] = useState(parseInt(prevSelectedRating) || 5);
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


  useEffect(() => {
if (selectedRating) {
  form.setValue(`questions.${index}.optionFields`, selectedRating)
}
  },[selectedRating])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.stopPropagation();
    }
  };

  return (
    <div className="w-full border rounded-lg flex flex-col items-start justify-start gap-y-6 p-4 sm:p-6 bg-white">
      <PiDotsSixBold size={40} className="self-center text-gray-400" />
      {/* question */}
      <div className="w-full gap-2 grid grid-cols-10">
        <FormField
          control={form.control}
          name={`questions.${index}.question`}
          render={({ field }) => (
            <FormItem
              className={cn("w-full col-span-full", image && "col-span-full")}
            >
              <FormLabel>Question {index+1} (Rating)</FormLabel>
              <FormControl>
                <Input
                  {...form.register(`questions.${index}.question`)}
                  className="w-full h-12 sm:h-14 border-x-0 border-t-0 border-b px-2 placeholder:text-gray-500 bg-transparent rounded-none placeholder-gray-500"
                  placeholder="Enter question"
                  onKeyDown={handleKeyDown} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* {!image && (
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
        )} */}
        {image && <SelectedImage form={form} index={index} image={image} />}
      </div>
      <div id={`question-description${index}`} className="w-full hidden">
      <FormField
        control={form.control}
        name={`questions.${index}.questionDescription`}
        render={({ field }) => (
          <FormItem className={cn("w-full")}>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input
                {...form.register(`questions.${index}.questionDescription`)}
                className="w-full h-12 sm:h-14 border-x-0 border-t-0 bg-transparent border-b px-2 placeholder:text-gray-500 rounded-none placeholder-gray-500"
                placeholder="Enter Description"
                onKeyDown={handleKeyDown} 
              />
            </FormControl>
          </FormItem>
        )}
      />
      </div>

      <div className="w-full flex items-center gap-x-3 justify-center p-3">
        <p>Choose Level:</p>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleToggle();
            }}
            className="border flex items-center gap-x-1 rounded-lg px-3 py-2"
          >
            {selectedRating}
            <MdOutlineKeyboardArrowDown size={16} className="text-gray-300"/>
          </button>

          {isOpen && (
            <div className="absolute top-9">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpen(false);
                }}
                role="button"
                className="w-full h-full inset-0 fixed z-[98]"
              ></div>
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white rounded-lg max-h-[250px]  overflow-y-auto no-scrollbar border w-[50px] z-[100]"
              >
                {[1,2,3,4,5,6,7,8,9,10].map((value, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setSelectedRating(value);
                      setOpen(false)
                    }}
                    className="w-full flex items-center text-zinc-700 justify-center p-2 hover:bg-gray-200"
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
            <HiOutlineStar className="text-gray-300" size={28} key={index} />
          ))}
        </div>
      </div>

      {/** actions */}
      <BottomAction form={form} remove={remove} index={index} append={append} />
    </div>
  );
}
