"use client";

import { EventWidget, CertificateWidget } from "..";
import { Event, TIssuedCertificate } from "@/types";
import { Button } from "@/components";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";

export function AllDatas<T>({
  data,
  title,
  onClose,
}: {
  title: string;
  data?: T[];
  onClose: () => void;
}) {
  const isEventArray = (data: any[]): data is Event[] => {
    return data.every((item) => typeof item === "object" && "id" in item);
  };
  return (
    <div
      role="button"
      onClick={onClose}
      className="w-full h-full inset-0 z-[500] bg-white/50 fixed"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-[95%] max-w-4xl bg-white absolute m-auto inset-0 rounded-lg shadow py-6 px-4 h-fit max-h-[85%] overflow-y-auto"
      >
        <div className="w-full flex items-center justify-between mb-4">
          <h2 className=" font-semibold text-base sm:text-lg">{title}</h2>
          <Button onClick={onClose}>
            <CloseOutline size={22} />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {Array.isArray(data) && isEventArray(data)
            ? data?.map((event) => (
                <EventWidget
                  event={event as Event}
                  key={(event as Event)?.id}
                />
              ))
            : data?.map((certificate) => (
                <CertificateWidget
                  certificate={certificate as TIssuedCertificate}
                  key={(certificate as TIssuedCertificate)?.id}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
