import React, { useEffect } from "react";
import Overlay from "@/components/Overlay";
import { useForm } from "react-hook-form";
import { TAttendeeTags } from "@/types/attendee";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { attendeeTagsSchema } from "@/schemas/attendee";
import { toast } from "@/components/ui/use-toast";
import { useUpdateTags } from "@/hooks/tags";
import { Button } from "@/components/ui/button";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { Input } from "@/components/ui/input";
import COLORTAG from "@/utils/colorTag";

export default function AddTagForm({
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
  const defaultValues: Partial<TAttendeeTags> = {
    eventId: "1234567890",
    contactAttendeeEmail: "ubahyusuf484@gmail.com",
    contactAttendeeId: 10,
  };

  const { updateTags, isLoading, error } = useUpdateTags({
    attendeeId,
  });

  const form = useForm<TAttendeeTags>({
    resolver: zodResolver(attendeeTagsSchema),
    defaultValues,
  });

  const { setValue } = form;

  useEffect(() => {
    setValue("email", attendeeEmail);
    setValue("attendeeId", attendeeId);
  }, [attendeeEmail, attendeeId]);

  async function onSubmit(data: TAttendeeTags) {
    onClose();

    toast({
      description: "adding note...",
    });
    const response = await updateTags({ payload: data });

    toast({
      description: "note added successfully",
    });
  }

  return (
    <Overlay isOpen={isOpen} onClose={onClose} title="Create tag">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="contactAttendeeTags"
            render={({ field }) => (
              <InputOffsetLabel label="Tag">
                <Input
                  placeholder="Enter tag"
                  {...field}
                  className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 mt-0"
                />
              </InputOffsetLabel>
            )}
          />
          <div className="flex gap-2 flex-wrap">
            {COLORTAG.map((color) => (
              <div
                className="h-8 w-8 rounded-full"
                style={{ backgroundColor: color }}
                key={color}
              />
            ))}
          </div>
          <Button type="submit" className="bg-basePrimary w-full">
            Add Notes
          </Button>
        </form>
      </Form>
    </Overlay>
  );
}
