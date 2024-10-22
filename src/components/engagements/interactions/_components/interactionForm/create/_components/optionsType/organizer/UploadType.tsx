"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, UseFieldArrayRemove, useWatch} from "react-hook-form";
import { PiDotsSixBold } from "react-icons/pi";
// import { IoImage } from "react-icons/io5";
import { useMemo,  } from "react";
import { SelectedImage } from "../../formcomposables/SelectedImage";
import { z } from "zod";
import { formQuestionSchema } from "@/schemas/engagement";
import { cn } from "@/lib";
import { BottomAction } from "../../formcomposables";
//
export function UploadType({
  form,
  index,
  remove,
  append
}: {
  form: UseFormReturn<z.infer<typeof formQuestionSchema>, any, any>;
  index: number;
remove: UseFieldArrayRemove;
append: (i:number) => void;
}) {
  //const [isRequired, setIsRequired] = useState(false);
  const prevSelected = form.watch(`questions.${index}.optionFields`)

  const watchedImage = form.watch(`questions.${index}.questionImage`);

  const selectedOptions =
  useWatch({
    control: form.control,
    name: `responses.${index}.optionFields` as const,
  }) || [];

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
    <div className="w-full border rounded-lg flex flex-col items-start justify-start gap-y-8 p-4 sm:p-6 bg-white">
      <PiDotsSixBold size={40} className="self-center text-gray-400" />
      {/* question */}
      <div className="w-full gap-2 grid grid-cols-10">
        <FormField
          control={form.control}
          name={`questions.${index}.question`}
          render={({ field }) => (
            <FormItem className={cn("w-full col-span-full", image && "col-span-full")}>
              <FormLabel>Question {index+1} (Attachment/Upload)</FormLabel>
              <FormControl>
                <Input
                  {...form.register(`questions.${index}.question`)}
                  className="w-full h-12 sm:h-14 border-x-0 border-t-0 bg-transparent border-b px-2 placeholder:text-gray-500 rounded-none placeholder-gray-500"
                  placeholder="Enter question"
                />
              </FormControl>
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
        {image && (
          <SelectedImage form={form} index={index} image={image} />
        )}
      </div>
      <div className="w-full ">
        <p className="font-medium my-3">File Type</p>
        <div className="flex flex-wrap items-center justify-start gap-6 w-full">
        {["Image", "Video","Pdf", "Docx", "Excel", "PPT", "All"].map((value) => (
          <label className="flex items-center gap-x-1">
            <input 
            onChange={(e) => {
              const updatedValue = e.target.checked
              ? [
                  ...(selectedOptions || []),
                  value,
                ]
              : selectedOptions?.filter(
                  (v: any) =>
                    v?.selectedOption !==
                    value 
                );
                form.setValue(`responses.${index}.optionFields`, updatedValue)
            }}
            value={value}
            type="checkbox" checked={selectedOptions.some((v: any) => v?.option === value)} 
            className="h-[20px] pt-3 w-[20px] rounded-full mr-2 accent-basePrimary"
            />
            <span className="capitalize">{value}</span>
          </label>
        ))}
        </div>
     
      </div>
   
      {/** actions */}
    <BottomAction form={form} remove={remove} index={index} append={append}/>
    </div>
  );
}
