import { UseFormReturn } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { AddCoverImage } from "../../create/_components/formcomposables";
import { useState } from "react";
import { FormListingType, FormSlideType } from "@/constants";
import { ColorPickerWidget } from "@/components/composables/ColorPickerWidget";
import { NumberSelectorWidget } from "@/components/composables";

function ColorWidget({
  form,
  title,
}: {
  title: string;
  form: UseFormReturn<any, any, any>;
}) {
  return (
    <div className="flex flex-col items-start justify-start gap-y-3">
      <p className="font-medium text-mobile sm:text-sm">{title}</p>
      <ColorPickerWidget name={""} form={form} />
    </div>
  );
}

function NumberWidget({
  form,
  title,
  name,
  value,
}: {
  title: string;
  form: UseFormReturn<any, any, any>;
  name: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-start justify-start gap-y-3">
      <p className="font-medium text-mobile sm:text-sm">{title}</p>
      <NumberSelectorWidget name={name} value={value} />
    </div>
  );
}

export function FormAppearance({
  form,
}: {
  form: UseFormReturn<any, any, any>;
}) {
  const [displayType, setDisplayType] = useState(false);
  return (
    <div className="w-full flex flex-col items-start justify-start gap-y-4 sm:gap-y-6">
      <div className="w-full flex items-start gap-x-4">
        <div className="flex flex-col items-start justify-start">
          <p className="font-medium text-mobile sm:text-sm">Cover Image</p>
          <p className="text-xs sm:text-mobile text-gray-500">
            Enable cover image of the form
          </p>
        </div>

        <Switch
          // disabled={loading}
          //  checked={accessibility?.isCollectPhone}
          onClick={() => {}}
          className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
        />
      </div>

      <AddCoverImage form={form} />

      <div className="w-full flex flex-col items-start justify-start gap-y-3">
        <div className="space-y-1">
          <p className="font-medium text-mobile sm:text-sm">Display Type</p>
          <p className="text-gray-500 text-xs">
            Pick your question display type
          </p>
        </div>
        <div className="flex sm:flex-row flex-col items-center gap-4">
          <button className="w-fit h-fit rounded-md border hover:border-basePrimary">
            <FormListingType />
          </button>
          <button className="w-fit h-fit rounded-md border hover:border-basePrimary">
            <FormSlideType />
          </button>
        </div>
      </div>
      <NumberWidget
        form={form}
        title="Question per slides"
        value={1}
        name="question"
      />
      <ColorWidget form={form} title="Background Color" />
      <ColorWidget form={form} title="Text Color" />
      <ColorWidget form={form} title="Button Color" />
      <NumberWidget
        form={form}
        title="Form title font size"
        value={24}
        name="title"
      />
      <NumberWidget
        form={form}
        title="Heading font size"
        value={36}
        name="heading"
      />
      <NumberWidget form={form} title="Text size" value={14} name="text" />
    </div>
  );
}
