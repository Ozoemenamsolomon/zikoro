"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/custom_ui/Button";
import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";
import { InlineIcon } from "@iconify/react";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib";
import { FormAppearance, FormGeneralSettings, FormIntegration } from "./_components";





export default function FormSettings({eventId}:{eventId:string}) {
  const router = useRouter();
  const form = useForm({});
  const [active, setActive] = useState(0);

  return (
    <div className="w-full px-4 mt-6 sm:mt-10 sm:px-6 mx-auto max-w-[1300px] ">
      <Form {...form}>
        <form className="w-full flex flex-col items-start justify-start sm:gap-y-8 gap-y-8 2xl:gap-y-10 ">
          <div className="w-full flex items-center justify-between mb-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                router.back();
              }}
              className="h-fit w-fit px-0 gap-x-2"
            >
              <ArrowBack size={20} />
              <p>Back</p>
            </Button>

            <p className="font-medium text-mobile sm:tetx-sm">Form Setting</p>

            <div className="flex items-center gap-x-2">
              <Button className="flex h-11 border border-basePrimary  items-center gap-x-2">
                <InlineIcon color="#001fcc" icon="mdi:eye" fontSize={20} />
                <p className="gradient-text bg-basePrimary font-medium">
                  Preview
                </p>
              </Button>
              <Button className="font-medium text-white bg-basePrimary rounded-lg h-11">
                Update
              </Button>
            </div>
          </div>

          <div className="w-full from-custom-bg-gradient-start flex flex-col items-start justify-start gap-y-1 to-custom-bg-gradient-end bg-gradient-to-tr rounded-lg border p-3 sm:p-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...form.register("title")}
                      className="bg-transparent border-none h-14 text-2xl placeholder:text-gray-500 placeholder:text-2xl"
                      placeholder="Form Title"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...form.register("description")}
                      className="bg-transparent border-none h-11  placeholder:text-gray-500"
                      placeholder="Form Description"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="w-full flex items-center justify-center ">
            {["Appearance", "General", "Integration"].map((item, index) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActive(index);
                }}
                key={index}
                className={cn(
                  "border-b-2 text-xs sm:text-sm pb-2 px-3 ",
                  active === index && "border-basePrimary"
                )}
              >
                {item}
              </button>
            ))}
          </div>
          {active === 2 && <FormIntegration form={form} />}
          {active === 1 && <FormGeneralSettings form={form} />}
          {active === 0 && <FormAppearance form={form}/>}
        </form>
      </Form>
    </div>
  );
}
