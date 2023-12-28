import React, { useEffect } from "react";
import Overlay from "@/components/Overlay";
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
import { useCreateNote } from "@/hooks/notes";

export default function AddNotesForm({
  isOpen,
  onClose,
  attendeeEmail,
  attendeeId,
}: {
  isOpen: boolean;
  onClose: () => void;
  attendeeEmail: string;
  attendeeId: number;
}) {
  console.log(attendeeEmail);
  const defaultValues: Partial<TAttendeeNote> = {
    eventId: "1234567890",
    contactAttendeeEmail: "ubahyusuf484@gmail.com",
    contactAttendeeId: 10,
  };

  const { createNote, isLoading, error } = useCreateNote({
    attendeeId,
  });

  const form = useForm<TAttendeeNote>({
    resolver: zodResolver(attendeeNoteSchema),
    defaultValues,
  });

  const { setValue } = form;

  useEffect(() => {
    setValue("attendeeEmail", attendeeEmail);
    setValue("attendeeId", attendeeId);
  }, [attendeeEmail, attendeeId]);

  async function onSubmit(data: TAttendeeNote) {
    onClose();

    toast({
      description: "adding note...",
    });
    const response = await createNote({ payload: data });

    toast({
      description: "note added successfully",
    });
  }

  return (
    <Overlay isOpen={isOpen} onClose={onClose} title="Add Notes">
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
          <Button type="submit" className="bg-basePrimary w-full">
            Add Notes
          </Button>
        </form>
      </Form>
    </Overlay>
  );
}
