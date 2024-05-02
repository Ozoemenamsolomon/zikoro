"use client";

import { Button } from "@/components";
import { Location } from "@styled-icons/fluentui-system-regular/Location";
import { Bag } from "@styled-icons/ionicons-solid/Bag";
import { User } from "@styled-icons/boxicons-regular/User";
import { BoxSeam } from "styled-icons/bootstrap";
import { PartnerJobType } from "@/types";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { useMemo, useState } from "react";
import { COUNTRIES_CURRENCY, sendMail, whatsapp } from "@/utils";
import { FlexibilityType } from "..";
import { cn } from "@/lib";
import { AlertCircle } from "@styled-icons/feather/AlertCircle";

export function JobWidget({
  job,
  className,
}: {
  job: PartnerJobType;
  className: string;
}) {
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }
  const currency = useMemo(() => {
    if (job.currencyCode) {
      const symbol =
        COUNTRIES_CURRENCY.find(
          (v) => String(v.code) === String(job.currencyCode)
        )?.symbol || "₦";
      return symbol;
    }
  }, [job.currencyCode]);

  function apply() {
    if (job?.applicationLink) {
      window.open(job.applicationLink, "_blank");
    }
    if (job?.whatsApp) {
      whatsapp(
        job?.whatsApp,
        `I'm interested in the ${job?.jobTitle ?? ""} job`
      );
    }
    if (job?.email) {
      sendMail(job?.email);
    }
  }
  return (
    <>
      <div
        className={cn(
          "w-full flex flex-col pb-4 items-start justify-start h-full gap-y-2",
          className
        )}
      >
        <div className="flex w-full items-start justify-between ">
          <div className="flex items-start justify-start flex-col">
            <h2 className="font-semibold text-base sm:text-lg">
              {job.jobTitle ?? ""}
            </h2>
            <p className="text-gray-600 text-sm">{job.companyName ?? ""}</p>
          </div>

          <Button onClick={onClose} className="px-0 w-fit h-fit">
            <AlertCircle size={22} className="text-gray-500" />
          </Button>
        </div>

        {/* <p className="text-[#717171] uppercase">{job.companyName}</p> */}
        <p>{`${currency || "₦"}${Number(job.minSalary)?.toLocaleString()} - ${
          currency || "₦"
        }${Number(job.maxSalary)?.toLocaleString()} ${job.salaryDuration}`}</p>

        <FlexibilityType flexibility={job.flexibility} />

        <p className="w-4/5 flex flex-wrap line-clamp text-[#717171] items-start justify-start leading-5 text-sm">
          {`${job.description ?? ""}`}
        </p>

        <div className="flex text-[#717171] items-start justify-start text-mobile mt-1 flex-wrap gap-3">
          <div className="flex items-center gap-x-2">
            <Location size={16} className="text-[#717171]" />
            <p>{`${job.city}, ${job.country}`}</p>
          </div>
          <div className="flex items-center gap-x-2">
            <Bag size={16} className="text-[#717171]" />
            <p>{job.employmentType}</p>
          </div>
          <div className="flex capitalize items-center gap-x-2">
            <User size={16} className="text-[#717171]" />
            <p>{`${job.experienceLevel} Experience`}</p>
          </div>
          <div className="flex  items-center gap-x-2">
            <BoxSeam size={16} className="text-[#717171]" />
            <p>{job.qualification}</p>
          </div>
        </div>

        <Button
          onClick={apply}
          className="hover:text-gray-50 w-full sm:w-fit mt-3 transform border transition-all duration-300 ease-in-out  border-basePrimary hover:bg-basePrimary text-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
        >
          Apply Now
        </Button>
      </div>
      {isOpen && <JobCardModal close={onClose} job={job} />}
    </>
  );
}

function JobCardModal({
  close,
  job,
}: {
  close: () => void;
  job: PartnerJobType;
}) {
  const currency = useMemo(() => {
    if (job.currencyCode) {
      const symbol =
        COUNTRIES_CURRENCY.find(
          (v) => String(v.code) === String(job.currencyCode)
        )?.symbol || "₦";
      return symbol;
    }
  }, [job.currencyCode]);

  function apply() {
    if (job?.applicationLink) {
      window.open(job.applicationLink, "_blank");
    }
    if (job?.whatsApp) {
      whatsapp(
        job?.whatsApp,
        `I'm interested in the ${job?.jobTitle ?? ""} job`
      );
    }
    if (job?.email) {
      sendMail(job?.email);
    }
  }
  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100]  inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] max-w-xl box-animation h-fit max-h-[85%] overflow-y-auto flex my-10 flex-col gap-y-6 rounded-lg bg-white  mx-auto absolute inset-0 py-6 px-3 sm:px-4"
      >
        <div className="w-full flex items-end justify-end">
          <Button onClick={close} className="px-1 h-fit w-fit">
            <CloseOutline size={22} />
          </Button>
        </div>

        <div className="w-full flex flex-col pb-4 items-start justify-start gap-y-2">
          <div className="flex items-start justify-start flex-col">
            <h2 className="font-semibold text-base sm:text-lg">
              {job.jobTitle ?? ""}
            </h2>
            <p className="text-gray-600 text-sm">{job.companyName ?? ""}</p>
          </div>

          {/* <p className="text-[#717171] uppercase">{job.companyName}</p> */}
          <p>{`${currency || "₦"}${Number(job.minSalary)?.toLocaleString()} - ${
            currency || "₦"
          }${Number(job.maxSalary)?.toLocaleString()} ${
            job.salaryDuration
          }`}</p>

          <FlexibilityType flexibility={job.flexibility} />

          <p className="w-full flex flex-wrap text-[#717171] items-start justify-start leading-5 text-sm">
            {`${job.description ?? ""}`}
          </p>

          <div className="flex text-[#717171] items-start justify-start text-mobile mt-1 flex-wrap gap-3">
            <div className="flex items-center gap-x-2">
              <Location size={16} className="text-[#717171]" />
              <p>{`${job.city}, ${job.country}`}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <Bag size={16} className="text-[#717171]" />
              <p>{job.employmentType}</p>
            </div>
            <div className="flex capitalize items-center gap-x-2">
              <User size={16} className="text-[#717171]" />
              <p>{`${job.experienceLevel} Experience`}</p>
            </div>
            <div className="flex  items-center gap-x-2">
              <BoxSeam size={16} className="text-[#717171]" />
              <p>{job.qualification}</p>
            </div>
          </div>

          <Button
            onClick={apply}
            className="hover:text-gray-50 w-full sm:w-fit mt-3 transform border transition-all duration-300 ease-in-out  border-basePrimary hover:bg-basePrimary text-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
