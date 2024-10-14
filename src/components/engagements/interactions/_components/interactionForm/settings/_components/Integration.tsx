import { UseFormReturn } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { FormField } from "@/components/ui/form";
import { ReactSelect } from "@/components/custom_ui/ReactSelect";
import { Button } from "@/components/custom_ui/Button";
import { cn } from "@/lib";


export function FormIntegration({ form }: { form: UseFormReturn<any, any, any> }) {
    const [isBefore, setIsBefore] = useState(true);
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
            //  checked={accessibility?.isCollectPhone}
            onClick={() => {}}
            className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-y-3">
          <p className="font-medium text-mobile sm:text-sm">
            Choose engagement to add form
          </p>
          <FormField
            control={form.control}
            name="engagementId"
            render={({ field }) => (
              <InputOffsetLabel label="">
                <ReactSelect
                  {...field}
                  placeHolder="Select an Engagement"
                  options={[{ value: "A", label: "A" }]}
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
                setIsBefore(!isBefore);
              }}
              className={cn(
                "h-11 rounded-xl text-mobile sm:text-sm font-medium w-fit px-6",
                isBefore && "bg-basePrimary text-white "
              )}
            >
              Before Engagement
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsBefore(!isBefore);
              }}
              className={cn(
                "h-11 rounded-xl text-mobile sm:text-sm font-medium w-fit px-6",
                !isBefore && "bg-basePrimary text-white "
              )}
            >
              After Engagement
            </Button>
          </div>
        </div>
      </>
    );
  }
  