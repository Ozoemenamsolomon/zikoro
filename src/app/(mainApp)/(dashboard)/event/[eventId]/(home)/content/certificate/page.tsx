"use client";
import { Button } from "@/components/ui/button";
import {
  useDeleteCertificate,
  useGetAttendeeCertificate,
  useGetCertificates,
  useSaveCertificate,
} from "@/hooks/services/certificate";
import { compareAsc, format, isPast } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetEvents } from "@/hooks/services/events";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TCertificate } from "@/types/certificates";

const Certificates = () => {
  const router = useRouter();

  const { eventId } = useParams();

  const { certificates, isLoading, getCertificates } = useGetCertificates({
    eventId,
  });

  const { saveCertificate, isLoading: certificateIsSaving } =
    useSaveCertificate();

  const {
    deleteCertificate,
    isLoading: deletingCertificate,
    error,
  } = useDeleteCertificate();

  console.log(certificates);

  const makeACopy = async (certificate: TCertificate, eventId: number) => {
    delete certificate.id;
    delete certificate.created_at;

    const payload: TCertificate = {
      ...certificate,
      eventId,
      certificateName: certificate.certificateName + " copy",
    };

    const newCertificate = await saveCertificate({ payload });

    if (newCertificate) {
      console.log(newCertificate);
      router.push(`certificate/create?certificateId=${newCertificate.id}`);
    }
  };

  const MakeACopy = ({
    certificateId,
  }: {
    certificateId: number | undefined;
  }) => {
    if (!certificateId) return;
    const { events, isLoading } = useGetEvents();
    const [eventId, setEventId] = useState<number>();
    const certificate = certificates?.find(({ id }) => certificateId === id);

    if (!certificate) return;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="w-full hover:bg-gray-100 text-gray-700 py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="p-2">Make a copy</span>
          </button>
        </DialogTrigger>
        <DialogContent className="px-2 pt-6 z-[100]">
          <DialogHeader className="px-3">
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            <div className="flex flex-col gap-4 items-center py-4">
              <svg
                width={65}
                height={64}
                viewBox="0 0 65 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_14187_4571)">
                  <path
                    d="M41.0333 61.8667H38.9C38.9 62.2629 39.0103 62.6512 39.2186 62.9882C39.4269 63.3252 39.7249 63.5976 40.0793 63.7748C40.4336 63.952 40.8303 64.027 41.2249 63.9914C41.6195 63.9558 41.9964 63.811 42.3133 63.5733L41.0333 61.8667ZM49.5667 55.4667L50.8467 53.76C50.4774 53.4831 50.0283 53.3333 49.5667 53.3333C49.1051 53.3333 48.6559 53.4831 48.2867 53.76L49.5667 55.4667ZM58.1 61.8667L56.82 63.5733C57.137 63.811 57.5138 63.9558 57.9084 63.9914C58.303 64.027 58.6997 63.952 59.0541 63.7748C59.4084 63.5976 59.7064 63.3252 59.9147 62.9882C60.123 62.6512 60.2333 62.2629 60.2333 61.8667H58.1ZM49.5667 46.9333C46.7377 46.9333 44.0246 45.8095 42.0242 43.8091C40.0238 41.8088 38.9 39.0956 38.9 36.2667H34.6333C34.6333 40.2272 36.2067 44.0256 39.0072 46.8261C41.8078 49.6267 45.6061 51.2 49.5667 51.2V46.9333ZM60.2333 36.2667C60.2333 39.0956 59.1095 41.8088 57.1091 43.8091C55.1088 45.8095 52.3956 46.9333 49.5667 46.9333V51.2C53.5272 51.2 57.3256 49.6267 60.1261 46.8261C62.9267 44.0256 64.5 40.2272 64.5 36.2667H60.2333ZM49.5667 25.6C52.3956 25.6 55.1088 26.7238 57.1091 28.7242C59.1095 30.7246 60.2333 33.4377 60.2333 36.2667H64.5C64.5 32.3061 62.9267 28.5078 60.1261 25.7072C57.3256 22.9067 53.5272 21.3333 49.5667 21.3333V25.6ZM49.5667 21.3333C45.6061 21.3333 41.8078 22.9067 39.0072 25.7072C36.2067 28.5078 34.6333 32.3061 34.6333 36.2667H38.9C38.9 33.4377 40.0238 30.7246 42.0242 28.7242C44.0246 26.7238 46.7377 25.6 49.5667 25.6V21.3333ZM38.9 44.8V61.8667H43.1667V44.8H38.9ZM42.3133 63.5733L50.8467 57.1733L48.2867 53.76L39.7533 60.16L42.3133 63.5733ZM48.2867 57.1733L56.82 63.5733L59.38 60.16L50.8467 53.76L48.2867 57.1733ZM60.2333 61.8667V44.8H55.9667V61.8667H60.2333ZM64.5 21.3333V6.4H60.2333V21.3333H64.5ZM58.1 0H6.9V4.26667H58.1V0ZM0.5 6.4V57.6H4.76667V6.4H0.5ZM6.9 64H34.6333V59.7333H6.9V64ZM0.5 57.6C0.5 59.2974 1.17428 60.9253 2.37452 62.1255C3.57475 63.3257 5.20261 64 6.9 64V59.7333C6.33421 59.7333 5.79158 59.5086 5.39151 59.1085C4.99143 58.7084 4.76667 58.1658 4.76667 57.6H0.5ZM6.9 0C5.20261 0 3.57475 0.674284 2.37452 1.87452C1.17428 3.07475 0.5 4.70261 0.5 6.4H4.76667C4.76667 5.83421 4.99143 5.29158 5.39151 4.89151C5.79158 4.49143 6.33421 4.26667 6.9 4.26667V0ZM64.5 6.4C64.5 4.70261 63.8257 3.07475 62.6255 1.87452C61.4253 0.674284 59.7974 0 58.1 0V4.26667C58.6658 4.26667 59.2084 4.49143 59.6085 4.89151C60.0086 5.29158 60.2333 5.83421 60.2333 6.4H64.5ZM13.3 21.3333H34.6333V17.0667H13.3V21.3333ZM13.3 34.1333H26.1V29.8667H13.3V34.1333Z"
                    fill="#001FCC"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_14187_4571">
                    <rect
                      width={64}
                      height={64}
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <span className="text-gray-800 font-medium">
                Select the event to which you want to add this certificate to
              </span>
            </div>
            <div className="relative">
              <label className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                Event Name
              </label>
              <Select
                onValueChange={(value) => setEventId(parseInt(value))}
                value={(eventId && eventId.toString()) || ""}
              >
                <SelectTrigger disabled={isLoading}>
                  <SelectValue
                    placeholder={!isLoading ? "Select event" : "Loading..."}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 w-full"
                  />
                </SelectTrigger>
                <SelectContent className="max-h-[250px] w-[500px] hide-scrollbar overflow-auto z-[10000]">
                  {events &&
                    events.map(({ id, eventTitle }) => (
                      <SelectItem
                        key={id}
                        value={id.toString()}
                        className="inline-flex gap-2"
                      >
                        {eventTitle}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <DialogClose asChild>
              <Button
                disabled={!eventId || isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  eventId && makeACopy(certificate, eventId);
                }}
                className="bg-basePrimary w-full"
              >
                Make a copy
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const Delete = ({ certificateId }: { certificateId: number | undefined }) => {
    if (!certificateId) return;
    const [certificateIsIssued, setCertificateIsIssued] = useState<boolean>();
    const { getAttendeeCertificate, isLoading } =
      useGetAttendeeCertificate(true);

    useEffect(() => {
      (async () => {
        const certificates = await getAttendeeCertificate({
          certificateGroupId: certificateId,
          isVerify: false,
        });
        console.log(certificates);
        setCertificateIsIssued(
          (!Array.isArray(certificates) && certificates) ||
            (Array.isArray(certificates) && certificates.length > 0)
            ? true
            : false
        );
      })();
    }, [certificateId]);

    const clsBtnRef = useRef<HTMLButtonElement>(null);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="w-full hover:bg-gray-100 text-red-700"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="p-2">Delete</span>
          </button>
        </DialogTrigger>
        <DialogContent className="px-4 py-6 z-[1000]">
          <DialogHeader className="px-3">
            <DialogTitle></DialogTitle>
          </DialogHeader>
          {/* <div className="space-y-4">
            <div className="flex flex-col gap-4 items-center py-4">
              <svg
                width={65}
                height={64}
                viewBox="0 0 65 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_14187_4571)">
                  <path
                    d="M41.0333 61.8667H38.9C38.9 62.2629 39.0103 62.6512 39.2186 62.9882C39.4269 63.3252 39.7249 63.5976 40.0793 63.7748C40.4336 63.952 40.8303 64.027 41.2249 63.9914C41.6195 63.9558 41.9964 63.811 42.3133 63.5733L41.0333 61.8667ZM49.5667 55.4667L50.8467 53.76C50.4774 53.4831 50.0283 53.3333 49.5667 53.3333C49.1051 53.3333 48.6559 53.4831 48.2867 53.76L49.5667 55.4667ZM58.1 61.8667L56.82 63.5733C57.137 63.811 57.5138 63.9558 57.9084 63.9914C58.303 64.027 58.6997 63.952 59.0541 63.7748C59.4084 63.5976 59.7064 63.3252 59.9147 62.9882C60.123 62.6512 60.2333 62.2629 60.2333 61.8667H58.1ZM49.5667 46.9333C46.7377 46.9333 44.0246 45.8095 42.0242 43.8091C40.0238 41.8088 38.9 39.0956 38.9 36.2667H34.6333C34.6333 40.2272 36.2067 44.0256 39.0072 46.8261C41.8078 49.6267 45.6061 51.2 49.5667 51.2V46.9333ZM60.2333 36.2667C60.2333 39.0956 59.1095 41.8088 57.1091 43.8091C55.1088 45.8095 52.3956 46.9333 49.5667 46.9333V51.2C53.5272 51.2 57.3256 49.6267 60.1261 46.8261C62.9267 44.0256 64.5 40.2272 64.5 36.2667H60.2333ZM49.5667 25.6C52.3956 25.6 55.1088 26.7238 57.1091 28.7242C59.1095 30.7246 60.2333 33.4377 60.2333 36.2667H64.5C64.5 32.3061 62.9267 28.5078 60.1261 25.7072C57.3256 22.9067 53.5272 21.3333 49.5667 21.3333V25.6ZM49.5667 21.3333C45.6061 21.3333 41.8078 22.9067 39.0072 25.7072C36.2067 28.5078 34.6333 32.3061 34.6333 36.2667H38.9C38.9 33.4377 40.0238 30.7246 42.0242 28.7242C44.0246 26.7238 46.7377 25.6 49.5667 25.6V21.3333ZM38.9 44.8V61.8667H43.1667V44.8H38.9ZM42.3133 63.5733L50.8467 57.1733L48.2867 53.76L39.7533 60.16L42.3133 63.5733ZM48.2867 57.1733L56.82 63.5733L59.38 60.16L50.8467 53.76L48.2867 57.1733ZM60.2333 61.8667V44.8H55.9667V61.8667H60.2333ZM64.5 21.3333V6.4H60.2333V21.3333H64.5ZM58.1 0H6.9V4.26667H58.1V0ZM0.5 6.4V57.6H4.76667V6.4H0.5ZM6.9 64H34.6333V59.7333H6.9V64ZM0.5 57.6C0.5 59.2974 1.17428 60.9253 2.37452 62.1255C3.57475 63.3257 5.20261 64 6.9 64V59.7333C6.33421 59.7333 5.79158 59.5086 5.39151 59.1085C4.99143 58.7084 4.76667 58.1658 4.76667 57.6H0.5ZM6.9 0C5.20261 0 3.57475 0.674284 2.37452 1.87452C1.17428 3.07475 0.5 4.70261 0.5 6.4H4.76667C4.76667 5.83421 4.99143 5.29158 5.39151 4.89151C5.79158 4.49143 6.33421 4.26667 6.9 4.26667V0ZM64.5 6.4C64.5 4.70261 63.8257 3.07475 62.6255 1.87452C61.4253 0.674284 59.7974 0 58.1 0V4.26667C58.6658 4.26667 59.2084 4.49143 59.6085 4.89151C60.0086 5.29158 60.2333 5.83421 60.2333 6.4H64.5ZM13.3 21.3333H34.6333V17.0667H13.3V21.3333ZM13.3 34.1333H26.1V29.8667H13.3V34.1333Z"
                    fill="#001FCC"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_14187_4571">
                    <rect
                      width={64}
                      height={64}
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <span className="text-gray-800 font-medium">
                Select the event to which you want to add this certificate to
              </span>
            </div>
            <div className="relative">
              <label className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                Event Name
              </label>
              <Select
                onValueChange={(value) => setEventId(parseInt(value))}
                value={(eventId && eventId.toString()) || ""}
              >
                <SelectTrigger disabled={isLoading}>
                  <SelectValue
                    placeholder={!isLoading ? "Select event" : "Loading..."}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 w-full"
                  />
                </SelectTrigger>
                <SelectContent className="max-h-[250px] w-[500px] hide-scrollbar overflow-auto">
                  {events &&
                    events.map(({ id, eventTitle }) => (
                      <SelectItem
                        key={id}
                        value={id.toString()}
                        className="inline-flex gap-2"
                      >
                        {eventTitle}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <DialogClose asChild>
              <Button
                disabled={!eventId || isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  eventId && makeACopy(certificate, eventId);
                }}
                className="bg-basePrimary w-full"
              >
                make a copy
              </Button>
            </DialogClose>
          </div> */}
          {isLoading ? (
            <div className="py-8 w-full flex items-center justify-center">
              <div className="animate-spin">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth={0}
                  viewBox="0 0 1024 1024"
                  height="4em"
                  width="4em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {certificateIsIssued ? (
                <>
                  <div className="flex flex-col gap-4 items-center py-4">
                    <svg
                      width={57}
                      height={50}
                      viewBox="0 0 57 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M55.6998 41.0225L33.8373 3.05501C33.2909 2.12482 32.511 1.35356 31.5748 0.817663C30.6385 0.281767 29.5785 -0.000152588 28.4998 -0.000152588C27.421 -0.000152588 26.361 0.281767 25.4247 0.817663C24.4885 1.35356 23.7086 2.12482 23.1623 3.05501L1.29975 41.0225C0.774092 41.9222 0.49707 42.9455 0.49707 43.9875C0.49707 45.0295 0.774092 46.0528 1.29975 46.9525C1.83908 47.8883 2.61768 48.6638 3.55566 49.1993C4.49363 49.7349 5.55721 50.0112 6.63725 50H50.3623C51.4414 50.0103 52.504 49.7336 53.441 49.1981C54.378 48.6626 55.1558 47.8876 55.6948 46.9525C56.2212 46.0532 56.4991 45.0302 56.4999 43.9882C56.5008 42.9462 56.2247 41.9227 55.6998 41.0225ZM52.2323 44.95C52.0417 45.2751 51.768 45.5437 51.4394 45.7282C51.1108 45.9127 50.7391 46.0065 50.3623 46H6.63725C6.26044 46.0065 5.88868 45.9127 5.56008 45.7282C5.23147 45.5437 4.95784 45.2751 4.76725 44.95C4.59461 44.6577 4.50355 44.3245 4.50355 43.985C4.50355 43.6455 4.59461 43.3123 4.76725 43.02L26.6298 5.05251C26.8242 4.72894 27.0991 4.4612 27.4276 4.27532C27.7562 4.08944 28.1273 3.99175 28.5048 3.99175C28.8822 3.99175 29.2533 4.08944 29.5819 4.27532C29.9104 4.4612 30.1853 4.72894 30.3798 5.05251L52.2423 43.02C52.4134 43.3132 52.5027 43.6469 52.501 43.9864C52.4992 44.3258 52.4064 44.6586 52.2323 44.95ZM26.4998 30V20C26.4998 19.4696 26.7105 18.9609 27.0855 18.5858C27.4606 18.2107 27.9693 18 28.4998 18C29.0302 18 29.5389 18.2107 29.914 18.5858C30.289 18.9609 30.4998 19.4696 30.4998 20V30C30.4998 30.5304 30.289 31.0392 29.914 31.4142C29.5389 31.7893 29.0302 32 28.4998 32C27.9693 32 27.4606 31.7893 27.0855 31.4142C26.7105 31.0392 26.4998 30.5304 26.4998 30ZM31.4998 39C31.4998 39.5934 31.3238 40.1734 30.9942 40.6667C30.6645 41.1601 30.196 41.5446 29.6478 41.7716C29.0996 41.9987 28.4964 42.0581 27.9145 41.9424C27.3325 41.8266 26.798 41.5409 26.3784 41.1213C25.9589 40.7018 25.6732 40.1672 25.5574 39.5853C25.4416 39.0033 25.5011 38.4001 25.7281 37.852C25.9552 37.3038 26.3397 36.8352 26.833 36.5056C27.3264 36.176 27.9064 36 28.4998 36C29.2954 36 30.0585 36.3161 30.6211 36.8787C31.1837 37.4413 31.4998 38.2044 31.4998 39Z"
                        fill="#001FCC"
                      />
                    </svg>
                    <div className="text-gray-800 font-medium flex flex-col gap-2 text-center">
                      <span>You can not delete an issued certificate</span>
                      <span>
                        Contact Zikoro admin for support on how to handle this
                        issue
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      disabled={isLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        clsBtnRef.current?.click();
                      }}
                      className="border-2 bg-white border-basePrimary text-basePrimary w-full flex justify-center items-center gap-4"
                    >
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth={0}
                        viewBox="0 0 24 24"
                        height="1.5em"
                        width="1.5em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Email</span>
                    </Button>
                    <Button
                      disabled={isLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        clsBtnRef.current?.click();
                      }}
                      className="border-2 bg-white border-basePrimary text-basePrimary w-full flex justify-center items-center gap-4"
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 448 512"
                        height="1.5em"
                        width="1.5em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                      </svg>

                      <span>Whatsapp</span>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-4 items-center py-4">
                    <svg
                      width={57}
                      height={50}
                      viewBox="0 0 57 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M55.6998 41.0225L33.8373 3.05501C33.2909 2.12482 32.511 1.35356 31.5748 0.817663C30.6385 0.281767 29.5785 -0.000152588 28.4998 -0.000152588C27.421 -0.000152588 26.361 0.281767 25.4247 0.817663C24.4885 1.35356 23.7086 2.12482 23.1623 3.05501L1.29975 41.0225C0.774092 41.9222 0.49707 42.9455 0.49707 43.9875C0.49707 45.0295 0.774092 46.0528 1.29975 46.9525C1.83908 47.8883 2.61768 48.6638 3.55566 49.1993C4.49363 49.7349 5.55721 50.0112 6.63725 50H50.3623C51.4414 50.0103 52.504 49.7336 53.441 49.1981C54.378 48.6626 55.1558 47.8876 55.6948 46.9525C56.2212 46.0532 56.4991 45.0302 56.4999 43.9882C56.5008 42.9462 56.2247 41.9227 55.6998 41.0225ZM52.2323 44.95C52.0417 45.2751 51.768 45.5437 51.4394 45.7282C51.1108 45.9127 50.7391 46.0065 50.3623 46H6.63725C6.26044 46.0065 5.88868 45.9127 5.56008 45.7282C5.23147 45.5437 4.95784 45.2751 4.76725 44.95C4.59461 44.6577 4.50355 44.3245 4.50355 43.985C4.50355 43.6455 4.59461 43.3123 4.76725 43.02L26.6298 5.05251C26.8242 4.72894 27.0991 4.4612 27.4276 4.27532C27.7562 4.08944 28.1273 3.99175 28.5048 3.99175C28.8822 3.99175 29.2533 4.08944 29.5819 4.27532C29.9104 4.4612 30.1853 4.72894 30.3798 5.05251L52.2423 43.02C52.4134 43.3132 52.5027 43.6469 52.501 43.9864C52.4992 44.3258 52.4064 44.6586 52.2323 44.95ZM26.4998 30V20C26.4998 19.4696 26.7105 18.9609 27.0855 18.5858C27.4606 18.2107 27.9693 18 28.4998 18C29.0302 18 29.5389 18.2107 29.914 18.5858C30.289 18.9609 30.4998 19.4696 30.4998 20V30C30.4998 30.5304 30.289 31.0392 29.914 31.4142C29.5389 31.7893 29.0302 32 28.4998 32C27.9693 32 27.4606 31.7893 27.0855 31.4142C26.7105 31.0392 26.4998 30.5304 26.4998 30ZM31.4998 39C31.4998 39.5934 31.3238 40.1734 30.9942 40.6667C30.6645 41.1601 30.196 41.5446 29.6478 41.7716C29.0996 41.9987 28.4964 42.0581 27.9145 41.9424C27.3325 41.8266 26.798 41.5409 26.3784 41.1213C25.9589 40.7018 25.6732 40.1672 25.5574 39.5853C25.4416 39.0033 25.5011 38.4001 25.7281 37.852C25.9552 37.3038 26.3397 36.8352 26.833 36.5056C27.3264 36.176 27.9064 36 28.4998 36C29.2954 36 30.0585 36.3161 30.6211 36.8787C31.1837 37.4413 31.4998 38.2044 31.4998 39Z"
                        fill="#001FCC"
                      />
                    </svg>
                    <div className="text-gray-800 font-medium flex flex-col gap-2 text-center">
                      <span>
                        Are you sure you want to delete this certificate?
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      disabled={isLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        clsBtnRef.current?.click();
                      }}
                      className="border-2 bg-white border-basePrimary text-basePrimary w-full"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={isLoading}
                      onClick={async (e) => {
                        e.stopPropagation();
                        clsBtnRef.current?.click();
                        await deleteCertificate({ certificateId });
                        await getCertificates();
                      }}
                      className="bg-basePrimary w-full"
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogClose asChild>
            <button className="hidden" ref={clsBtnRef}>
              close
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
  };

  const CreateButton = ({ alignSelf = "flex-end" }: { alignSelf?: string }) => {
    const { events, isLoading } = useGetEvents();
    const [eventId, setEventId] = useState<number>();

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            style={{ alignSelf }}
            className="bg-basePrimary flex gap-4 items-center w-fit py-2"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 1024 1024"
              height="1.5em"
              width="1.5em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
            </svg>
            <span>Certificate</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="px-2 pt-6 z-[100]">
          <DialogHeader className="px-3">
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            <div className="flex flex-col gap-4 items-center py-4">
              <svg
                width={65}
                height={64}
                viewBox="0 0 65 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_14187_4571)">
                  <path
                    d="M41.0333 61.8667H38.9C38.9 62.2629 39.0103 62.6512 39.2186 62.9882C39.4269 63.3252 39.7249 63.5976 40.0793 63.7748C40.4336 63.952 40.8303 64.027 41.2249 63.9914C41.6195 63.9558 41.9964 63.811 42.3133 63.5733L41.0333 61.8667ZM49.5667 55.4667L50.8467 53.76C50.4774 53.4831 50.0283 53.3333 49.5667 53.3333C49.1051 53.3333 48.6559 53.4831 48.2867 53.76L49.5667 55.4667ZM58.1 61.8667L56.82 63.5733C57.137 63.811 57.5138 63.9558 57.9084 63.9914C58.303 64.027 58.6997 63.952 59.0541 63.7748C59.4084 63.5976 59.7064 63.3252 59.9147 62.9882C60.123 62.6512 60.2333 62.2629 60.2333 61.8667H58.1ZM49.5667 46.9333C46.7377 46.9333 44.0246 45.8095 42.0242 43.8091C40.0238 41.8088 38.9 39.0956 38.9 36.2667H34.6333C34.6333 40.2272 36.2067 44.0256 39.0072 46.8261C41.8078 49.6267 45.6061 51.2 49.5667 51.2V46.9333ZM60.2333 36.2667C60.2333 39.0956 59.1095 41.8088 57.1091 43.8091C55.1088 45.8095 52.3956 46.9333 49.5667 46.9333V51.2C53.5272 51.2 57.3256 49.6267 60.1261 46.8261C62.9267 44.0256 64.5 40.2272 64.5 36.2667H60.2333ZM49.5667 25.6C52.3956 25.6 55.1088 26.7238 57.1091 28.7242C59.1095 30.7246 60.2333 33.4377 60.2333 36.2667H64.5C64.5 32.3061 62.9267 28.5078 60.1261 25.7072C57.3256 22.9067 53.5272 21.3333 49.5667 21.3333V25.6ZM49.5667 21.3333C45.6061 21.3333 41.8078 22.9067 39.0072 25.7072C36.2067 28.5078 34.6333 32.3061 34.6333 36.2667H38.9C38.9 33.4377 40.0238 30.7246 42.0242 28.7242C44.0246 26.7238 46.7377 25.6 49.5667 25.6V21.3333ZM38.9 44.8V61.8667H43.1667V44.8H38.9ZM42.3133 63.5733L50.8467 57.1733L48.2867 53.76L39.7533 60.16L42.3133 63.5733ZM48.2867 57.1733L56.82 63.5733L59.38 60.16L50.8467 53.76L48.2867 57.1733ZM60.2333 61.8667V44.8H55.9667V61.8667H60.2333ZM64.5 21.3333V6.4H60.2333V21.3333H64.5ZM58.1 0H6.9V4.26667H58.1V0ZM0.5 6.4V57.6H4.76667V6.4H0.5ZM6.9 64H34.6333V59.7333H6.9V64ZM0.5 57.6C0.5 59.2974 1.17428 60.9253 2.37452 62.1255C3.57475 63.3257 5.20261 64 6.9 64V59.7333C6.33421 59.7333 5.79158 59.5086 5.39151 59.1085C4.99143 58.7084 4.76667 58.1658 4.76667 57.6H0.5ZM6.9 0C5.20261 0 3.57475 0.674284 2.37452 1.87452C1.17428 3.07475 0.5 4.70261 0.5 6.4H4.76667C4.76667 5.83421 4.99143 5.29158 5.39151 4.89151C5.79158 4.49143 6.33421 4.26667 6.9 4.26667V0ZM64.5 6.4C64.5 4.70261 63.8257 3.07475 62.6255 1.87452C61.4253 0.674284 59.7974 0 58.1 0V4.26667C58.6658 4.26667 59.2084 4.49143 59.6085 4.89151C60.0086 5.29158 60.2333 5.83421 60.2333 6.4H64.5ZM13.3 21.3333H34.6333V17.0667H13.3V21.3333ZM13.3 34.1333H26.1V29.8667H13.3V34.1333Z"
                    fill="#001FCC"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_14187_4571">
                    <rect
                      width={64}
                      height={64}
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <span className="text-gray-800 font-medium">
                Select the event to which you want to add this certificate to
              </span>
            </div>
            <div className="relative">
              <label className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
                Event Name
              </label>
              <Select
                onValueChange={(value) => setEventId(parseInt(value))}
                value={(eventId && eventId.toString()) || ""}
              >
                <SelectTrigger disabled={isLoading}>
                  <SelectValue
                    placeholder={!isLoading ? "Select event" : "Loading..."}
                    className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 w-full"
                  />
                </SelectTrigger>
                <SelectContent className="max-h-[250px] w-[500px] hide-scrollbar overflow-auto z-[10000]">
                  {events &&
                    events.map(({ id, eventTitle }) => (
                      <SelectItem
                        key={id}
                        value={id.toString()}
                        className="inline-flex gap-2"
                      >
                        {eventTitle}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <DialogClose asChild>
              <Button
                disabled={!eventId || isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  eventId &&
                    router.push(`certificate/create?eventId=${eventId}`);
                }}
                className="bg-basePrimary w-full"
              >
                Create certificate for this event
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if ((certificates && certificates.length === 0) || isLoading)
    return (
      <div className="flex flex-col h-96 w-full items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={65}
          height={64}
          viewBox="0 0 65 64"
          fill="none"
        >
          <g
            style={{ mixBlendMode: "luminosity" }}
            clipPath="url(#clip0_12419_23693)"
          >
            <path
              d="M56.7207 28.9544L52.1855 32.0882L47.9229 28.1379L45.9069 23.0179L50.4421 19.873L54.6308 23.7241L56.7207 28.9544Z"
              fill="#BDC3C7"
            />
            <path
              d="M42.431 44.6898V59.0346C42.4274 60.2519 41.4415 61.2379 40.2241 61.2415H2.7069C1.48957 61.2379 0.503636 60.2519 0.5 59.0346V18.207H42.431V44.6898Z"
              fill="#F5EFCA"
            />
            <path
              d="M26.9827 55.7245H7.12066C6.51124 55.7245 6.01721 55.2304 6.01721 54.621C6.01721 54.0116 6.51124 53.5176 7.12066 53.5176H26.9827C27.5921 53.5176 28.0862 54.0116 28.0862 54.621C28.0862 55.2304 27.5921 55.7245 26.9827 55.7245Z"
              fill="#CBB292"
            />
            <path
              d="M63.0766 24.5628L56.7207 28.9545L50.4421 19.8731L56.7979 15.4814C58.3005 14.4441 60.3593 14.8193 61.3993 16.32L63.9152 19.9503C64.9535 21.4564 64.5786 23.5186 63.0766 24.5628Z"
              fill="#FF5364"
            />
            <path
              d="M23.5069 48.8277L18.2545 50.0967C17.813 50.2007 17.3528 50.0239 17.0945 49.651C16.8362 49.2782 16.8323 48.7852 17.0848 48.4084L20.1303 43.9395L23.5069 48.8277Z"
              fill="#464F5D"
            />
            <path
              d="M52.1855 32.0884C28.9292 48.1745 30.5039 47.103 30.3924 47.1394L24.1359 38.0912C24.265 37.9621 23.0324 38.8283 45.9069 23.0181L52.1855 32.0884Z"
              fill="#3B97D3"
            />
            <path
              d="M30.3924 47.1396C30.1795 47.2499 29.62 47.3481 23.5069 48.8279L20.1304 43.9396C24.2264 37.9181 24.0101 38.2171 24.1359 38.0913L30.3924 47.1396Z"
              fill="#FDD7AD"
            />
            <path
              d="M32.3345 28.138H7.12066C6.51124 28.138 6.01721 27.644 6.01721 27.0346C6.01721 26.4252 6.51124 25.9312 7.12066 25.9312H32.3345C32.9439 25.9312 33.4379 26.4252 33.4379 27.0346C33.4379 27.644 32.9439 28.138 32.3345 28.138Z"
              fill="#CBB292"
            />
            <path
              d="M24.3565 33.6551H7.12066C6.51124 33.6551 6.01721 33.1611 6.01721 32.5517C6.01721 31.9423 6.51124 31.4482 7.12066 31.4482H24.3565C24.9659 31.4482 25.46 31.9423 25.46 32.5517C25.46 33.1611 24.9659 33.6551 24.3565 33.6551Z"
              fill="#CBB292"
            />
            <path
              d="M18.7841 39.1727H7.12066C6.51124 39.1727 6.01721 38.6787 6.01721 38.0693C6.01721 37.4599 6.51124 36.9658 7.12066 36.9658H18.7841C19.3935 36.9658 19.8876 37.4599 19.8876 38.0693C19.8876 38.6787 19.3935 39.1727 18.7841 39.1727Z"
              fill="#CBB292"
            />
            <path
              d="M15.0213 44.6898H7.12066C6.51124 44.6898 6.01721 44.1958 6.01721 43.5864C6.01721 42.9769 6.51124 42.4829 7.12066 42.4829H15.0213C15.6308 42.4829 16.1248 42.9769 16.1248 43.5864C16.1248 44.1958 15.6308 44.6898 15.0213 44.6898Z"
              fill="#CBB292"
            />
            <path
              d="M12.4613 50.2069H7.12066C6.51124 50.2069 6.01721 49.7129 6.01721 49.1034C6.01721 48.494 6.51124 48 7.12066 48H12.4613C13.0708 48 13.5648 48.494 13.5648 49.1034C13.5648 49.7129 13.0708 50.2069 12.4613 50.2069Z"
              fill="#CBB292"
            />
            <path
              d="M38.0172 9.37939C40.4549 9.37939 42.431 11.3555 42.431 13.7932V20.4139H0.5V13.7932C0.5 11.3555 2.47612 9.37939 4.91379 9.37939H38.0172Z"
              fill="#FF5364"
            />
            <path
              d="M36.9138 56.8278H33.6034C32.994 56.8278 32.5 56.3338 32.5 55.7243C32.5 55.1149 32.994 54.6209 33.6034 54.6209H35.8103V52.414C35.8103 51.8046 36.3044 51.3105 36.9138 51.3105C37.5232 51.3105 38.0172 51.8046 38.0172 52.414V55.7243C38.0172 56.3338 37.5232 56.8278 36.9138 56.8278Z"
              fill="#CBB292"
            />
            <path
              d="M38.0172 9.37948C38.0172 13.0871 36.0752 16.0002 33.6034 16.0002C32.994 16.0002 32.5 15.5061 32.5 14.8967C32.5 14.2873 32.994 13.7933 33.6034 13.7933C34.6407 13.7933 35.8103 11.9064 35.8103 9.37948C35.8103 6.85258 34.6407 4.96569 33.6034 4.96569C32.5662 4.96569 31.3965 6.85258 31.3965 9.37948H29.1896C29.1896 5.67189 31.1317 2.75879 33.6034 2.75879C36.0752 2.75879 38.0172 5.67189 38.0172 9.37948Z"
              fill="#BDC3C7"
            />
            <path
              d="M25.8793 9.37948C25.8793 13.0871 23.9372 16.0002 21.4655 16.0002C20.8561 16.0002 20.362 15.5061 20.362 14.8967C20.362 14.2873 20.8561 13.7933 21.4655 13.7933C22.5027 13.7933 23.6724 11.9064 23.6724 9.37948C23.6724 6.85258 22.5027 4.96569 21.4655 4.96569C20.4282 4.96569 19.2586 6.85258 19.2586 9.37948H17.0517C17.0517 5.67189 18.9938 2.75879 21.4655 2.75879C23.9372 2.75879 25.8793 5.67189 25.8793 9.37948Z"
              fill="#BDC3C7"
            />
            <path
              d="M13.7414 9.37948C13.7414 13.0871 11.7993 16.0002 9.32761 16.0002C8.71819 16.0002 8.22416 15.5061 8.22416 14.8967C8.22416 14.2873 8.71819 13.7933 9.32761 13.7933C10.3649 13.7933 11.5345 11.9064 11.5345 9.37948C11.5345 6.85258 10.3649 4.96569 9.32761 4.96569C8.29037 4.96569 7.12071 6.85258 7.12071 9.37948H4.91382C4.91382 5.67189 6.85589 2.75879 9.32761 2.75879C11.7993 2.75879 13.7414 5.67189 13.7414 9.37948Z"
              fill="#BDC3C7"
            />
          </g>
          <defs>
            <clipPath id="clip0_12419_23693">
              <rect
                width={64}
                height={64}
                fill="white"
                transform="translate(0.5)"
              />
            </clipPath>
          </defs>
        </svg>

        <p className="text-sm px-2 font-medium text-gray-700 text-center w-1/2">
          There are no created certificates.
        </p>

        <Button
          onClick={(e) => {
            e.stopPropagation();

            router.push(`certificate/create`);
          }}
          className="bg-basePrimary flex gap-4 items-center w-fit py-2"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={0}
            viewBox="0 0 1024 1024"
            height="1.5em"
            width="1.5em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
          </svg>
          <span>Certificate</span>
        </Button>
      </div>
    );

  return (
    <div className="flex flex-col gap-2 px-2 py-4">
      <Button
        onClick={(e) => {
          e.stopPropagation();

          router.push(`certificate/create`);
        }}
        className="bg-basePrimary flex gap-4 items-center w-fit py-2 self-end"
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth={0}
          viewBox="0 0 1024 1024"
          height="1.5em"
          width="1.5em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
        </svg>
        <span>Certificate</span>
      </Button>
      <div className="grid-cols-4 grid gap-4">
        {certificates?.map(
          ({
            cerificateUrl,
            certificateName,
            created_at,
            id,
            eventId,
            certificateSettings,
            lastEdited,
          }) => (
            <div className="relative h-full">
              {certificateSettings?.publishOn &&
                isPast(certificateSettings?.publishOn) && (
                  <div className="absolute top-2 left-2 z-[2] bg-green-200 border-2 border-green-500 text-xs text-green-500 font-medium p-1 rounded">
                    Published
                  </div>
                )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="bg-black/10 p-2 absolute top-2 right-2 z-[2]"
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 16 16"
                      height="1.5em"
                      width="1.5em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <ul>
                    <li className="w-full">
                      <MakeACopy certificateId={id} />
                    </li>
                    <li className="text-center p-2 hover:bg-gray-100 text-red-700">
                      <Delete certificateId={id} />
                    </li>
                  </ul>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                disabled={
                  certificateIsSaving ||
                  (certificateSettings?.publishOn &&
                    isPast(certificateSettings?.publishOn))
                }
                className={`border rounded-md relative w-full h-full overflow-hidden ${
                  certificateSettings?.publishOn &&
                  isPast(certificateSettings?.publishOn)
                    ? "border-green-500"
                    : "border-gray-200"
                }`}
                onClick={() =>
                  router.push(`certificate/create?certificateId=${id}`)
                }
              >
                <div className="w-full h-[250px] overflow-hidden">
                  <img className="object-fill" src={cerificateUrl || ""} />
                </div>
                <div className="space-y-1 px-4 py-2 border-t border-gray-200">
                  <h2 className="text-gray-800 font-bold text-left">
                    {certificateName}
                  </h2>
                  <div className="flex gap-2 items-center text-sm text-gray-600 font-medium">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 16 16"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.995-.944v-.002.002zM7.022 13h7.956a.274.274 0 00.014-.002l.008-.002c-.002-.264-.167-1.03-.76-1.72C13.688 10.629 12.718 10 11 10c-1.717 0-2.687.63-3.24 1.276-.593.69-.759 1.457-.76 1.72a1.05 1.05 0 00.022.004zm7.973.056v-.002.002zM11 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0zM6.936 9.28a5.88 5.88 0 00-1.23-.247A7.35 7.35 0 005 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 015 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10c-1.668.02-2.615.64-3.16 1.276C1.163 11.97 1 12.739 1 13h3c0-1.045.323-2.086.92-3zM1.5 5.5a3 3 0 116 0 3 3 0 01-6 0zm3-2a2 2 0 100 4 2 2 0 000-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Event Attendees</span>
                  </div>
                  <div className="flex">
                    <span className="text-tiny font-medium text-gray-500">
                      {lastEdited && format(lastEdited, "dd MMMM, yyyy")}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Certificates;
