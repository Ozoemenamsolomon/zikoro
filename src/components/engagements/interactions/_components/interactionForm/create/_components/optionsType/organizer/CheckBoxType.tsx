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
import { BottomAction } from "../../formcomposables";
import { useMemo, useState } from "react";
import { SelectedImage } from "../../formcomposables/SelectedImage";
import { z } from "zod";
import { formQuestionSchema } from "@/schemas/engagement";
import { cn } from "@/lib";
import { PiDotsSixVertical } from "react-icons/pi";
import Image from "next/image";
import { Button } from "@/components";
import { MdClose } from "react-icons/md";
import { nanoid } from "nanoid";

//

type OptionItemsType = {
    optionId: string;
    option: string;
    optionImage: string;
}

function OptionItem({option, remove,setOption, index}:{option: OptionItemsType, index: number, remove: (id: string) => void, setOption: (id: string, value: string) => void}) {


    return (
        <div className="w-full bg-gradient-to-tr rounded-lg p-4 grid grid-cols-10 from-custom-bg-gradient-start to-custom-bg-gradient-end">
             <PiDotsSixVertical size={24} className="text-gray-400"/>
            <div className="w-full col-span-8 flex flex-col items-start justify-start gap-y-3">
                <p>Option {index + 1}</p>
                <Input value={option?.option} className="w-full h-12 sm:h-14 border-x-0 border-b border-t-0 px-2 placeholder:text-gray-400" placeholder="Enter Option"/>
            </div>
             {!option.optionImage && (
         <div className="w-full flex items-end justify-end">
           <label
            htmlFor={`optionImage${option.optionId}`}
            className="rounded-full  self-end w-12 sm:w-14 flex items-center justify-center h-12 sm:h-14 bg-gradient-to-tr  from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 relative"
          >
            <input
              id={`optionImage${option.optionId}`}
              type="file"
              className="w-full h-full absolute inset-0 z-20"
              accept="image/*"
              hidden
             
            />
            <IoImage size={24} className="text-gray-700" />
          </label>
         </div>
        )}
        {option.optionImage && (
           <div className="w-full col-span-full rounded-lg p-4 xl:p-6 bg-white border-[8px] border-[#001ffc]/10 ">
           <div className="mx-auto w-full max-w-2xl relative h-[20rem] 2xl:h-[25rem] ">
               <Image src={option.optionImage} alt="selected image" width={1000} height={600} className="object-cover h-full w-full" />
               <Button
               onClick={(e) => {
                   e.stopPropagation()
                   e.preventDefault()
                   remove(option.optionId)
               }}
               className="absolute px-0 top-[-1rem] h-10 w-10 rounded-full bg-[#001FCC19] right-[-0.4rem]">
                   <MdClose size={24} />
               </Button>
           </div>
       </div>
        )}
        </div>
    )
}

export function CheckBoxType({
  form,
  index,
  remove
}: {
  form: UseFormReturn<z.infer<typeof formQuestionSchema>, any, any>;
  index: number;
remove: UseFieldArrayRemove
}) {
  //const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState<OptionItemsType[]>([{optionId: nanoid(), option: "", optionImage: ""}])

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

  function handleChangeOption(id: string, value: string) {

setOptions(options.map(option => option.optionId === id ? {...option, option: value} : option))

  }

  function removeOption(id: string) {
    setOptions(options.filter((option) => option.optionId !== id))
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
            <FormItem className={cn("w-full col-span-9", image && "col-span-full")}>
              <FormLabel>Question (CheckBox)</FormLabel>
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
      {/** Options*/}
      <div className="w-full flex flex-col items-start justify-start gap-y-3">
       {options.map((option, index) => (
        <OptionItem key={option.optionId} option={option} index={index} remove={removeOption} setOption={handleChangeOption}/>
       ))}
      </div>
     
      {/** actions */}
      <BottomAction form={form} remove={remove} index={index}/>
    </div>
  );
}


