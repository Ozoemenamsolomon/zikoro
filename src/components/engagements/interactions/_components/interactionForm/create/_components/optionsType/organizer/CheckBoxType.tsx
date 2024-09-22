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
import { useEffect, useMemo, useState } from "react";
import { SelectedImage } from "../../formcomposables/SelectedImage";
import { z } from "zod";
import { formQuestionSchema } from "@/schemas/engagement";
import { cn } from "@/lib";
import { PiDotsSixVertical } from "react-icons/pi";
import Image from "next/image";
import { Button } from "@/components";
import { MdClose } from "react-icons/md";
import { nanoid } from "nanoid";
import { IoIosCloseCircle } from "react-icons/io";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
//

type OptionItemsType = {
  id: string;
  option: string;
  optionImage: string;
};

function OptionItem({
  option,
  removeImage,
  setOption,
  removeOption,
  index,
}: {
  option: OptionItemsType;
  removeOption: (id: string) => void;
  index: number;
  removeImage: (id: string) => void;
  setOption: (id: string, value: string, type:string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
  useSortable({ id: option?.id });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.stopPropagation();
    }
  };
  return (
    <div
    ref={setNodeRef}
    {...attributes}
    {...listeners}
    style={{
      transition,
      transform: CSS.Transform.toString(transform),
      touchAction: "none",
    }}
    role="button"
     className="w-full rounded-lg p-4  bg-gradient-to-tr  space-y-3  from-custom-bg-gradient-start to-custom-bg-gradient-end">
      <div className="w-full items-center flex justify-between">
      <PiDotsSixVertical size={30} className="text-gray-400 cursor-move" />
      <div className="w-[90%] flex flex-col items-start justify-start gap-y-3">
        <div className="flex items-center gap-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              removeOption(option.id);
            }}
          >
            <IoIosCloseCircle size={18} className="text-red-500" />
          </button>
          <p>Option {index + 1}</p>
        </div>
        <Input
          onChange={(e) => {
            e.stopPropagation()
            setOption(option.id, e.target.value, "text");
          }}
          onKeyDown={handleKeyDown} 
          value={option?.option}
          type="text"
          className="w-full h-12 sm:h-14 border-x-0 border-b border-gray-300 rounded-none border-t-0 px-2 placeholder:text-gray-400"
          placeholder="Enter Option"
        />
      </div>
      {!option.optionImage && (
        <div className=" self-end flex items-end justify-end">
          <label
            htmlFor={`optionImage${option.id}`}
            className="rounded-full  self-end w-12 sm:w-14 flex items-center justify-center h-12 sm:h-14 bg-gradient-to-tr  from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 relative"
          >
            <input
              id={`optionImage${option.id}`}
              type="file"
              className="w-full h-full absolute inset-0 z-20"
              accept="image/*"
              onChange={(e) => {
                const fileList = e.target.files;
                if (fileList && fileList[0]) {
                  const file = fileList[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setOption(option.id, reader.result as string, "image");
                    };
                    reader.readAsDataURL(file);
                  }
                }
              }}
              hidden
            />
            <IoImage size={24} className="text-gray-700" />
          </label>
        </div>
      )}
      </div>
    
      {option.optionImage && (
        <div className="w-full col-span-full rounded-lg p-4 xl:p-6  ">
          <div className="mx-auto w-full max-w-2xl relative h-[20rem] 2xl:h-[25rem] ">
            <Image
              src={option.optionImage}
              alt="selected image"
              width={1000}
              height={600}
              className="object-cover h-full rounded-lg w-full"
            />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                removeImage(option.id);
              }}
              className="absolute px-0 top-[-1rem] h-10 w-10 rounded-full bg-[#001FCC19] right-[-0.4rem]"
            >
              <MdClose size={24} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function CheckBoxType({
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
  const prevSelectedOptions = form.watch(`questions.${index}.optionFields`);
  //const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState<OptionItemsType[]>(prevSelectedOptions || [
    { id: nanoid(), option: "", optionImage: "" },
  ]);



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



  // form field
  useEffect(() => {
    if (options) {
      form.setValue(`questions.${index}.optionFields`, options);
    }
  }, [options]);

  function handleChangeOption(id: string, value: string, type: string) {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, [type === "image" ? "optionImage" : "option"]: value } : option
      )
    );
  }

  function removeOption(id: string) {
    setOptions(options.filter((option) => option.id !== id));
  }

  function removeImage(id: string) {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, optionImage: "" } : option
      )
    );
  }
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.01,
      },
    }),
    useSensor(TouchSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // get position
  const getPosition = (id: string): number | undefined =>
    options.findIndex((item) => item?.id === id);
  async function handleDrop(e: DragEndEvent) {
    if (!options) return;
    const { active, over } = e;

    if (active?.id === over?.id) return;
    const originPos = getPosition(active?.id as string)!;
    const destPos = getPosition(over?.id as string)!;
    const updatedOption = arrayMove(options, originPos, destPos);

    setOptions(updatedOption);
  }
  return (
    <div className="w-full border rounded-lg flex flex-col items-start justify-start gap-y-8 p-4 sm:p-6 bg-white">
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
              <FormLabel>Question {index+1} (CheckBox)</FormLabel>
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
      {/** Options pl-4 sm:pl-6*/}
      <div className="w-full flex flex-col items-start  justify-start gap-y-3">
        <DndContext
          collisionDetection={closestCorners}
          sensors={sensors}
          onDragEnd={handleDrop}
        >
          <SortableContext
            items={options}
            strategy={verticalListSortingStrategy}
          >
            {options.map((option, index) => (
              <OptionItem
                key={option.id}
                option={option}
                index={index}
                removeOption={removeOption}
                removeImage={removeImage}
                setOption={handleChangeOption}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOptions([
              ...options,
              { id: nanoid(), option: "", optionImage: "" },
            ]);
          }}
          className="w-fit h-fit px-0 mt-3 text-basePrimary text-sm underline"
        >
          Add New Option
        </Button>
      </div>

      {/** actions */}
      <BottomAction form={form} remove={remove} index={index} append={append} />
    </div>
  );
}
