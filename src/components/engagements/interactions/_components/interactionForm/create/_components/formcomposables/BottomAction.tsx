"use client";

import { Button } from "@/components";
import { Copy } from "@styled-icons/ionicons-outline/Copy";
import { Delete } from "@styled-icons/fluentui-system-regular/Delete";
import { UseFieldArrayRemove, UseFormReturn, useWatch } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { formQuestionSchema } from "@/schemas/engagement";
import { IoImage } from "react-icons/io5";

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
  const isRequired = useWatch({
    control: form.control,
    name: `questions.${index}.isRequired` as const,
  });
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
      </div>
    </div>
  );
}
