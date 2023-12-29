import InputOffsetLabel from "@/components/InputOffsetLabel";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useUpdateTags } from "@/hooks/tags";
import { attendeeTagsSchema } from "@/schemas/attendee";
import { TAttendeeTags } from "@/types/attendee";
import { TTags } from "@/types/tags";
import COLORTAG from "@/utils/colorTag";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function AddTagForm({
  attendeeEmail,
  attendeeId,
}: {
  attendeeEmail: string;
  attendeeId: number;
}) {
  const defaultValues: Partial<TTags> = {
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
    toast({
      description: "adding note...",
    });
    const response = await updateTags({ payload: data });

    toast({
      description: "note added successfully",
    });
  }

  return (
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
  );
}
