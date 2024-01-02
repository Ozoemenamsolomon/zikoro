import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { attendeeNoteSchema } from "@/schemas/attendee";
import { TAttendeeNote } from "@/types/attendee";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useUpdatenote } from "@/hooks/notes";
import { DialogClose } from "../ui/dialog";

export default function AddNotesForm({
  attendeeEmail,
  attendeeId,
  note,
}: {
  attendeeEmail: string;
  attendeeId: number;
  note: TAttendeeNote;
}) {
  console.log(attendeeEmail);
  const defaultValues: Partial<TAttendeeNote> = note
    ? note
    : {
        eventId: "1234567890",
        contactAttendeeEmail: "ubahyusuf484@gmail.com",
        contactAttendeeId: 10,
      };

  const { updatenote, isLoading, error } = useUpdatenote({
    attendeeId,
  });

  const form = useForm<TAttendeeNote>({
    resolver: zodResolver(attendeeNoteSchema),
    defaultValues,
  });

  const {
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    console.log(errors);
  });

  useEffect(() => {
    setValue("attendeeEmail", attendeeEmail);
    setValue("attendeeId", attendeeId);
  }, [attendeeEmail, attendeeId]);

  async function onSubmit(data: TAttendeeNote) {
    toast({
      description: "adding note...",
    });
    const response = await updatenote({ payload: data });

    toast({
      description: "note added successfully",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write something"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose asChild>
        <Button type="submit" className="bg-basePrimary w-full">
          Add Notes
        </Button>
        </DialogClose>
      </form>
    </Form>
  );
}