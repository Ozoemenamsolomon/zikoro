"use client";

import { Button } from "@/components";
import { Copy } from "@styled-icons/ionicons-outline/Copy";
import { Delete } from "@styled-icons/fluentui-system-regular/Delete";
import { UseFieldArrayRemove, UseFormReturn, useWatch } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { formQuestionSchema } from "@/schemas/engagement";

export function BottomAction({
  form,
  remove,
  index,
}: {
  form: UseFormReturn<z.infer<typeof formQuestionSchema>, any, any>;
  remove: UseFieldArrayRemove;
  index: number;
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
        <Button className="px-0 h-10 w-10 flex items-center justify-center rounded-full border border-gray-700">
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
