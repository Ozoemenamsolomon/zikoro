"use client";

import { Button } from "@/components";
import { MdClose } from "react-icons/md";
import { paymentConfig, useAddPartners } from "@/hooks";
import { TPartner } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Lock } from "styled-icons/fa-solid";
import { ArrowBack, Show } from "styled-icons/boxicons-regular";
import { PaystackButton } from "react-paystack";
import { BsPatchCheck } from "react-icons/bs";
import { CiShare2, CiCalendar, CiLocationOn } from "react-icons/ci";
import { formatDate } from "@/utils";
import { SlSocialFacebook } from "react-icons/sl";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { RxLink2 } from "react-icons/rx";
import Link from "next/link";
import copy from "copy-to-clipboard";
export default function PartnerPayment() {
  const router = useRouter();
  const params = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const data = params.get("p");
  const eventName = params.get("eventName");
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");
  const location = params.get("location");

  const { addPartners, loading } = useAddPartners();

  const partnerData: Partial<TPartner> = useMemo(() => {
    if (data) {
      const dataString = decodeURIComponent(data);
      const decodedData = JSON.parse(dataString);
      return decodedData;
    } else {
      return null;
    }
  }, [data]);

  const config = paymentConfig({
    reference: partnerData?.paymentReference!,
    email: partnerData?.email!,
    amount: partnerData?.amountPaid,
    currency: partnerData?.currency,
  });

  async function handleSuccess(reference: any) {
    const payload = {
      ...partnerData,
    };

    await addPartners(payload);
    setIsSuccess(true);
  }

  const componentProps: any = {
    ...config,
    // text: 'Paystack Button Implementation',
    children: (
      <Button className="w-full min-w-[280px]  gap-x-2 bg-basePrimary text-gray-50 font-medium">
        <Lock size={22} />
        <span>{`Pay ${partnerData?.currency} ${Number(
          partnerData?.amountPaid
        )?.toLocaleString()}`}</span>
      </Button>
    ),
    onSuccess: (reference: any) => handleSuccess(reference),
  };

  return (
    <div className="w-full bg-[#F9FAFF] fixed inset-0 h-full">
      <div className="max-w-md m-auto flex flex-col items-start justify-start gap-y-3 p-4 w-[95%] inset-0 absolute h-fit">
        <Button
          onClick={() => router.back()}
          className="px-0 h-fit w-fit  bg-none  "
        >
          <ArrowBack className="px-0 w-fit h-fit" size={20} />
        </Button>

        <div className="w-full bg-white h-fit flex items-center justify-center flex-col gap-y-5 rounded-lg p-4">
          <p className="font-semibold text-lg sm:text-xl">Order Summary</p>

          <div className="w-full border rounded-lg py-6 px-4">
            <p className="w-full border-b pb-2">Orders</p>

            <div className="w-full mt-6 mb-2 flex items-center justify-between">
              <p>1X SubTotal</p>
              <p className="font-medium">
                {partnerData?.currency}{" "}
                {partnerData?.amountPaid?.toLocaleString()}
              </p>
            </div>
            <div className="w-full  flex items-center justify-between">
              <p className="font-semibold">Total</p>
              <p className="font-semibold">
                {partnerData?.currency}{" "}
                {partnerData?.amountPaid?.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <PaystackButton {...componentProps} />
          </div>
        </div>
      </div>

      {isSuccess && (
        <PaymentSuccessModal
          partnerData={partnerData}
          eventName={eventName}
          startDate={startDate}
          endDate={endDate}
          location={location}
        />
      )}
    </div>
  );
}

function PaymentSuccessModal({
  partnerData,
  eventName,
  startDate,
  endDate,
  location,
}: {
  partnerData: Partial<TPartner>;
  eventName: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
}) {
  const [isShare, setIsShare] = useState(false);
  const date = useMemo(() => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else {
      return null;
    }
  }, [startDate, endDate]);

  function onClose() {
    setIsShare((prev) => !prev);
  }
  return (
    <div className="w-full bg-[#F9FAFF]  h-full inset-0 z-[200]">
      <div className="w-[95%] px-4 py-6 grid grid-cols-1 items-center justify-center gap-y-10 bg-white max-w-lg absolute m-auto h-fit inset-0">
        <div className="w-full flex items-center gap-y-5 flex-col">
          <div className="w-20 h-20 flex items-center justify-center bg-green-200 rounded-full">
            <BsPatchCheck className="text-green-500" size={50} />
          </div>
          <h2 className="text-green-500 font-medium text-lg sm:text-2xl">
            Payment Successful
          </h2>
          <p className="text-center max-w-sm">
            You have successfully made payment to be a
            <span className="font-medium">partner</span> for this event.
          </p>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-y-2">
          <p className="font-semibold">{eventName ?? ""}</p>
          <div className="flex items-center gap-x-2">
            <CiCalendar size={18} />
            <p>{date ?? ""}</p>
          </div>
          <p className="flex items-center gap-x-2">
            <CiLocationOn size={18} />
            <p>{location ?? ""}</p>
          </p>
        </div>

        <div className="w-full flex flex-col gap-y-2 items-center justify-center">
          <p className="font-medium text-center max-w-sm">
            Check your mail to get further directions from event organizer
          </p>
          <button
            onClick={onClose}
            className="w-fit border-b max-w-md text-gray-500 flex border-gray-500"
          >
            <p className=" text-xs text-start sm:text-mobile">
              Inform your network that you are attending this event
            </p>
            <CiShare2 size={16} />
          </button>
        </div>

        <p className="text-center text-tiny sm:text-xs">
          Powered by <span className="text-basePrimary">Zikoro</span>
        </p>
      </div>
      {isShare && (
        <ShareModal eventId={partnerData?.eventAlias!} close={onClose} />
      )}
    </div>
  );
}

function ShareModal({
  eventId,
  close,
}: {
  close: () => void;
  eventId: string;
}) {
  const [isShow, showSuccess] = useState(false);
  function copyLink() {
    copy(`https://www.zikoro.com/live-events/${eventId}`);
    showSuccess(true);
    setTimeout(() => showSuccess(false), 2000);
  }
  const socials = [
    {
      Icon: FaWhatsapp,
      link: `https://api.whatsapp.com/send?text=https://www.zikoro.com/live-events/${eventId}`,
    },
    {
      Icon: HiOutlineMail,
      link: `mailto:?subject=Register%20for%20this%20event&body=https://zikoro.com/live-events/${eventId}`,
    },
    {
      Icon: FaXTwitter,
      link: `https://x.com/intent/tweet?url=https://zikoro.com/live-events/${eventId}`,
    },
    {
      Icon: SlSocialFacebook,
      link: `https://www.facebook.com/sharer/sharer.php?u=https://zikoro.com/live-events/${eventId}`,
    },
  ];
  return (
    <div className="w-full h-full inset-0 bg-white/40 fixed z-[400]">
      <div className="w-[95%] max-w-xl shadow rounded-xl bg-white absolute inset-0 h-fit m-auto p-6">
        <div className="w-full mb-3 flex items-center justify-between">
          <p className="font-medium border-b border-basePrimary pb-1">
            Share event with your network
          </p>
          <Button
            onClick={close}
            className="px-0 self-end w-11 h-11 rounded-full bg-gray-200"
          >
            <MdClose size={22} />
          </Button>
        </div>

        <div className="w-full rounded-xl p-4 bg-[#F9FAFF] gap-4 flex flex-wrap items-start justify-start">
          {socials.map(({ Icon, link }, index) => (
            <Link
              key={index}
              href={link}
              target="_blank"
              className="w-20 rounded-full bg-[#001ffc]/10 flex items-center justify-center h-20"
            >
              <Icon size={50} />
            </Link>
          ))}
          <button
            onClick={copyLink}
            className="w-20 rounded-full relative bg-[#001ffc]/10 flex items-center justify-center h-20"
          >
            <RxLink2 size={50} />
            {isShow && (
              <p className="absolute -top-10 bg-black/50 text-white font-medium rounded-md px-3 py-2 transition-transform tranition-all duration-300 animate-fade-in-out">
                Link Copied
              </p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
