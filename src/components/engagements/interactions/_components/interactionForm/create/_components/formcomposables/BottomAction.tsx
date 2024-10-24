"use client";

import { Button } from "@/components";
import { Copy } from "@styled-icons/ionicons-outline/Copy";
import { Delete } from "@styled-icons/fluentui-system-regular/Delete";
import { UseFieldArrayRemove, UseFormReturn, useWatch } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { formQuestionSchema } from "@/schemas/engagement";
import { IoImage } from "react-icons/io5";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useState } from "react";

export function BottomAction({
  form,
  remove,
  index,
  append
}: {
  form: UseFormReturn<z.infer<typeof formQuestionSchema>, any, any>;
  remove: UseFieldArrayRemove;
  index: number;
  append: (i: number) => void;
}) {
  const [showDrop, setShowDrop] = useState(false)
  const isRequired = useWatch({
    control: form.control,
    name: `questions.${index}.isRequired` as const,
  });

  function onToggle() {
    const drop = document.getElementById(`action-drop${index}`)
    

    if (drop && drop?.classList.contains("hidden")) {
      drop.classList.remove('hidden')
     // drop.classList.add("block")
    }
    else if (drop) {
      drop.classList.add('hidden')
    }
    
  }
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        <p>Required</p>
        <Switch
          checked={isRequired}
          onCheckedChange={(checked) => {
            form.setValue(`questions.${index}.isRequired` as const, checked);
          }}
          className="data-[state=checked]:bg-basePrimary data-[state=unchecked]:bg-gray-500"
        />
      </div>

      <div className="flex items-center gap-x-2">
      <label
              htmlFor={`questions.${index}.questionImage`}
              className="rounded-full  self-end w-11 h-11 flex items-center justify-center bg-gradient-to-tr  from-custom-bg-gradient-start to-custom-bg-gradient-end placeholder-gray-500 relative"
            >
              <input
                id={`questions.${index}.questionImage`}
                type="file"
                className="w-full h-full absolute inset-0 z-20"
                accept="image/*"
                hidden
                {...form.register(`questions.${index}.questionImage`)}
              />
              <IoImage size={22} className="text-gray-700" />
            </label>
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            append(index);
          }}
        className="px-0 h-10 w-10 flex items-center justify-center rounded-full border border-gray-700">
          <Copy size={20} className="text-gray-700" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            remove(index);
          }}
          className="px-0 h-10 w-10 flex items-center justify-center rounded-full border border-red-500"
        >
          <Delete size={20} className="text-red-500" />
        </Button>
        <Button 
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onToggle()
        }}
        className="w-fit relative h-fit">
          <HiOutlineDotsHorizontal size={22}/>
          <ActionsDropDown index={index}/>
        </Button>
      </div>
    </div>
  );
}


function ActionsDropDown({index}:{index: number}) {
  return (
    <div id={`action-drop${index}`} className="top-5 left-6 hidden absolute">
            <div
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              const drop = document.getElementById(`action-drop${index}`)
              if (drop) {
                drop.classList.add("hidden")
              }
            }}
            id="action-backdrop" className="w-full h-full fixed inset-0 z-[60]"></div>
            <div 
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="relative bg-white w-fit rounded-lg z-[100]">
              <button
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                const desc = document.getElementById(`question-description${index}`)
                if (desc) {
                  desc.classList.remove("hidden")
                }
              }}
              id="add-description" className="p-3 w-full hover:bg-gray-50">Description</button>

            </div>
          </div>
  )
}