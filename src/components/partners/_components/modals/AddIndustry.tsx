"use client";

import { Form, FormField, Input, InputOffsetLabel, Button } from "@/components";
import { ArrowBackOutline } from "@styled-icons/evaicons-outline/ArrowBackOutline";
import { useForm } from "react-hook-form";
import { CirclePicker } from "react-color";
import { CheckCircleFill } from "@styled-icons/bootstrap/CheckCircleFill";
import { CloseOutline } from "styled-icons/evaicons-outline";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import React, { useMemo, useState } from "react";
import { cn } from "@/lib";
import toast from "react-hot-toast";
import {IndustryType} from "@/types"

type FormValue = {
  name: string;
};


export function AddIndustry({
  setActive,
  close,
  handleSelected,
  selectedIndustry,
}: {
  close: () => void;
  handleSelected:(name:string, color:string) => void;
  selectedIndustry: IndustryType | null
  setActive: React.Dispatch<React.SetStateAction<number>>;
}) {
  const form = useForm<FormValue>();
  const [industryColor, setIndustryColor] = useState<string>("");
  const [createdIndustry, setCreatedIndustry] = useState<IndustryType[]>([]);


  async function onSubmit(value: FormValue) {
    if (industryColor === "") {
      toast.error("Pls, Select a Color");
    }

    setCreatedIndustry((prev) => [
      ...prev,
      { name: value.name, color: industryColor },
    ]);
  }


  // FN to remove from the list of industries
  function remove(id: number) {
    const updatedList = createdIndustry.filter((_, index) => index !== id);

    setCreatedIndustry(updatedList);
  }
  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100] inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[500px] box-animation h-fit flex flex-col gap-y-6 rounded-lg bg-white m-auto absolute inset-0 py-8 px-3 sm:px-6"
      >
        <div className="w-full flex items-center gap-x-2">
          <Button onClick={() => setActive(1)} className="px-1 h-fit w-fit">
            <ArrowBackOutline size={22} />
          </Button>
          <h2 className="font-medium text-lg sm:text-xl">
            Create New Industry
          </h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start w-full flex-col gap-y-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <InputOffsetLabel label="Industry Name">
                  <Input
                    type="text"
                    placeholder="Industry"
                    {...field}
                    className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="w-full my-8 h-fit"
            >
              <CirclePicker
                width="100%"
                color={industryColor}
                onChangeComplete={(color) => setIndustryColor(color.hex)}
                circleSize={36}
              />
            </div>
            {createdIndustry?.length > 0 && (
              <div className="w-full flex flex-col gap-y-4 items-start justify-start">
                <h3>Your Created Industry</h3>

                <div className="w-full flex flex-wrap items-center gap-4">
                  {createdIndustry.map(({ name, color }, id) => (
                    <CreatedIndustry
                      handleSelected={handleSelected}
                      name={name}
                      remove={remove}
                      id={id}
                      color={color}
                      selectedIndustry={selectedIndustry}
                    />
                  ))}
                </div>
              </div>
            )}
            <Button
              disabled={false}
              className="mt-4 h-12 w-full gap-x-2 bg-zikoro text-gray-50 font-medium"
            >
              {"" && <LoaderAlt size={22} className="animate-spin" />}
              <span>Create Industry</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

function CreatedIndustry({
  color,
  name,
  remove,
  id,
  selectedIndustry,
  handleSelected,
}: {
  color: string;
  name: string;
  remove: (id: number) => void;
  id: number;
  selectedIndustry: IndustryType | null;
  handleSelected: (name: string, color: string) => void;
}) {
  const rgba = useMemo(
    (alpha = 0.1) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    [color]
  );
  return (
    <Button
      style={{ backgroundColor: rgba, color }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleSelected(name, color);
      }}
      className={cn(
        `relative  rounded-none bg-opacity-20  `,
        selectedIndustry?.name === name && "border-zikoro border"
      )}
    >
      <span className="font-medium capitalize"> {name}</span>
      <div
        className="absolute top-[-14px] right-[-13px]"
        onClick={(e) => e.stopPropagation()}
      >
        {selectedIndustry?.name === name ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              remove(id);
            }}
          >
            <CheckCircleFill className="text-zikoro" size={16} />
          </button>
        ) : (
          <button
            className="rounded-full p-1 bg-gray-100 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              remove(id);
            }}
          >
            <CloseOutline className="text-[#717171]" size={16} />
          </button>
        )}
      </div>
    </Button>
  );
}
