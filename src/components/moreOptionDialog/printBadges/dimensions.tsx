import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { PAPER_SIZES } from "@/utils/paperSizes";

const DimensionsSchema = z.object({
  badgeWidth: z.string(),
  badgeHeight: z.string(),
  orientation: z.string(),
  paperSize: z.string(),
  width: z.number(),
  height: z.number(),
  topMargin: z.string(),
  bottomMargin: z.string(),
  leftMargin: z.string(),
  rightMargin: z.string(),
});

export type TDimensions = z.infer<typeof DimensionsSchema>;

const Dimensions = ({
  updateBadgeSize,
}: {
  updateBadgeSize: (dimensions: TDimensions) => void;
}) => {
  const defaultValues: Partial<TDimensions> = {
    orientation: "portrait",
    paperSize: "letter",
  };

  const form = useForm<TDimensions>({
    resolver: zodResolver(DimensionsSchema),
    defaultValues,
  });

  const { watch, setValue } = form;

  const paperSize = watch("paperSize");

  useEffect(() => {
    if (paperSize === "custom") return;

    const paperType = PAPER_SIZES.find(({ label }) => paperSize === label);

    if (!paperType) return;
    setValue("width", paperType.value.width);
    setValue("height", paperType.value.height);
  }, [paperSize]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(updateBadgeSize)} className="space-y-6">
        <div className="flex gap-4 h-fit">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="badgeWidth"
              render={({ field }) => (
                <InputOffsetLabel
                  prepend={
                    <span className="text-sm text-gray-700 font-medium">
                      cm
                    </span>
                  }
                  isRequired
                  label="Badge Width"
                >
                  <Input
                    type="number"
                    placeholder="Enter badge width"
                    {...field}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="badgeHeight"
              render={({ field }) => (
                <InputOffsetLabel
                  prepend={
                    <span className="text-sm text-gray-700 font-medium">
                      cm
                    </span>
                  }
                  isRequired
                  label={"Badge Height"}
                >
                  <Input
                    type="number"
                    placeholder={"Enter badge height"}
                    {...field}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="orientation"
          render={({ field }) => (
            <InputOffsetLabel isRequired label={"Orientation"}>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Select orientation"
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={"portrait"}>Portrait</SelectItem>
                  <SelectItem value={"landscape"}>Landscape</SelectItem>
                </SelectContent>
              </Select>
            </InputOffsetLabel>
          )}
        />
        <FormField
          control={form.control}
          name="paperSize"
          render={({ field }) => (
            <InputOffsetLabel isRequired label={"paper sizes"}>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Select paper sizes"
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="h-64 hide-scrollbar overflow-auto">
                  {PAPER_SIZES.map(({ label, value }) => (
                    <SelectItem value={label}>
                      <span className="capitalize">{label}</span>{" "}
                      <span className="text-gray-500">
                        ({value.width}cm x {value.height}cm)
                      </span>
                    </SelectItem>
                  ))}
                  <SelectItem value={"custom"}>Custom Size</SelectItem>
                </SelectContent>
              </Select>
            </InputOffsetLabel>
          )}
        />

        <div className="flex gap-4 h-fit">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <InputOffsetLabel
                  prepend={
                    <span className="text-sm text-gray-700 font-medium">
                      cm
                    </span>
                  }
                  isRequired
                  label="Width"
                >
                  <Input
                    type="number"
                    placeholder="Enter paper width"
                    {...field}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
                    disabled={paperSize !== "custom"}
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <InputOffsetLabel
                  prepend={
                    <span className="text-sm text-gray-700 font-medium">
                      cm
                    </span>
                  }
                  isRequired
                  label={"Height"}
                >
                  <Input
                    type="number"
                    placeholder={"Enter paper height"}
                    {...field}
                    disabled={paperSize !== "custom"}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
        </div>
        <div className="flex gap-4 h-fit">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="topMargin"
              render={({ field }) => (
                <InputOffsetLabel
                  prepend={
                    <span className="text-sm text-gray-700 font-medium">
                      cm
                    </span>
                  }
                  isRequired
                  label="Top Margin"
                >
                  <Input
                    type="number"
                    placeholder="Enter top margin"
                    {...field}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="bottomMargin"
              render={({ field }) => (
                <InputOffsetLabel
                  prepend={
                    <span className="text-sm text-gray-700 font-medium">
                      cm
                    </span>
                  }
                  isRequired
                  label={"Bottom Margin"}
                >
                  <Input
                    type="number"
                    placeholder={"Enter bottom margin"}
                    {...field}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
        </div>
        <div className="flex gap-4 h-fit">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="leftMargin"
              render={({ field }) => (
                <InputOffsetLabel
                  prepend={
                    <span className="text-sm text-gray-700 font-medium">
                      cm
                    </span>
                  }
                  isRequired
                  label="Left Margin"
                >
                  <Input
                    type="number"
                    placeholder="Enter left margin"
                    {...field}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="rightMargin"
              render={({ field }) => (
                <InputOffsetLabel
                  prepend={
                    <span className="text-sm text-gray-700 font-medium">
                      cm
                    </span>
                  }
                  isRequired
                  label={"Right Margin"}
                >
                  <Input
                    type="number"
                    placeholder={"Enter right margin"}
                    {...field}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
        </div>
        <Button type="submit" className="bg-basePrimary w-full">
          Preview
        </Button>
      </form>
    </Form>
  );
};

export default Dimensions;
