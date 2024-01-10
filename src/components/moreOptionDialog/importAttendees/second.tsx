import React from "react";
import { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { areAllPropertiesSet } from "@/utils/helpers";

const Second = ({
  headers,
  updateHeader,
  excelHeaders,
  step,
  setStep,
}: {
  headers: Partial<TAttendee>;
  updateHeader: (index: number, value: string) => void;
  excelHeaders: any[];
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const options = [
    { label: "First name", value: "firstName" },
    { label: "Last name", value: "lastName" },
    { label: "Email", value: "email" },
    { label: "Phone number", value: "phoneNumber" },
    { label: "WhatsApp", value: "whatsappNumber" },
  ];

  const onSubmit = () => {
    setStep(2);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-9 gap-4 items-center">
          <div className="col-span-4">
            <span className="text-gray-800 font-medium">
              Your spreadsheet header
            </span>
          </div>
          <div className="flex justify-center"></div>
          <div className="col-span-4">
            <span className="text-gray-800 font-medium">Our input fields</span>
          </div>
        </div>
        {excelHeaders.map((header, index) => (
          <div className="grid grid-cols-9 gap-4 items-center">
            <div className="col-span-4">
              <Input
                disabled
                className="bg-gray-200 text-gray-700"
                value={header}
              />
            </div>
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M11.793 7.50014H2.5C2.36739 7.50014 2.24021 7.55282 2.14645 7.64659C2.05268 7.74036 2 7.86753 2 8.00014C2 8.13275 2.05268 8.25993 2.14645 8.3537C2.24021 8.44746 2.36739 8.50014 2.5 8.50014H11.793L8.146 12.1461C8.05211 12.24 7.99937 12.3674 7.99937 12.5001C7.99937 12.6329 8.05211 12.7603 8.146 12.8541C8.23989 12.948 8.36723 13.0008 8.5 13.0008C8.63278 13.0008 8.76011 12.948 8.854 12.8541L13.354 8.35414C13.4006 8.3077 13.4375 8.25252 13.4627 8.19178C13.4879 8.13103 13.5009 8.06591 13.5009 8.00014C13.5009 7.93438 13.4879 7.86926 13.4627 7.80851C13.4375 7.74776 13.4006 7.69259 13.354 7.64614L8.854 3.14614C8.76011 3.05226 8.63278 2.99951 8.5 2.99951C8.36723 2.99951 8.23989 3.05226 8.146 3.14614C8.05211 3.24003 7.99937 3.36737 7.99937 3.50014C7.99937 3.63292 8.05211 3.76026 8.146 3.85414L11.793 7.50014Z"
                  fill="#CFCFCF"
                />
              </svg>
            </div>
            <div className="col-span-4">
              <Select onValueChange={(value) => updateHeader(index, value)}>
                <SelectTrigger className="bg-gray-200 text-gray-700">
                  <SelectValue placeholder="Select Input" />
                </SelectTrigger>
                <SelectContent>
                  {options.map(({ label, value }) => (
                    <SelectItem value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={onSubmit}
        disabled={!areAllPropertiesSet(headers)}
        className="bg-basePrimary w-full"
      >
        Continue
      </Button>
    </>
  );
};

export default Second;
