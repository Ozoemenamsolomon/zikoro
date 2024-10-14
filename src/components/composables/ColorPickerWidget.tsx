"use client";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TwitterPicker } from "react-color";
import { cn } from "@/lib";

const colors = [
  "#4D4D4D",
  "#999999",
  "#FFFFFF",
  "#F44E3B",
  "#FE9200",
  "#FCDC00",
  "#DBDF00",
  "#A4DD00",
  "#68CCCA",
  "#73D8FF",
  "#AEA1FF",
  "#FDA1FF",
  "#333333",
  "#808080",
  "#cccccc",
  "#D33115",
  "#E27300",
  "#FCC400",
  "#B0BC00",
  "#68BC00",
  "#16A5A5",
  "#009CE0",
  "#7B64FF",
  "#FA28FF",
  "#000000",
  "#666666",
  "#B3B3B3",
  "#9F0500",
  "#C45100",
  "#FB9E00",
  "#808900",
  "#194D33",
  "#0C797D",
  "#0062B1",
  "#653294",
  "#AB149E",
];

function ColorPicker({
  form,
  close,
  name,
}: {
  form: UseFormReturn<any, any, any>;
  close: () => void;
  name: any;
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
}: {
  form: UseFormReturn<any, any, any>;
  name: any;
  className?: string;
}) {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <div className={cn("border h-12 rounded-xl p-2", className)}>
      {showPicker && (
        <ColorPicker
          close={() => setShowPicker((prev) => !prev)}
          form={form}
          name={name}
        />
      )}
    </div>
  );
}
