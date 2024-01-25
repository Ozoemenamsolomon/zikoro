import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
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
import { Camera, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { useCreateAttendee } from "@/hooks/services/attendee";
import { AttendeeSchema } from "@/schemas/attendee";
import { TAttendee, TAttendeeType } from "@/types/attendee";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const DimensionsSchema = z.object({
    badgeWidth: z.number(),
    badgeHeight: z.number(),
    // portrai
});

const Dimensions = () => {
  const defaultValues: Partial<TAttendee> = {
    registrationDate: new Date().toISOString(),
    certificate: true,
    userEmail: "ubahyusuf484@gmail.com",
    attendeeType: ["attendee"],
    eventId: "1234567890",
    country: "Nigeria",
  };

  const form = useForm<TAttendee>({
    resolver: zodResolver(AttendeeSchema),
    defaultValues,
  });

  const { watch, setValue } = form;

  return <div>Dimensions</div>;
};

export default Dimensions;
