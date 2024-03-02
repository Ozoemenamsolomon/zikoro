import { MoreOptionsProps } from "@/app/people/_reusable/FirstSection";
import { TAttendee } from "@/types/attendee";
import React, { useEffect, useState } from "react";
import ViewAttendeesSection from "./viewAttendeesSection";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAttendeesCertificates,
  useGetEventCertificates,
  useUpdateAttendeeCertificates,
} from "@/hooks/services/certificate";
import { TCertificate } from "@/types/certificates";
import { DialogClose } from "../ui/dialog";

const CertificateDialog: React.FC<MoreOptionsProps> = ({
  attendees,
  getAttendees,
  favourites,
  attendeesTags,
}) => {
  const [mappedAttendees, setMappedAttendees] =
    useState<TAttendee[]>(attendees);
  const [action, setAction] = useState<string>("release");
  const [selectedAttendees, setSelectedAttendees] = useState<TAttendee[]>([]);
  const [selectedCertificate, setSelectedCertificate] =
    useState<TCertificate>();

  const {
    attendeesCertificates,
    isLoading: attendeesCertificateisLoading,
    getAttendeesCertificates,
  } = useGetAttendeesCertificates({ eventId: 1234567890 });

  const {
    eventCertificates,
    isLoading: eventCertificateisLoading,
    getEventCertificates,
  } = useGetEventCertificates({ eventId: 1234567890 });

  const { updateAttendeeCertificates } = useUpdateAttendeeCertificates({
    eventId: 1234567890,
  });

  console.log(attendeesCertificates, "attendees certificate");

  useEffect(() => {
    console.log(selectedCertificate);
    if (!selectedCertificate || attendeesCertificateisLoading) return;

    const attendeesId = attendeesCertificates
      .filter(({ CertificateGroupId }) => {
        console.log(
          CertificateGroupId === selectedCertificate.id,
          CertificateGroupId,
          selectedCertificate.id
        );
        return CertificateGroupId === selectedCertificate.id;
      })
      .map(({ attendeeId }) => attendeeId);
    console.log(
      attendeesId,
      selectedCertificate.id,
      attendeesCertificates,
      "set"
    );

    setMappedAttendees(
      attendees.filter(({ id }) =>
        action === "release"
          ? !attendeesId.includes(id)
          : attendeesId.includes(id)
      )
    );
  }, [action, selectedCertificate]);

  type ValueType = TAttendee | TAttendee[];

  const toggleValue = (value: ValueType) => {
    const updatedValue = Array.isArray(value)
      ? value
      : value && selectedAttendees.includes(value)
      ? selectedAttendees.filter((item) => item !== value)
      : [...selectedAttendees, value];

    setSelectedAttendees(updatedValue);
  };

  const onSubmit = async () => {
    console.log(selectedAttendees, selectedCertificate);
    if (!selectedCertificate) return;

    await updateAttendeeCertificates({
      payload: {
        action,
        attendeeInfo: selectedAttendees.map(({ id, email }) => ({
          attendeeId: id,
          attendeeEmail: email,
        })),
        certificateInfo: {
          eventId: 1234567890,
          CertificateGroupId: selectedCertificate.id,
          CertificateName: selectedCertificate.certificateName,
        },
      },
    });
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-auto hide-scrollbar py-4 pl-4 pr-1">
      <div className="flex flex-col gap-4 w-full rounded-md border border-input bg-background px-3 py-4 text-sm relative">
        <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
          Action
        </span>
        <RadioGroup
          defaultValue={action}
          onValueChange={(value) => {
            setAction(value);
          }}
        >
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={"release"}
                id="release"
                className="text-basePrimary"
              />
              <Label htmlFor="release">Release Certificate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="recall"
                id="recall"
                className="text-basePrimary"
              />
              <Label htmlFor="recall">Recall certificate</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div className="relative h-fit w-full">
        <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
          Certificate name
        </span>
        <Select
          onValueChange={(value) => {
            const certificate = eventCertificates.find(
              ({ id }) => id === value
            );
            if (certificate) setSelectedCertificate(certificate);
          }}
          defaultValue={selectedCertificate?.id || null}
          disabled={eventCertificateisLoading}
        >
          <SelectTrigger className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 w-full">
            <SelectValue placeholder={"Select Certificate Name"} />
          </SelectTrigger>
          <SelectContent>
            {eventCertificates &&
              eventCertificates.map(({ id, certificateName }) => (
                <SelectItem value={id}>{certificateName}</SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <ViewAttendeesSection
        attendeesTags={attendeesTags}
        favourites={favourites}
        attendees={mappedAttendees}
        selectedAttendees={selectedAttendees}
        toggleValue={toggleValue}
      />
      <DialogClose asChild>
        <Button
          disabled={
            selectedAttendees.length === 0 || !action || !selectedCertificate
          }
          className="bg-basePrimary w-full"
          onClick={onSubmit}
        >
          Save
        </Button>
      </DialogClose>
    </div>
  );
};

export default CertificateDialog;
