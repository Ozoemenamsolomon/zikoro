"use client";

import { Button } from "@/components";
import { MdClose } from "react-icons/md";
import { paymentConfig, useAddPartners } from "@/hooks";
import { TPartner } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, Suspense } from "react";
import { Lock } from "styled-icons/fa-solid";
import { ArrowBack } from "styled-icons/boxicons-regular";
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
import { TbLoader3 } from "react-icons/tb";
import { SlSocialLinkedin } from "react-icons/sl";

type TEventData = {
  eventName: string;
  eventStartDate: string;
  eventEndDate: string;
  location: string;
  eventPoster: string;
  address: string;
  organizerName: string;
  currency: string;
  organizerPhoneNumber: string;
  organizerWhatsappNumber: string;
};
 function PartnerPaymentComp() {
  const router = useRouter();
  const params = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const data = params.get("p");
  const eventData = params.get("e");
  const discountAmount = params.get("discountAmount");
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
  const parsedEventData: TEventData | null = useMemo(() => {
    if (eventData) {
      const dataString = decodeURIComponent(eventData);
      const decodedData = JSON.parse(dataString);
      return decodedData;
    } else {
      return null;
    }
  }, [eventData]);

  const config = paymentConfig({
    reference: partnerData?.paymentReference!,
    email: partnerData?.email!,
    amount: partnerData?.amountPaid,
    currency: partnerData?.currency,
  });

  async function handleSuccess(reference: any) {
    if (!parsedEventData) return;
    const payload = {
      ...partnerData,
    };

    const eventPayload = {
      ...parsedEventData,
    };

    await addPartners(payload, eventPayload);
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
                {(partnerData?.amountPaid || 0)?.toLocaleString()}
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
          eventName={parsedEventData?.eventName!}
          startDate={parsedEventData?.eventStartDate!}
          endDate={parsedEventData?.eventEndDate!}
          location={parsedEventData?.location!}
        />
      )}
      {loading && (
        <div className="w-full h-full inset-0 fixed z-[300]">
          <div className="W-fit h-fit flex flex-col items-center justify-center inset-0 m-auto absolute box-animation">
            <TbLoader3 size={30} className="text-basePrimary animate-spin" />
            <p>Processing...</p>
          </div>
        </div>
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

  const eventStartDate = useMemo(() => {
    if (startDate) {
      return `${formatDate(startDate)}`;
    } else {
      return null;
    }
  }, [startDate]);

  const eventEndDate = useMemo(() => {
    if (endDate) {
      return `${formatDate(endDate)}`;
    } else {
      return null;
    }
  }, [endDate]);

  function onClose() {
    setIsShare((prev) => !prev);
  }
  return (
    <div className="w-full bg-[#F9FAFF] fixed  h-full inset-0 z-[200]">
      <div className="w-[95%] px-4 pt-6 grid grid-cols-1 items-center justify-center gap-y-10 bg-white max-w-lg absolute m-auto h-fit inset-0">
        <div className="w-full flex items-center gap-y-5 flex-col">
          <div className="w-20 h-20 flex items-center justify-center bg-green-200 rounded-full">
            <BsPatchCheck className="text-green-500" size={50} />
          </div>
          <div className="flex flex-col items-center justify-center gap-y-1">
            <h2 className="text-green-500 font-medium text-lg sm:text-2xl">
              Payment Successful
            </h2>
            <p className="text-xs sm:text-mobile">
              Reference:{" "}
              <span className="text-basePrimary">
                {partnerData?.paymentReference ?? ""}
              </span>
            </p>
          </div>
          <p className="text-center max-w-sm">
            You have successfully made payment to be a{" "}
            <span className="font-medium">partner</span> for this event.
          </p>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-y-2">
          <p className="font-semibold">{eventName ?? ""}</p>
          <div className="flex items-center gap-x-2">
            <CiCalendar size={18} />
            <p>
              {eventStartDate ?? ""} - {eventEndDate ?? ""}
            </p>
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
          Powered by{" "}
          <Link href="https://zikoro.com" className="text-basePrimary">
            Zikoro
          </Link>
        </p>
      </div>
      {isShare && eventName && eventStartDate && eventEndDate && (
        <ShareModal
          eventId={partnerData?.eventAlias!}
          text={`I am excited to be exhibiting at the ${eventName} happening on ${eventStartDate} to ${eventEndDate}. We would be delighted to have you visit our booth. Here is the link to register if you would like to attend.  https://www.zikoro.com/live-events/${partnerData?.eventAlias}`}
          close={onClose}
        />
      )}
    </div>
  );
}

export function ShareModal({
  eventId,
  text,
  close,
  header,
}: {
  close: () => void;
  eventId: string;
  text: string;
  header?: string;
}) {
  const [isShow, showSuccess] = useState(false);

  function copyLink() {
    copy(text);
    showSuccess(true);
    setTimeout(() => showSuccess(false), 2000);
  }
  const socials = [
    {
      Icon: FaWhatsapp,
      link: `https://api.whatsapp.com/send?text=${text} `,
    },
    {
      Icon: HiOutlineMail,
      link: `mailto:?subject=Register%20for%20this%20event&body=${text}`,
    },
    {
      Icon: FaXTwitter,
      link: `https://x.com/intent/tweet?url=${text}`,
    },
    {
      Icon: SlSocialFacebook,
      link: `https://www.facebook.com/sharer/sharer.php?u=${text}`,
    },
    {
      Icon: SlSocialLinkedin,
      link: `https://www.linkedin.com/shareArticle?url=${text}`,
    },
  ];
  return (
    <div
      onClick={close}
      className="w-full h-full inset-0 bg-white/40 fixed z-[400]"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-[95%] max-w-xl shadow rounded-xl box-animation bg-white absolute inset-0 h-fit m-auto p-6"
      >
        <div className="w-full mb-3 flex items-center justify-between">
          <p className="font-medium border-b border-basePrimary pb-1">
            {header || " Share event with your network"}
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
              <p className="absolute text-xs w-[100px] -top-10 bg-black/50 text-white font-medium rounded-md px-3 py-2 transition-transform tranition-all duration-300 animate-fade-in-out">
                Link Copied
              </p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PartnerPayment() {
  return (
    <Suspense>
      <PartnerPaymentComp/>
    </Suspense>
  )
}