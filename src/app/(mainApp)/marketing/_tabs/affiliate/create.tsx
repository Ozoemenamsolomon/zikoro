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
  FormDescription,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const CreateAffiliateSchema = z.object({
  event: z.string(),
  recipient: z.string(),
  payoutSchedule: z.string(),
  commissionType: z.string(),
  value: z.number(),
  validity: z.date(),
  goal: z.string(),
});

type TCreateAffiliate = z.infer<typeof CreateAffiliateSchema>;

const Create = () => {
  const defaultValues: Partial<TCreateAffiliate> = {
    recipient: "bilalyusufuba@gmail.com",
    commissionType: "percentage",
  };

  const form = useForm<TCreateAffiliate>({
    resolver: zodResolver(CreateAffiliateSchema),
    defaultValues,
  });

  const { watch, setValue } = form;

  const commissionType = watch("commissionType");

  const onSubmit = (data: TCreateAffiliate) => {
    console.log(data);
  };

  return (
    <section className="p-4 space-y-8">
      <h1 className="text-gray-700 text-lg font-medium">Affiliate</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-6"
        >
          {/* first column */}
          <section className="space-y-6">
            <div className="bg-gray-200 text-gray-600 border border-gray-300 font-medium text-sm rounded p-4">
              Please provide the email address of your affiliate and specify the
              commission value you want to offer them for each sale. A unique
              URL will be created with your affiliate's ID for tracking
              purposes.
            </div>
            <FormField
              control={form.control}
              name="event"
              render={({ field }) => (
                <FormItem className="relative w-full space-y-0">
                  <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                    Event
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select event"
                            className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 w-full"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="h-64 hide-scrollbar overflow-auto">
                        {["event1", "event2"].map((event) => (
                          <SelectItem
                            key={event}
                            value={event}
                            className="inline-flex gap-2"
                          >
                            {event}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <InputOffsetLabel isRequired label={"Recipient email"}>
                  <Input
                    type="string"
                    placeholder={"Enter recipient email"}
                    {...field}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="payoutSchedule"
              render={({ field }) => (
                <FormItem className="relative w-full space-y-0">
                  <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                    Payout Schedule
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select schedule"
                            className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 w-full"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="h-64 hide-scrollbar overflow-auto">
                        {["self-manage"].map((event) => (
                          <SelectItem
                            key={event}
                            value={event}
                            className="inline-flex gap-2"
                          >
                            {event}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          {/* second section */}
          <section className="space-y-6">
            <FormField
              control={form.control}
              name="commissionType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-gray-700 font-medium">
                    Select commission type
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center gap-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="percentage" />
                        </FormControl>
                        <FormLabel className="font-medium text-gray-500">
                          Percentage
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fixed" />
                        </FormControl>
                        <FormLabel className="font-medium text-gray-500">
                          Fixed amount
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {commissionType === "percentage" ? (
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Value</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          field.onChange(
                            field.value < 95 ? field.value + 5 : 100
                          )
                        }
                        disabled={field.value === 100}
                        type="button"
                        className="text-basePrimary"
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth={0}
                          viewBox="0 0 1024 1024"
                          height="1.5em"
                          width="1.5em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
                          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                        </svg>
                      </button>
                      <div className="inline-flex gap-1 justify-between">
                        <input
                          className="w-[40px] outline-[1px] px-2 py-0.5 flex justify-center items-center outline-gray-300 rounded"
                          defaultValue={5}
                          value={field.value}
                          type="number"
                        />
                        <span>%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange(field.value > 5 ? field.value - 5 : 0)
                        }
                        disabled={field.value === 0}
                        className="text-basePrimary"
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth={0}
                          viewBox="0 0 1024 1024"
                          height="1.5em"
                          width="1.5em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M696 480H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
                          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <InputOffsetLabel isRequired label={"Amount"}>
                    <Input
                      type="number"
                      placeholder={"Enter amount"}
                      {...field}
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem className="relative w-fit space-y-0">
                  <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                    Validity
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
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
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem className="relative w-full space-y-0">
                  <FormLabel className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                    Goal
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select goal"
                            className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 w-full"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="h-64 hide-scrollbar overflow-auto">
                        {["Event purchase"].map((event) => (
                          <SelectItem
                            key={event}
                            value={event}
                            className="inline-flex gap-2"
                          >
                            {event}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Your affiliate earns their commission when the selected goal
                    is reached by the attendee
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-basePrimary w-full">
              Create Link
            </Button>
          </section>
        </form>
      </Form>
    </section>
  );
};

export default Create;
