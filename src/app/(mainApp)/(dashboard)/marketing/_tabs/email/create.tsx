import {InputOffsetLabel} from "@/components/InputOffsetLabel";
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
import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetAttendees } from "@/hooks/services/attendee";
import { useSendMarketingEmail } from "@/hooks/services/marketing";
import ViewAttendeesSection from "@/components/moreOptionDialog/viewAttendeesSection";
import { TAttendee } from "@/types/attendee";
import TextEditor from "@/components/TextEditor";

const CreateEmailSchema = z
  .object({
    category: z.string(),
    subject: z.string(),
    sender: z.string(),
    replyTo: z.string().optional(),
    recipients: z.string(),
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
  const { attendees, getAttendees, isLoading } = useGetAttendees();
  const [selectedAttendees, setSelectedAttendees] = useState<TAttendee[]>([]);

  type ValueType = TAttendee | TAttendee[];
  const toggleValue = (value: ValueType) => {
    const updatedValue = Array.isArray(value)
      ? value
      : value && selectedAttendees.includes(value)
      ? selectedAttendees.filter((item) => item !== value)
      : [...selectedAttendees, value];

    setSelectedAttendees(updatedValue);
  };

  const defaultValues: Partial<TCreateEmail> = {
    isScheduled: false,
    content: "here",
  };

  const [sendTest, setSendTest] = useState<boolean>(false);
  const [testEmail, setTestEmail] = useState<string>("");
  const [recipientSource, setRecipientSource] = useState<"attendees" | "list">(
    "attendees"
  );

  const { sendMarketingEmail, isLoading: sendEmailIsLoading } =
    useSendMarketingEmail();

  const form = useForm<TCreateEmail>({
    resolver: zodResolver(CreateEmailSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  console.log(errors, "errors");

  const content = watch("content");
  const isScheduled = watch("isScheduled");

  useEffect(() => {
    if (recipientSource === "attendees")
      setValue(
        "recipients",
        attendees?.map(({ email }) => email).join("; ") || ""
      );
  }, [recipientSource]);

  const setRecipients = () => {
    setValue(
      "recipients",
      selectedAttendees.map(({ email }) => email).join("; ")
    );
  };

  const onSubmit = async (data: TCreateEmail) => {
    console.log(data);
    await sendMarketingEmail({
      payload: {
        organizationId: 5,
        userId: 10,
        userEmail: "ubahyusuf484@gmail.com",
        emailCategory: data.category,
        subject: data.subject,
        sendersName: data.sender,
        replyTo: data.replyTo,
        emailBody: data.content,
        emailRecipient: data.recipients.split("; "),
      },
    });
  };

  const setMessage = (content: string) => {
    console.log(content);
    setValue("content", content);
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
              name="category"
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
                            className="[&>*]:text-sm [&>*]:text-gray-200 [&>*]:capitalize w-full"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[250px] hide-scrollbar overflow-auto">
                        {["announcements", "reminders", "marketing"].map(
                          (event) => (
                            <SelectItem
                              key={event}
                              value={event}
                              className="inline-flex gap-2 capitalize"
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
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 !mt-0"
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
                    placeholder="Enter your organization name"
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
                    placeholder="Enter your reply to email address"
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
        </div>
        <div className="space-y-4 px-3 py-4">
          {isLoading ? (
            <span className="font-medium text-gray-700">Loading...</span>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span>Who should receive this email?</span>
                <div className="flex">
                  <Button
                    onClick={() => setRecipientSource("attendees")}
                    type="button"
                    className={cn(
                      "rounded-none border-2 w-28 border-basePrimary",
                      recipientSource === "attendees"
                        ? "bg-basePrimary text-white"
                        : "bg-white text-basePrimary"
                    )}
                  >
                    Attendees
                  </Button>
                  <Button
                    onClick={() => setRecipientSource("list")}
                    type="button"
                    className={cn(
                      "rounded-none border-2 w-28 border-basePrimary",
                      recipientSource === "list"
                        ? "bg-basePrimary text-white"
                        : "bg-white text-basePrimary"
                    )}
                  >
                    List
                  </Button>
                </div>
              </div>
              {recipientSource === "attendees" ? (
                <div className="flex items-center gap-2">
                  {selectedAttendees.length > 0 && (
                    <span className="text-sm font-medium">
                      {selectedAttendees.length} attendees will receive this
                      mail
                    </span>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-sm text-basePrimary font-medium hover:bg-transparent hover:text-basePrimary flex gap-2 items-center"
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 1024 1024"
                          height="1.5em"
                          width="1.5em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
                          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                        </svg>
                        <span>Recipients</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="px-3 max-h-[500px] overflow-auto hide-scrollbar">
                      <DialogHeader>
                        <DialogTitle>
                          <span className="capitalize">Email Recipient</span>
                        </DialogTitle>
                      </DialogHeader>
                      <ViewAttendeesSection
                        attendees={attendees}
                        selectedAttendees={selectedAttendees}
                        toggleValue={toggleValue}
                      />
                      <DialogClose>
                        <Button
                          disabled={selectedAttendees.length === 0}
                          className="bg-basePrimary w-full"
                          onClick={setRecipients}
                        >
                          Continue
                        </Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="recipients"
                  render={({ field }) => (
                    <InputOffsetLabel isRequired label={"Recipients"}>
                      <Input
                        value={field.value}
                        type="string"
                        placeholder={
                          "Enter emails seperated by semi-colon seperated"
                        }
                        onInput={(e) => field.onChange(e.currentTarget.value)}
                        className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                      />
                    </InputOffsetLabel>
                  )}
                />
              )}
            </>
          )}
        </div>
        <div className="w-full rounded-md border bg-background text-sm relative">
          <span className="absolute top-0 -translate-y-1/2 right-4 text-gray-900 text-tiny px-1 z-10 bg-white">
            Message
          </span>
          <TextEditor
            onChange={setMessage}
            defaultValue={content}
            placeholder="Write message"
          />
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
                          zones.map(({ label, value }, index) => (
                            <SelectItem
                              key={value + index}
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
              onInput={(e) => setTestEmail(e.currentTarget.value)}
              placeholder="Enter email"
              disabled={!sendTest}
            />
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-basePrimary w-full flex items-center gap-4 flex-[30%]"
          >
            <span className="text-white">
              Send {sendTest ? "test" : ""} email
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
