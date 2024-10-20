"use client"

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

export function FormIntegration({data, form, engagements }: {data: TEngagementFormQuestion | null, engagements: TQuiz<TQuestion[]>[]; form: UseFormReturn<z.infer<typeof formSettingSchema>, any, any> }) {

    const isConnectedToEngagement = useWatch({
      control: form.control,
      name: 'formSettings.isConnectedToEngagement'
    })
    const showForm = useWatch({
      control: form.control,
      name: 'formSettings.showForm'
    })

    const engagementOptions  = useMemo(() => {
      if (engagements) {
        return engagements?.map((value) => {
          return {
            value: value?.quizAlias,
            label: value?.coverTitle
          }
        })
      }
      else {
        return []
      }
    },[engagements])

    const initialEngagementValue = useMemo(() => {
      if (data && engagementOptions) {
          return engagementOptions?.find((value) => value.value === data?.formSettings?.connectedEngagementId)
      }
      return ''
    },[data, engagementOptions])


    return (
      <>
        <div className="w-full flex items-center justify-between">
          <div className="w-11/12 flex flex-col items-start justify-start">
            <p className="font-medium text-mobile sm:text-sm">
              Connect the form with other engagement tools
            </p>
            <p className="text-xs  text-gray-500">
              Embed your form into any engagement, allowing users to fill it out
              either before or after the engagement.
            </p>
          </div>
  
          <Switch
            // disabled={loading}
              checked={isConnectedToEngagement}
              onCheckedChange={(checked) => {
                form.setValue("formSettings.isConnectedToEngagement", checked)
              }}
            
            className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-y-3">
          <p className="font-medium text-mobile sm:text-sm">
            Choose engagement to add form
          </p>
          <FormField
            control={form.control}
            name="formSettings.connectedEngagementId"
            render={({ field }) => (
              <InputOffsetLabel label="">
                <ReactSelect
                  {...field}
                  defaultValue={initialEngagementValue}
                  placeHolder="Select an Engagement"
                  options={engagementOptions}
                />
              </InputOffsetLabel>
            )}
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-y-3">
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
        </div>
      </>
    );
  }
  