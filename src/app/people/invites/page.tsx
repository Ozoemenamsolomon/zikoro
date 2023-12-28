"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "styled-icons/boxicons-regular";
import { PlusCircleOutline } from "styled-icons/evaicons-outline";
import { Users } from "styled-icons/heroicons-outline";
import { Calendar } from "styled-icons/boxicons-regular";

const InviteSchema = z.object({
  email: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  attendeeType: z.string().min(2, {
    message: "attendee must be at least 2 characters.",
  }),
});

export type InviteSchema = z.infer<typeof InviteSchema>;

export default function Page() {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  const defaultValues: Partial<InviteSchema> = {
    email: "",
    attendeeType: "",
  };
  const form = useForm<z.infer<typeof InviteSchema>>({
    resolver: zodResolver(InviteSchema),
    defaultValues,
  });

  function onSubmit(data: z.infer<typeof InviteSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-gray-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <section className="px-8 pt-2 pb-8">
      <div className="border-[1px] p-2 space-y-6">
        <h1 className="text-gray-900 text-lg font-medium">Invite</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-6">
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between p-2 border-[1px]">
                <span>www.zikoro.com/orthoex/event3502/invite.com</span>
                <Copy className="w-5 h-5 text-gray-700" />
              </div>
              <span className="text-sm">
                Share your link with as many people as you want to invite to
                your event.
              </span>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <h1 className="text-gray-900 text-lg font-medium">
                  Invite by email
                </h1>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormLabel className="absolute -top-2 right-4 bg-white text-gray-600 text-sm capitalize p-1.5">
                            email
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter event title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="attendeeType"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormLabel className="absolute -translate-y-1/3 top-0 right-4 bg-white text-gray-600 text-sm capitalize p-1.5">
                            Attendee type
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Select attendee type"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-2 font-medium items-center text-basePrimary">
                    <PlusCircleOutline className="w-5 h-5" />
                    <span className="text-sm">Add new</span>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="absolute -translate-y-1/3 top-0 right-4 bg-white text-gray-600 text-sm capitalize p-1.5">
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write a text you wish to send with invite email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-basePrimary">
                  Send Invitation
                </Button>
              </form>
            </Form>
          </div>
          <div className="bg-basebody rounded-sm">
            <div className="space-y-2 border-b-2 p-2">
              <h2 className="text-gray-700 font-medium">Email Invites</h2>
              <div className="flex gap-4 items-center text-gray-500 text-sm">
                <Users className="w-5 h-5" />
                <span>20/450 Invites pending</span>
              </div>
              <div className="text-gray-300 flex justify-between text-sm">
                <div className="flex gap-2 items-center">
                  <div className="flex gap-0.5 items-center">
                    <Calendar className="w-5 h-5" />
                    <span>Date</span>
                  </div>
                  <div className="h-5 w-[3px] bg-gray-300" />
                  <div className="flex gap-0.5 items-center border-r-1 border-gray-400 pr-2">
                    <Users className="w-5 h-5" />
                    <span>Attendees</span>
                  </div>
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent border-none focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>
            <div className="p-2 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-gray-300 p-2 h-12 w-12 rounded-full text-white flex items-center justify-center">
                  YB
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    ubahyusuf484@gmail.com
                  </span>
                  <div className="flex gap-4 text-xs items-center">
                    <span className="bg-sky-50 text-sky-500 p-1 rounded-md font-medium">
                      Speaker
                    </span>
                    <span className="text-yellow-500">Pending</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-gray-300 p-2 h-12 w-12 rounded-full text-white flex items-center justify-center">
                  YB
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    cyrilugoh2121@gmail.com
                  </span>
                  <div className="flex gap-4 text-xs items-center">
                    <span className="bg-sky-50 text-sky-500 p-1 rounded-md font-medium">
                      Speaker
                    </span>
                    <span className="text-yellow-500">Pending</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-gray-300 p-2 h-12 w-12 rounded-full text-white flex items-center justify-center">
                  YB
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    davidudem64@gmail.com
                  </span>
                  <div className="flex gap-4 text-xs items-center">
                    <span className="bg-sky-50 text-sky-500 p-1 rounded-md font-medium">
                      Attendee
                    </span>
                    <span className="text-green-500">Registered</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-gray-300 p-2 h-12 w-12 rounded-full text-white flex items-center justify-center">
                  YB
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    bilalyusufubah@gmail.com
                  </span>
                  <div className="flex gap-4 text-xs items-center">
                    <span className="bg-sky-50 text-sky-500 p-1 rounded-md font-medium">
                      Speaker
                    </span>
                    <span className="text-yellow-500">Registered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
