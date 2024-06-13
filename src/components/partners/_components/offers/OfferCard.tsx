"use client";

import Image from "next/image";
import { AlertCircle } from "@styled-icons/feather/AlertCircle";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { Button, Textarea } from "@/components";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useMemo, useState } from "react";
import { formatShortDate, sendMail, whatsapp } from "@/utils";
import { PromotionalOfferType, TAttendee, TLead } from "@/types";
import { useForm } from "react-hook-form";
import { useCreateLeads } from "@/hooks";
export function OfferCard({
  offer,
  isOrganizer,
  attendee,
}: {
  isOrganizer: boolean;
  attendee?: TAttendee;
  offer: PromotionalOfferType;
}) {
  const [isOpen, setOpen] = useState(false);
  const [isApply, setApply] = useState(false);

  function toggleApply() {
    setApply((prev) => !prev);
  }

  function onClose() {
    setOpen((prev) => !prev);
  }

  const formatDiscount = useMemo(() => {
    return (
      ((Number(offer?.productPrice) - Number(offer?.productPromo)) /
        Number(offer?.productPrice)) *
      100
    );
  }, [offer?.productPrice, offer?.productPromo]);

  function apply() {
    if (offer?.url) {
      visitOfferPage(offer?.url);
    }
    if (offer?.whatsApp) {
      whatsapp(
        offer?.whatsApp,
        `I'm interested in the ${offer?.serviceTitle ?? ""} offer`
      );
    }
    if (offer?.email) {
      sendMail(offer?.email);
    }
  }
  return (
    <>
      <div className="w-full h-fit pb-3 flex flex-col border rounded-md  gap-y-2 items-start">
        <div className="relative w-full h-40 sm:h-56 rounded-t-md overflow-hidden">
          {offer?.productImage ? (
            <Image
              src={offer?.productImage || ""}
              alt="product"
              width={600}
              height={600}
              className="w-full rounded-t-md h-[180px] sm:h-56"
            />
          ) : (
            <div className="w-full rounded-t-md h-[180px] sm:h-56 bg-gray-200 animate-pulse"></div>
          )}
          <span className="absolute text-white text-xs bg-basePrimary px-2 py-1 rounded-bl-lg top-0 right-0">
            {`${formatDiscount?.toFixed(0)}%`}
          </span>
        </div>
        <div className="w-full px-3 flex items-start justify-between">
          <div className="flex flex-col items-start justify-start">
            <p className="font-medium">{offer?.serviceTitle ?? ""}</p>
            <p className="text-xs w-full text-ellipsis overflow-hidden whitespace-nowrap text-gray-600">
              {offer?.companyName ?? ""}
            </p>
          </div>
          <button onClick={onClose}>
            <AlertCircle className="text-gray-600" size={22} />
          </button>
        </div>
        <div className="flex px-3 items-center gap-x-3">
          <p className="font-semibold">
            {" "}
            {`₦${Number(offer?.productPromo)?.toLocaleString()}`}
          </p>
          <p className="font-semibold text-gray-400 line-through">{`₦${Number(
            offer?.productPrice
          )?.toLocaleString()}`}</p>
        </div>
        <p className="px-3 text-gray-600">{`Offer Valid Until ${formatShortDate(
          offer?.endDate
        )}`}</p>
        <div className="px-3 w-full mt-1 flex items-center justify-between">
          <button
            onClick={() => {
              apply();
            }}
            className="text-basePrimary text-sm font-semibold"
          >
            Get Offer
          </button>
          <p className="font-semibold text-zinc-700 text-sm">
            Discount code: {offer?.voucherCode ?? ""}
          </p>{" "}
        </div>
      </div>
      {isOpen && <OfferCardModal close={onClose} offer={offer} />}
      {isApply && (
        <ActionWidget
          close={toggleApply}
          offer={offer}
          attendee={attendee}
          apply={apply}
        />
      )}
    </>
  );
}

function visitOfferPage(url: string) {
  window.open(url, "_blank");
}

function OfferCardModal({
  close,
  offer,
}: {
  offer: PromotionalOfferType;
  close: () => void;
}) {
  const formatDiscount = useMemo(() => {
    return (
      ((Number(offer?.productPrice) - Number(offer?.productPromo)) /
        Number(offer?.productPrice)) *
      100
    );
  }, [offer?.productPrice, offer?.productPromo]);
  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100]  inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[450px] box-animation h-fit max-h-[85%] overflow-y-auto flex my-10 flex-col gap-y-6 rounded-lg bg-white  mx-auto absolute inset-0 py-6 px-3 sm:px-4"
      >
        <div className="w-full flex items-end justify-end">
          <Button onClick={close} className="px-1 h-fit w-fit">
            <CloseOutline size={22} />
          </Button>
        </div>

        <div className="w-full h-fit pb-3 flex flex-col  gap-y-2 items-start">
          <div className="relative w-full h-40 sm:h-56 rounded-t-md overflow-hidden">
            <Image
              src={offer?.productImage ? offer?.productImage : ""}
              alt="product"
              width={600}
              height={600}
              className="w-full rounded-t-md h-[180px] sm:h-56"
            />
            <span className="absolute text-white text-xs bg-basePrimary px-2 py-1 rounded-bl-lg top-0 right-0">
              {`${formatDiscount?.toFixed(0)}%`}
            </span>
          </div>
          <div className="w-full px-3 flex items-start justify-start">
            <div className="flex flex-col items-start justify-start">
              <p className="font-medium"> {offer?.serviceTitle ?? ""}</p>
              <p className="text-xs w-full text-ellipsis overflow-hidden whitespace-nowrap text-gray-600">
                {offer?.companyName ?? ""}
              </p>
            </div>
          </div>
          <div className="flex px-3 items-center gap-x-3">
            <p className="font-semibold">{`₦${Number(
              offer?.productPromo
            )?.toLocaleString()}`}</p>
            <p className="font-semibold text-gray-400">{`₦${Number(
              offer?.productPrice
            )?.toLocaleString()}`}</p>
          </div>
          <p className="px-3 text-gray-600">{`Offer Valid Until ${formatShortDate(
            offer?.endDate
          )}`}</p>

          <p className="w-full flex-wrap px-3 items-start justify-start leading-6 text-gray-600 text-sm">
            {offer?.offerDetails}
          </p>
          <div className="px-3 w-full mt-1 flex items-center justify-between">
            <button
              onClick={() => {
                if (offer?.url) {
                  visitOfferPage(offer?.url);
                }
                if (offer?.whatsApp) {
                  whatsapp(
                    offer?.whatsApp,
                    `I'm interested in the ${offer?.serviceTitle ?? ""} offer`
                  );
                }
                if (offer?.email) {
                  sendMail(offer?.email);
                }
              }}
              className="hidden text-basePrimary text-sm font-semibold"
            >
              Get Offer
            </button>
            <p className="font-semibold text-zinc-700 text-sm">
              Discount code: {offer?.voucherCode ?? ""}
            </p>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionWidget({
  offer,
  close,
  apply,
  attendee,
}: {
  offer: PromotionalOfferType;
  close: () => void;
  apply: () => void;
  attendee?: TAttendee;
}) {
  const [isShow, setShow] = useState(false);
  const { isLoading, createLeads } = useCreateLeads();
  const form = useForm({})

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
      eventPartnerId: offer?.partnerId,
      stampCard: true,
      firstContactChannel: {
        interestType: "Offer",
        title: offer?.serviceTitle,
        note: values?.note,
      },
      interests: [
        {
          interestType: "Offer",
          title: offer?.serviceTitle,
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
        className="w-[95%] max-w-xl m-auto h-[400px] absolute  inset-0 rounded-lg bg-white py-10 px-4 flex  flex-col "
      >
        {isShow ? (
          <div className="w-full flex gap-y-16 flex-col items-center justify-center h-full">
            <p className="text-center">
              Do you want to apply for this offer?. Your details will be shared
              with <span className="font-semibold">{offer?.companyName}</span>
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
            className="w-full flex flex-col items-start justify-start gap-y-3"
          >
            <Textarea
              placeholder="Write Something... (Optional)"
              className="w-full h-[70%] "
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
