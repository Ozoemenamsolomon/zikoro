import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { TIME_ZONES } from "@/utils/timezones";

const CreateEmailSchema = z
  .object({
    title: z.string(),
    subject: z.string(),
    sender: z.string(),
    replyTo: z.string().optional(),
    recipients: z.array(z.string().email()),
    content: z.string(),
    isScheduled: z.boolean(),
    schedule: z.date().optional(),
    timezone: z.string().optional(),
  })
  .superRefine(({ isScheduled, schedule, timezone }, refinementContext) => {
    console.log(isScheduled, schedule, timezone);
    if (isScheduled && !schedule) {
      return refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: "please select a time",
        path: ["schedule"],
      });
    }
    if (isScheduled && !timezone) {
      return refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: "please select a timezone",
        path: ["timezone"],
      });
    }
  });

type TCreateEmail = z.infer<typeof CreateEmailSchema>;

const Create = () => {
  const defaultValues: Partial<TCreateEmail> = {
    sender: "your organization",
    isScheduled: false,
  };

  const form = useForm<TCreateEmail>({
    resolver: zodResolver(CreateEmailSchema),
    defaultValues,
  });

  const { watch, setValue } = form;

  const isScheduled = watch("isScheduled");

  const onSubmit = (data: TCreateEmail) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-4 py-4"
      >
        <div className="flex gap-4 h-fit">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <InputOffsetLabel isRequired label="Title">
                  <Input
                    type="string"
                    placeholder="Enter campaign title"
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
              name="subject"
              render={({ field }) => (
                <InputOffsetLabel isRequired label={"Subject"}>
                  <Input
                    type="string"
                    placeholder={"Enter subject"}
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
              name="sender"
              render={({ field }) => (
                <InputOffsetLabel isRequired label="Sender's name">
                  <Input
                    type="string"
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
              name="replyTo"
              render={({ field }) => (
                <InputOffsetLabel label={"Reply to"}>
                  <Input
                    type="string"
                    {...field}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
        </div>
        <div className="flex gap-8 items-center">
          <FormField
            control={form.control}
            name="isScheduled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-4 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-basePrimary    "
                  />
                </FormControl>
                <FormLabel className="font-medium text-gray-700">
                  Schedule email
                </FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
              <FormItem className="relative w-fit space-y-0">
                <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                  Send campaign on
                </FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={!isScheduled}
                          variant={"outline"}
                          className={cn(
                            "flex gap-4 items-center w-[300px] px-4 justify-start font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex-1">
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem className="relative w-full space-y-0">
                  <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                    Timezone
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={!isScheduled}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select timezone"
                            className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 w-full"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="h-64 hide-scrollbar overflow-auto">
                        {TIME_ZONES.flatMap(({ zones }) =>
                          zones.map(({ label, value }) => (
                            <SelectItem
                              value={value}
                              className="inline-flex gap-2"
                            >
                              <span>{label}</span>
                              <span className="text-gray-500 text-xs">({value})</span>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="bg-basePrimary w-full">
          Send Email
        </Button>
      </form>
    </Form>
  );
};

export default Create;
