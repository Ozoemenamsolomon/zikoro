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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ComposeSMSSchema = z.object({
  sender: z.string(),
  seperator: z.string(),
  phoneNumbers: z.string(),
  message: z.string(),
});

type TComposeSMS = z.infer<typeof ComposeSMSSchema>;

const Compose = () => {
  const defaultValues: Partial<TComposeSMS> = {
    sender: "your organization",
    seperator: "comma/semi-colon",
  };

  const form = useForm<TComposeSMS>({
    resolver: zodResolver(ComposeSMSSchema),
    defaultValues,
  });

  const { watch, setValue } = form;

  // const isScheduled = watch("isScheduled");

  const onSubmit = (data: TComposeSMS) => {
    console.log(data);
  };

  return (
    <section className="p-4 space-y-4">
      <div className="bg-gray-200 text-gray-600 border border-gray-300 font-medium text-sm rounded p-4">
        To fund your wallet instantly, kindly transfer any amount to any of your
        dedicated bank accounts ={">"} [ 8743344266 - Sterling bank ], [
        6164195564 - Moniepoint Microfinance Bank ], [ 7487761512 - Wema bank ],
      </div>
      <section className="grid grid-cols-2 gap-8">
        {/* first column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.8333 16.6693H4.16667C3.72464 16.6693 3.30072 16.4937 2.98816 16.1811C2.67559 15.8686 2.5 15.4446 2.5 15.0026V7.5026C2.5 7.06058 2.67559 6.63665 2.98816 6.32409C3.30072 6.01153 3.72464 5.83594 4.16667 5.83594H15.8333C16.2754 5.83594 16.6993 6.01153 17.0118 6.32409C17.3244 6.63665 17.5 7.06058 17.5 7.5026V15.0026C17.5 15.4446 17.3244 15.8686 17.0118 16.1811C16.6993 16.4937 16.2754 16.6693 15.8333 16.6693Z"
                  stroke="#001FCC"
                  strokeWidth="1.5"
                />
                <path
                  d="M13.7502 11.6693C13.6397 11.6693 13.5337 11.6254 13.4555 11.5472C13.3774 11.4691 13.3335 11.3631 13.3335 11.2526C13.3335 11.1421 13.3774 11.0361 13.4555 10.958C13.5337 10.8798 13.6397 10.8359 13.7502 10.8359C13.8607 10.8359 13.9667 10.8798 14.0448 10.958C14.1229 11.0361 14.1668 11.1421 14.1668 11.2526C14.1668 11.3631 14.1229 11.4691 14.0448 11.5472C13.9667 11.6254 13.8607 11.6693 13.7502 11.6693Z"
                  fill="#001FCC"
                  stroke="#001FCC"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 5.83428V4.67011C14.9999 4.41469 14.9412 4.16271 14.8282 3.93362C14.7153 3.70453 14.5512 3.50447 14.3487 3.34887C14.1461 3.19327 13.9105 3.08631 13.66 3.03624C13.4096 2.98617 13.151 2.99434 12.9042 3.06011L3.7375 5.50428C3.38254 5.59887 3.06878 5.80808 2.84499 6.09938C2.6212 6.39069 2.49992 6.74777 2.5 7.11511V7.50094"
                  stroke="#001FCC"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-gray-700">Balance</span>
            </div>
            <span className="text-gray-700 font-semibold">
              NGN 200 (100 Units)
            </span>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-4 py-4"
            >
              <h1 className="text-lg font-medium text-gray-800">Compose SMS</h1>
              <FormField
                control={form.control}
                name="sender"
                render={({ field }) => (
                  <InputOffsetLabel isRequired label={"Sender ID"}>
                    <Input
                      type="string"
                      placeholder={"Enter subject"}
                      {...field}
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="seperator"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-gray-700 font-medium">
                      Phone Number Seperator
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <FormItem className="flex items-center gap-1 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="comma/semi-colon" />
                          </FormControl>
                          <FormLabel className="font-medium text-gray-500">
                            Comma or Semi colon
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-1 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="space" />
                          </FormControl>
                          <FormLabel className="font-medium text-gray-500">
                            Space
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumbers"
                render={({ field }) => (
                  <InputOffsetLabel isrequired label="Phone Numbers">
                    <Textarea
                      placeholder="Enter phone numbers"
                      {...field}
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <InputOffsetLabel isrequired label="Text message">
                    <Textarea
                      placeholder="Enter text message"
                      {...field}
                      className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
                    />
                  </InputOffsetLabel>
                )}
              />
              <Button type="submit" className="bg-basePrimary w-full">
                Send Message
              </Button>
            </form>
          </Form>
        </div>

        {/* second column */}
        <div className="pt-12 pr-12">
          <div className="bg-gray-50 border border-gray-100 p-4 space-y-4 rounded">
            <h1 className="text-gray-700 font-medium">SMS Preview</h1>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">SMS Cost (3.47 Unit)</span>
                <span className="text-gray-700 font-medium">NGN7.14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recipients</span>
                <span className="text-gray-700 font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Page (64 characters)</span>
                <span className="text-gray-700 font-medium">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sender ID</span>
                <span className="text-gray-700 font-medium">Rasheed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Balance</span>
                <span className="text-gray-700 font-medium">
                  NGN 200 (100 Units)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Compose;
