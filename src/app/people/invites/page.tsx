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
import { Copy } from "@styled-icons/boxicons-regular/Copy";
import { PlusCircleOutline } from "styled-icons/evaicons-outline";

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
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <section className="px-8 pt-2 pb-8">
      <div className="border-[1px] p-2 space-y-6">
        <h1 className="text-slate-900 text-lg font-medium">Invite</h1>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 space-y-6">
            <div className="space-y-4 text-slate-700">
              <div className="flex justify-between p-2 border-[1px]">
                <span>www.zikoro.com/orthoex/event3502/invite.com</span>
                <Copy className="w-5 h-5 text-slate-700" />
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
                <h1 className="text-slate-900 text-lg font-medium">
                  Invite by email
                </h1>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormLabel className="absolute -translate-y-1/3 top-0 right-4 bg-basebody text-slate-600 text-sm capitalize p-1.5">
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
                          <FormLabel className="absolute -translate-y-1/3 top-0 right-4 bg-basebody text-slate-600 text-sm capitalize p-1.5">
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
                      <FormLabel className="absolute -translate-y-1/3 top-0 right-4 bg-basebody text-slate-600 text-sm capitalize p-1.5">
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
          <div className="bg-basebody p-2 rounded-sm">
            
          </div>
        </div>
      </div>
    </section>
  );
}
