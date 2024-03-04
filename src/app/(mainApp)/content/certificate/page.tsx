"use client";
import { Button } from "@/components/ui/button";
import {
  useGetCertificates,
  useSaveCertificate,
} from "@/hooks/services/certificate";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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

  const { certificates, isLoading } = useGetCertificates();

  const { saveCertificate, isLoading: certificateIsSaving } =
    useSaveCertificate();

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
          className="bg-basePrimary flex gap-4 items-center"
          onClick={() => router.push("/content/certificate/create")}
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
      router.push(
        `/content/certificate/create?certificateId=${newCertificate.id}`
      );
    }
  };

  const MakeACopy = ({ certificateId }: { certificateId: number }) => {
    const { events, isLoading } = useGetEvents();
    const [eventId, setEventId] = useState<number>();
    const certificate = certificates?.find(({ id }) => certificateId === id);

    if (!certificate) return;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="w-full hover:bg-gray-100 text-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="p-2">Make a copy</span>
          </button>
        </DialogTrigger>
        <DialogContent className="px-2 pt-4 pb-2">
          <DialogHeader className="px-3">
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                value={eventId && eventId.toString()}
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
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex flex-col gap-2 px-2 py-4">
      <Button
        className="bg-basePrimary flex gap-4 items-center self-end w-fit"
        onClick={() => router.push("/content/certificate/create")}
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
          ({ cerificateUrl, certificateName, created_at, id, eventId }) => (
            <button
              disabled={certificateIsSaving}
              className="border border-gray-200 rounded-md relative"
              onClick={() =>
                router.push(`/content/certificate/create?certificateId=${id}`)
              }
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="bg-black/10 p-2 absolute top-2 right-2"
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
                    <li className="p-2 hover:bg-gray-100 text-red-700">
                      Delete
                    </li>
                  </ul>
                </DropdownMenuContent>
              </DropdownMenu>
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
                    {created_at &&
                      format(new Date(created_at), "dd MMMM, yyyy")}
                  </span>
                </div>
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Certificates;
