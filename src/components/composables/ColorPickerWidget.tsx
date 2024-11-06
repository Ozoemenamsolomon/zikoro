"use client";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TwitterPicker } from "react-color";
import { cn } from "@/lib";
import { Input } from "../ui/input";



function ColorPicker({
  form,
  close,
  name,
  colors
}: {
  form: UseFormReturn<any, any, any>;
  close: () => void;
  name: any;
  colors:string[]
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      className="absolute top-12"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          close();
        }}
        className="w-full h-full inset-0 fixed z-[100]"
      ></button>
      <div className="w-[200px] relative z-[150]">
        <TwitterPicker
          color={form.watch(name)}
          colors={colors}
          onChange={(color, event) => form.setValue(name, color.hex)}
          className="h-[250px] w-[200px]"
        />
      </div>
    </div>
  );
}

export function ColorPickerWidget({
  name,
  className,
  form,
  currentColor,
  colors
}: {
  form: UseFormReturn<any, any, any>;
  name: any;
  className?: string;
  currentColor:string;
  colors:string[]
}) {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <div className={cn("border h-12 flex items-center rounded-md p-1", className)}>
      <div
        style={{
          backgroundColor: currentColor || "#001ffc",
        }}
        onClick={() => setShowPicker((prev) => !prev)}
        className="relative h-full rounded-md w-[100px]"
      >
        {showPicker && (
          <ColorPicker
            close={() => setShowPicker((prev) => !prev)}
            form={form}
            name={name}
            colors={colors}
          />
        )}
      </div>
      <Input
        type="text"
        placeholder="#001FFC"
        readOnly
        {...form.register(name)}
        className="placeholder:text-sm border-0 w-[70px]  px-1 h-full text-zinc-700"
      />
    </div>
  );
}
