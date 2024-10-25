"use client";

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
import { getCookie } from "@/hooks";
import { TUser } from "@/types";
import useEventStore from "@/store/globalEventStore";
import useUserStore from "@/store/globalUserStore";
import { ReactSelect } from "@/components";
import Editor from "./custom_editor/Editor";
import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";
import { useRouter } from "next/navigation";

const CreateEmailSchema = z
  .object({
    category: z.string(),
    subject: z.string(),
    sender: z.string(),
    replyTo: z.string().optional(),
    recipients: z
      .array(
        z.object({
          email: z.string(),
          attendeeAlias: z.string(),
          firstName: z.string(),
          lastName: z.string(),
        })
      )
      .optional(),
    content: z.string(),
    isScheduled: z.boolean(),
    schedule: z.date().optional(),
    timezone: z.string().optional(),
    addCTA: z.boolean(),
    CTAText: z.string(),
    enableCTA: z.boolean(),
    addProfileButton: z.boolean(),
    profileButtonText: z.string().optional(),
    addCustomButton: z.boolean(),
    customButtonText: z.string().optional(),
    customButtonLink: z.string().optional(),
  })
  .superRefine(({ isScheduled, schedule, timezone }, refinementContext) => {
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
  const currentEvent = useEventStore((state) => state.event);
  const router = useRouter();
  const { user, setUser } = useUserStore();

  if (!user) return null;

  const { attendees, getAttendees, isLoading } = useGetAttendees({
    eventId: currentEvent?.eventAlias,
  });
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
    content: "",
    replyTo: user.userEmail,
    addCTA: false,
    CTAText: "Join Event",
    addProfileButton: false,
    profileButtonText: "Edit Profile",
    addCustomButton: false,
    customButtonText: "Custom Button",
    customButtonLink: "https://",
    enableCTA: false,
  };

  const [sendTest, setSendTest] = useState<boolean>(false);
  const [testEmail, setTestEmail] = useState<string>("");

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

  const content = watch("content");
  const isScheduled = watch("isScheduled");
  const enableCTA = watch("enableCTA");
  const addCTA = watch("addCTA");
  const addProfileButton = watch("addProfileButton");
  const addCustomButton = watch("addCustomButton");

  useEffect(() => {
    setValue("addCTA", enableCTA);
    setValue("addProfileButton", enableCTA);
    setValue("addCustomButton", enableCTA);
  }, [enableCTA]);

  const setRecipients = () => {
    setValue(
      "recipients",
      selectedAttendees.map(
        ({ email, attendeeAlias, firstName, lastName }) => ({
          email,
          attendeeAlias,
          firstName,
          lastName,
        })
      )
    );
  };

  const onSubmit = async (data: TCreateEmail) => {
    if (!user) return;

    await sendMarketingEmail({
      payload: {
        ...data,
        eventAlias: currentEvent?.eventAlias || "",
        organizationId: currentEvent?.organisationId || "",
        userId: user.id,
        userEmail: user.userEmail,
        emailCategory: data.category,
        subject: data.subject,
        sendersName: data.sender,
        replyTo: data.replyTo,
        emailBody: data.content,
        emailRecipient: sendTest
          ? [
              {
                email: testEmail,
                attendeeAlias: "#0#0#0#0",
                firstName: "John",
                lastName: "AppleBee",
              },
            ]
          : data.recipients,
      },
    });

  };

  const setMessage = (content: string) => {
    setValue("content", content);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 px-4 py-4"
      >
        <div className="w-full flex items-center justify-between">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              router.back();
            }}
            className="h-fit w-fit px-0 gap-x-2"
            variant={"ghost"}
          >
            <ArrowBack size={20} />
            <p>Back</p>
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 h-fit">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <InputOffsetLabel label={"Category"}>
                  <ReactSelect
                    placeHolder="Select Category"
                    defaultValue={{
                      label: field.value,
                      value: field.value,
                    }}
                    {...field}
                    options={["announcements", "reminders", "marketing"].map(
                      (category) => ({
                        label: category,
                        value: category,
                      })
                    )}
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
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 !mt-0"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 h-fit">
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
            <span className=" text-gray-700">Loading...</span>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span>Who should receive this email?</span>
              </div>
              <div className="flex items-center gap-2">
                {selectedAttendees.length > 0 && (
                  <span className="text-sm ">
                    {selectedAttendees.length} attendees will receive this mail
                  </span>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-sm text-basePrimary  hover:bg-transparent hover:text-basePrimary flex gap-2 items-center"
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
            </>
          )}
        </div>
        <InputOffsetLabel label="Message">
          <Editor onChangeContent={setMessage} />
        </InputOffsetLabel>
        <FormField
          control={form.control}
          name="enableCTA"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-4 space-y-0">
              <FormLabel className="text-gray-700">
                Enable Call to Action Buttons
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-basePrimary    "
                />
              </FormControl>
            </FormItem>
          )}
        />
        {enableCTA && (
          <>
            <div className="flex gap-2">
              <div className="flex flex-col gap-2 flex-1">
                <FormField
                  control={form.control}
                  name="addCTA"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-4 space-y-0">
                      <FormLabel className="text-gray-700">
                        Add Join Event Button
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-basePrimary    "
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className={cn("flex-1", !addCTA && "hidden")}>
                  <FormField
                    control={form.control}
                    name="CTAText"
                    render={({ field }) => (
                      <InputOffsetLabel label={"Button Label"}>
                        <Input
                          disabled={!addCTA}
                          type="string"
                          {...field}
                          placeholder="Enter Button Label"
                          className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                        />
                      </InputOffsetLabel>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <FormField
                  control={form.control}
                  name="addProfileButton"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-4 space-y-0">
                      <FormLabel className=" text-gray-700">
                        Add Edit Profile Button
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-basePrimary    "
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className={cn("flex-1", !addProfileButton && "hidden")}>
                  <FormField
                    control={form.control}
                    name="profileButtonText"
                    render={({ field }) => (
                      <InputOffsetLabel label={"Label"}>
                        <Input
                          disabled={!addProfileButton}
                          type="string"
                          {...field}
                          placeholder="Enter Profile Button Label"
                          className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                        />
                      </InputOffsetLabel>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="addCustomButton"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-4 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-basePrimary"
                      />
                    </FormControl>
                    <FormLabel className=" text-gray-700">
                      Add Custom Button
                    </FormLabel>
                  </FormItem>
                )}
              />
              <div className="flex gap-2 items-center">
                <div className={cn("flex-1", !addCustomButton && "hidden")}>
                  <FormField
                    control={form.control}
                    name="customButtonText"
                    render={({ field }) => (
                      <InputOffsetLabel label={"Label"}>
                        <Input
                          type="string"
                          {...field}
                          placeholder="Enter Label"
                          className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                        />
                      </InputOffsetLabel>
                    )}
                  />
                </div>
                <div className={cn("flex-1", !addCustomButton && "hidden")}>
                  <FormField
                    control={form.control}
                    name="customButtonLink"
                    render={({ field }) => (
                      <InputOffsetLabel label={"URL"}>
                        <Input
                          type="string"
                          {...field}
                          placeholder="Enter URL"
                          className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                        />
                      </InputOffsetLabel>
                    )}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* <div className="flex flex-col md:flex-row gap-8 md:items-center">
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
                <FormLabel className=" text-gray-700">
                  Schedule email
                </FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
              <FormItem className="relative w-full md:w-fit space-y-0">
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
                            "flex gap-4 items-center w-full px-4 justify-start font-normal",
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
        </div> */}

        <div className="flex flex-col md:flex-row gap-y-4 gap-8 md:items-center">
          <div className="flex flex-row items-center gap-4 space-y-0 flex-[20%]">
            <div>
              <Switch
                checked={sendTest}
                onCheckedChange={setSendTest}
                className="data-[state=checked]:bg-basePrimary"
              />
            </div>
            <span className=" text-gray-700 text-lg">Send test email</span>
          </div>
          <div className="relative flex-[50%]">
            <InputOffsetLabel isRequired={sendTest} label={"email"}>
              <Input
                className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                onInput={(e) => setTestEmail(e.currentTarget.value)}
                placeholder="Enter email"
                disabled={!sendTest}
              />
            </InputOffsetLabel>
          </div>
          <Button
            disabled={isLoading || (sendTest && !testEmail)}
            type="submit"
            className="text-gray-50 bg-basePrimary gap-x-2 w-fit py-4"
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
