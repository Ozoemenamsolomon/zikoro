"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { FormField } from "@/components/ui/form";
import { ReactSelect } from "@/components/custom_ui/ReactSelect";
import { Button } from "@/components/custom_ui/Button";
import { cn } from "@/lib";
import * as z from "zod";
import { formSettingSchema } from "@/schemas/engagement";
import { TQuestion, TQuiz } from "@/types";
import { useMemo } from "react";
import { TEngagementFormQuestion } from "@/types/engagements";
import { Input } from "@/components/ui/input";

export function FormIntegration({
  data,
  form,
  engagements,
}: {
  data: TEngagementFormQuestion | null;
  engagements: TQuiz<TQuestion[]>[];
  form: UseFormReturn<z.infer<typeof formSettingSchema>, any, any>;
}) {
  const isConnectedToEngagement = useWatch({
    control: form.control,
    name: "formSettings.isConnectedToEngagement",
  });
  const showForm = useWatch({
    control: form.control,
    name: "formSettings.showForm",
  });

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="w-11/12 flex flex-col items-start justify-start">
          <p className="font-medium text-mobile sm:text-sm">
            Redirect your form partcipants to your website of choice
          </p>
          <p className="text-xs  text-gray-500">
            Users will be redicted to the url you have provided when the form is
            completed.
          </p>
        </div>

        <Switch
          // disabled={loading}
          checked={isConnectedToEngagement}
          onCheckedChange={(checked) => {
            form.setValue("formSettings.isConnectedToEngagement", checked);
          }}
          className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
        />
      </div>
    {isConnectedToEngagement &&  <div className="flex flex-col w-full max-w-[350px] items-start justify-start gap-y-3">
        <FormField
          control={form.control}
          name="formSettings.redirectUrl"
          render={({ field }) => (
            <InputOffsetLabel label="Redirect URL">
              <Input
                placeholder="Redirect URL"
                type="text"
                defaultValue={data?.formSettings?.redirectUrl}
                {...form.register("formSettings.redirectUrl")}
                className="placeholder:text-sm h-11 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
              />
            </InputOffsetLabel>
          )}
        />
      </div>}
      {/* <div className="flex flex-col items-start justify-start gap-y-3">
          <p className="font-medium text-mobile sm:text-sm">
            When should user take this form
          </p>
          <div className="w-fit h-fit flex items-center bg-white p-1 border rounded-xl">
            <Button
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                form.setValue("formSettings.showForm", "beforeEngagement")
              }}
              className={cn(
                "h-11 rounded-xl text-mobile sm:text-sm font-medium w-fit px-6",
                showForm=== "beforeEngagement" && "bg-basePrimary text-white "
              )}
            >
              Before Engagement
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                form.setValue("formSettings.showForm", "afterEngagement")
              }}
              className={cn(
                "h-11 rounded-xl text-mobile sm:text-sm font-medium w-fit px-6",
                showForm=== "afterEngagement" && "bg-basePrimary text-white "
              )}
            >
              After Engagement
            </Button>
          </div>
        </div> */}
    </>
  );
}
