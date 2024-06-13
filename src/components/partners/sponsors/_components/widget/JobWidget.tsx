"use client";

import { Button, Textarea } from "@/components";
import { Location } from "styled-icons/fluentui-system-regular";
import { Bag } from "styled-icons/ionicons-solid";
import { LoaderAlt, User } from "styled-icons/boxicons-regular";
import { BoxSeam } from "styled-icons/bootstrap";
import { PartnerJobType, TAttendee, TLead } from "@/types";
import { CloseOutline } from "styled-icons/evaicons-outline";
import { useMemo, useState } from "react";
import { COUNTRIES_CURRENCY, sendMail, whatsapp } from "@/utils";
import { FlexibilityType } from "..";
import { cn } from "@/lib";
import { AlertCircle } from "styled-icons/feather";
import { useForm } from "react-hook-form";
import { useCreateLeads } from "@/hooks";

export function JobWidget({
  job,
  className,
  attendee,
  isOrganizer,
}: {
  job: PartnerJobType;
  className: string;
  attendee?: TAttendee;
  isOrganizer: boolean;
}) {
  const [isOpen, setOpen] = useState(false);
  const [isApply, setApply] = useState(false);

  function toggleApply() {
    setApply((prev) => !prev);
  }

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

        {!isOrganizer && (
          <Button
            onClick={toggleApply}
            className="hover:text-gray-50 w-full sm:w-fit mt-3 transform border transition-all duration-300 ease-in-out  border-basePrimary hover:bg-basePrimary text-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
          >
            Apply Now
          </Button>
        )}
      </div>
      {isOpen && <JobCardModal close={onClose} job={job} />}
      {isApply && (
        <ActionWidget
          close={toggleApply}
          apply={apply}
          attendee={attendee}
          job={job}
        />
      )}
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
            //   onClick={apply}
            className="hidden hover:text-gray-50 w-full sm:w-fit mt-3 transform border transition-all duration-300 ease-in-out  border-basePrimary hover:bg-basePrimary text-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}

function ActionWidget({
  job,
  close,
  apply,
  attendee,
}: {
  job: PartnerJobType;
  close: () => void;
  apply: () => void;
  attendee?: TAttendee;
}) {
  const [isShow, setShow] = useState(false);
  const { isLoading, createLeads } = useCreateLeads();
  const form = useForm({});

  function toggleShow() {
    setShow((prev) => !prev);
  }

  const getLeadAttendee = (attendee?: TAttendee): Partial<TLead> => {
    return {
      firstName: attendee?.firstName,
      lastName: attendee?.lastName,
      attendeeEmail: attendee?.email,
      profilePicture: attendee?.profilePicture,
      bio: attendee?.bio,
      x: attendee?.x,
      linkedin: attendee?.linkedin,
      instagram: attendee?.instagram,
      facebook: attendee?.facebook,
      ticketType: attendee?.ticketType,
      attendeeType: attendee?.attendeeType,
      attendeeId: attendee?.id,
      eventAlias: attendee?.eventAlias,
      organization: attendee?.organization,
      city: attendee?.city,
      country: attendee?.country,
      phoneNumber: attendee?.phoneNumber,
      whatsappNumber: attendee?.whatsappNumber,
    };
  };

  async function onSubmit(values: any) {
    const leadAttendee = getLeadAttendee(attendee);

    const payload: Partial<TLead> = {
      ...leadAttendee,
      eventPartnerId: job?.partnerId,
      stampCard: true,
      jobTitle: job?.jobTitle,
      firstContactChannel: {
        interestType: "Job",
        title: job?.jobTitle,
        note: values?.note,
      },
      interests: [
        {
          interestType: "Job",
          title: job?.jobTitle,
          note: values?.note,
        },
      ],
    };

    await createLeads({ payload });
    apply()
    close()
  }

  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full inset-0  fixed z-[100] bg-black/50"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-[95%] max-w-xl m-auto h-[300px] absolute  inset-0 rounded-lg bg-white py-10 px-4 flex  flex-col "
      >
        {!isShow ? (
          <div className="w-full flex gap-y-16 flex-col items-center justify-center h-full">
            <p className="text-center">
              Do you want to apply for this job?. Your details will be shared
              with <span className="font-semibold">{job?.companyName}</span>
            </p>
            <div className="w-full flex items-end justify-end gap-x-3">
              <Button onClick={close}>Cancel</Button>
              <Button
                onClick={toggleShow}
                className="bg-basePrimary rounded-lg text-white w-[100px] gap-x-2"
              >
                <p>Continue</p>
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex h-full flex-col items-start justify-start gap-y-3"
          >
            <Textarea
              placeholder="Write Something... (Optional)"
              className="w-full h-[80%] "
              {...form.register("note")}
            ></Textarea>
            <div className="w-full flex items-end justify-end gap-x-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  // toggleShow();
                  close();
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                className="bg-basePrimary rounded-lg text-white w-[100px] gap-x-2"
              >
                {isLoading && <LoaderAlt size={22} className="animate-spin" />}
                <p> Submit</p>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
