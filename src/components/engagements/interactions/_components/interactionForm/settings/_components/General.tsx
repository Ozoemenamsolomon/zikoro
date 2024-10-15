"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import * as z from "zod";
import { formSettingSchema } from "@/schemas/engagement";

export function FormGeneralSettings({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSettingSchema>, any, any>;
}) {
  const isCollectUserEmail = useWatch({
    control: form.control,
    name: "formSettings.isCollectUserEmail",
  });
  const isCoverScreen = useWatch({
    control: form.control,
    name: "formSettings.isCoverScreen",
  });
  return (
    <div className="w-full flex flex-col items-start justify-start gap-y-4">
      <div className="w-full flex items-start justify-between">
        <div className="w-11/12 flex flex-col items-start justify-start">
          <p className="font-medium text-mobile sm:text-sm">
            Collect email during response in settings
          </p>
          <p className="text-xs text-gray-500">
            Only possible if users answering are registered for this event
          </p>
        </div>

        <Switch
          // disabled={loading}
          checked={isCollectUserEmail}
          onCheckedChange={(checked) => {
            form.setValue("formSettings.isCollectUserEmail", checked);
          }}
          className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
        />
      </div>
      <div className="w-full flex items-start justify-between">
        <div className="w-11/12 flex flex-col items-start justify-start">
          <p className="font-medium text-mobile sm:text-sm">
            Enable cover screen before form
          </p>
          <p className="text-xs text-gray-500">
            Show a cover screen to introduce user before the start of the form
          </p>
        </div>

        <Switch
          // disabled={loading}
          checked={isCoverScreen}
          onCheckedChange={(checked) => {
            form.setValue("formSettings.isCoverScreen", checked);
          }}
          onClick={() => {}}
          className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
        />
      </div>

      <div className="w-full flex items-start justify-between">
        <div className="w-11/12 flex flex-col items-start justify-start">
          <p className="font-medium text-mobile sm:text-sm">
            Display cover image on form page
          </p>
          <p className="text-xs text-gray-500"></p>
        </div>

        <Switch
          // disabled={loading}
          //  checked={accessibility?.isCollectPhone}
          // onClick={() => {}}
          className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
        />
      </div>
    </div>
  );
}
