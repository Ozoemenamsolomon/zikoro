import { InlineIcon } from "@iconify/react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

export function NumberSelectorWidget({
  name,
  value,
  form,
}: {
  value: string;
  name: string;
  form: UseFormReturn<any, any, any>;
}) {
  return (
    <div className="w-[200px] h-12 flex items-center justify-between rounded-md px-4 py-2 border">
      <input
        type="number"
        readOnly
        value={value}
        className="outline-none h-12 bg-transparent w-[40px] border-0 text-xl"
      />
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            form.setValue(name, String(parseInt(value) + 1));
          }}
        >
          <InlineIcon icon="iconamoon:arrow-up-2-thin" fontSize={28} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (parseInt(value) >= 1) {
              form.setValue(name, String(parseInt(value) - 1));
            }
          }}
          className="pb-2"
        >
          <InlineIcon icon="simple-line-icons:arrow-down" fontSize={14} />
        </button>
      </div>
    </div>
  );
}
