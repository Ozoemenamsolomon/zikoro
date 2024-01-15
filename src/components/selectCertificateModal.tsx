import { TAttendeeCertificate } from "@/types/certificates";
import React, { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { useRecallAttendeeCertificates } from "@/services/certificate";

const SelectCertificateModal = ({
  certificates,
  action,
  attendeeId,
  getAttendeeCertificates,
}: {
  certificates: TAttendeeCertificate[];
  action: string;
  attendeeId: number;
  getAttendeeCertificates: () => Promise<void>;
}) => {
  const [selectedCertificates, setSelectedCertificates] = useState<
    TAttendeeCertificate[]
  >([]);

  const { recallAttendeeCertificates, error } = useRecallAttendeeCertificates({
    eventId: 1234567890,
    attendeeId,
  });

  type ValueType = TAttendeeCertificate | TAttendeeCertificate[];

  const toggleValue = (value: ValueType) => {
    const updatedValue = Array.isArray(value)
      ? value
      : value && selectedCertificates.includes(value)
      ? selectedCertificates.filter((item) => item !== value)
      : [...selectedCertificates, value];

    setSelectedCertificates(updatedValue);
  };

  const onSubmit = async () => {
    await recallAttendeeCertificates({
      payload: {
        certificateIds: selectedCertificates.map(
          ({ CertificateGroupId }) => CertificateGroupId
        ),
      },
    });
    await getAttendeeCertificates();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 max-h-32 overflow-auto">
        {certificates.map((certificate) => (
          <div className="flex items-center space-x-2">
            <Checkbox className="data-[state=checked]:bg-basePrimary"
              id="terms2"
              onCheckedChange={() => toggleValue(certificate)}
              checked={selectedCertificates.includes(certificate)}
            />
            <label
              htmlFor="terms2"
              className="capitalize text-gray-500 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {certificate.CertificateName}
            </label>
          </div>
        ))}
      </div>
      <DialogClose asChild>
        <Button
          disabled={selectedCertificates.length === 0}
          className="bg-basePrimary w-full"
          onClick={onSubmit}
        >
          Save
        </Button>
      </DialogClose>
    </div>
  );
};

export default SelectCertificateModal;
