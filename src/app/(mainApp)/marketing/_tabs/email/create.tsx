import InputOffsetLabel from "@/components/InputOffsetLabel";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { TIME_ZONES } from "@/utils/timezones";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useRef, useState, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

  const [sendTest, setSendTest] = useState<boolean>(false);
  const [testEmail, setTestEmail] = useState<string>("");

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
        className="space-y-8 px-4 py-4"
      >
        <div className="flex gap-4 h-fit">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="relative w-full space-y-0">
                  <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                    Category
                    <sup className="text-red-700">*</sup>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select campaign category"
                            className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 w-full"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[250px] hide-scrollbar overflow-auto">
                        {["announcements", "reminders", "marketing"].map(
                          (event) => (
                            <SelectItem
                              key={event}
                              value={event}
                              className="inline-flex gap-2"
                            >
                              {event}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
                      <SelectContent className="h-64 hide-scrollbar overflow-auto w-auto">
                        {TIME_ZONES.flatMap(({ zones }) =>
                          zones.map(({ label, value }) => (
                            <SelectItem
                              value={value}
                              className="inline-flex gap-2"
                            >
                              <span>{label}</span>
                              <span className="text-gray-500 text-xs">
                                ({value})
                              </span>
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

        <div className="flex gap-8 items-center">
          <div className="flex flex-row items-center gap-4 space-y-0 flex-[20%]">
            <div>
              <Switch
                checked={sendTest}
                onCheckedChange={setSendTest}
                className="data-[state=checked]:bg-basePrimary    "
              />
            </div>
            <span className="font-medium text-gray-700 text-sm">
              Send test email
            </span>
          </div>
          <div className="relative flex-[50%]">
            <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
              Email
            </span>
            <Input
              className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
              onInput={(e) => setTestEmail(e.target.value)}
              placeholder="Enter email"
              disabled={!sendTest}
            />
          </div>
          <Button
            type="submit"
            className="bg-basePrimary w-full flex items-center gap-4 flex-[30%]"
          >
            <span className="text-white">
              Send {!sendTest ? "test" : ""} email
            </span>
            <span className="text-white">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M435.9 64.9l-367.1 160c-6.5 3.1-6.3 12.4.3 15.3l99.3 56.1c5.9 3.3 13.2 2.6 18.3-1.8l195.8-168.8c1.3-1.1 4.4-3.2 5.6-2 1.3 1.3-.7 4.3-1.8 5.6L216.9 320.1c-4.7 5.3-5.4 13.1-1.6 19.1l64.9 104.1c3.2 6.3 12.3 6.2 15.2-.2L447.2 76c3.3-7.2-4.2-14.5-11.3-11.1z"></path>
              </svg>
            </span>
          </Button>
        </div>

        {/* <Button type="submit" className="bg-basePrimary w-full">
          Send Email
        </Button> */}
      </form>
    </Form>
  );
};

export default Create;
