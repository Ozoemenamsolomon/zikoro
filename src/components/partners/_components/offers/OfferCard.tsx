"use client";

import Image from "next/image";
import { AlertCircle } from "@styled-icons/feather/AlertCircle";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { Button } from "@/components";
import { useMemo, useState } from "react";
import { formatShortDate, sendMail, whatsapp } from "@/utils";
import { PromotionalOfferType } from "@/types";
export function OfferCard({ offer }: { offer: PromotionalOfferType }) {
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }

  const formatDiscount = useMemo(() => {
    return (
      (Number(offer?.productPrice) -
        Number(offer?.productPromo)) / Number(offer?.productPrice) *
      100
    );
  }, [offer?.productPrice, offer?.productPromo]);
  return (
    <>
      <div className="w-full h-fit pb-3 flex flex-col border rounded-md  gap-y-2 items-start">
        <div className="relative w-full h-40 sm:h-56 rounded-t-md overflow-hidden">
          <Image
            src={offer?.productImage ? offer?.productImage : ""}
            alt="product"
            width={600}
            height={600}
            className="w-full rounded-t-md h-40 sm:h-56"
          />
          <span className="absolute text-white text-xs bg-zikoro px-2 py-1 rounded-bl-lg top-0 right-0">
            {`${formatDiscount}%`}
          </span>
        </div>
        <div className="w-full px-3 flex items-start justify-between">
          <div className="flex flex-col items-start justify-start">
            <p className="font-medium">40% OFF Sales Price</p>
            <p className="text-xs text-gray-600">{offer?.serviceTitle ?? ""}</p>
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
            className="text-zikoro text-sm font-semibold"
          >
            Get Offer
          </button>
          <p className="font-semibold text-zinc-700 text-sm">
            Discount code: 534rewfw
          </p>{" "}
        </div>
      </div>
      {isOpen && <OfferCardModal close={onClose} offer={offer} />}
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
  return (
    <div
      role="button"
      onClick={close}
      className="w-full h-full fixed z-[100]  inset-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="button"
        className="w-[95%] sm:w-[450px] box-animation h-fit flex mb-10 flex-col gap-y-6 rounded-lg bg-white  m-auto absolute inset-0 py-6 px-3 sm:px-4"
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
              className="w-full rounded-t-md h-40 sm:h-56"
            />
            <span className="absolute text-white text-xs bg-zikoro px-2 py-1 rounded-bl-lg top-0 right-0">
              2%
            </span>
          </div>
          <div className="w-full px-3 flex items-start justify-start">
            <div className="flex flex-col items-start justify-start">
              <p className="font-medium">40% OFF Sales Price</p>
              <p className="text-xs text-gray-600">
                {offer?.serviceTitle ?? ""}
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
              className="text-zikoro text-sm font-semibold"
            >
              Get Offer
            </button>
            <p className="font-semibold text-zinc-700 text-sm">
              Discount code: 534rewfw
            </p>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
