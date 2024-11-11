// @ts-nocheck
"use client";
import RewardCard from "@/components/RewardCard";
import PointsCard from "@/components/PointsCard";
import { TAttendee } from "@/types/attendee";
import { useGetAttendeeEventTransactions } from "@/hooks/services/billing";
import { formatDate, isWithinTimeRange } from "@/utils/date";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCookie, useFetchPartners } from "@/hooks";
import { Event, TExPartner, TUser } from "@/types";
import { PartnerCard } from "@/components/partners/sponsors/_components";
import { TExPartner } from "@/types";
import { calculateAndSetMaxHeight } from "@/utils/helpers";
import useUserStore from "@/store/globalUserStore";
import { Progress } from "@/components/ui/progress";
import { useGetData } from "@/hooks/services/request";
import { EngagementsSettings } from "@/types/engagements";
import { useRouter } from "next/navigation";
import { ContactRequest } from "@/types/contacts";
import {
  useGetContactRequests,
  useRespondToContactRequest,
} from "@/hooks/services/contacts";
import { TUser } from "@/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { CheckIcon } from "lucide-react";
import { Cancel } from "styled-icons/typicons";

const UserContacts = ({
  user,
  engagementsSettings,
  engagementsSettingsIsLoading,
  eventAlias,
}: {
  user: TUser;
  engagementsSettingsIsLoading: boolean;
  engagementsSettings: EngagementsSettings;
  eventAlias: string;
}) => {
  const {
    userContactRequests,
    isLoading: contactRequestIsLoading,
    getContactRequests,
  } = useGetContactRequests({ userEmail: user.userEmail, eventAlias });

  console.log(
    user.userEmail,
    userContactRequests,
    engagementsSettings,
    "contact user"
  );

  const [action, setAction] = useState<"accept" | "reject" | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const clsBtnRef = useRef<HTMLButtonElement>(null);

  const { respondToContactRequest, isLoading } = useRespondToContactRequest();

  const onSubmit = async (
    userEmail: string,
    contactUserEmail: string,
    contactRequestId: number
  ) => {
    if (!action) return;

    await respondToContactRequest({
      payload: {
        body: { contactUserEmail, userEmail, contactRequestId },
        action,
      },
    });

    await getContactRequests();
  };

  return (
    <div>
      <h2 className="text-lg font-medium border-b p-4">Contact Request</h2>
      {contactRequestIsLoading && engagementsSettingsIsLoading ? (
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      ) : (
        <div className="">
          {userContactRequests
            ?.filter(
              ({ receiverUserEmail, status }) =>
                receiverUserEmail === user.userEmail && status === "pending"
            )
            ?.map((request) => (
              <div className="w-full grid grid-cols-10 items-center gap-1.5 px-1.5 py-4 border-b border-gray-100">
                <div className="col-span-2">
                  <Avatar className="size-12">
                    <AvatarImage
                      className="h-full w-full object-cover"
                      src={request.sender.profilePicture ?? ""}
                    />
                    <AvatarFallback>
                      <span className="uppercase text-sm">
                        {request.sender.firstName[0] +
                          request.sender.lastName[0]}
                      </span>
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 font-semibold text-sm capitalize">
                      {request.sender.firstName} {request.sender.lastName}
                    </p>
                  </div>
                  <span className="text-tiny font-medium text-gray-700 truncate w-full text-left">
                    {`${
                      request.sender.jobTitle
                        ? request.sender.jobTitle + ", "
                        : ""
                    }${request.sender.organization || ""}`}
                  </span>
                </div>
                <div className="col-span-2 flex gap-2">
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      setOpen(true);
                      setAction("reject");
                    }}
                    className="p-0 text-red-500"
                  >
                    <Cancel className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      setOpen(true);
                      setAction("accept");
                    }}
                    className="p-0 text-green-500"
                  >
                    <CheckIcon className="w-5 h-5" />
                  </Button>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                      {" "}
                      <DialogHeader>
                        <DialogTitle>
                          <span className="capitalize">
                            {action} Contact Information of{" "}
                            {request.sender.firstName +
                              " " +
                              request.sender.lastName}
                          </span>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
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
                              Are you sure you want to {action} the contact
                              request of{" "}
                              {request.sender.firstName +
                                " " +
                                request.sender.lastName}{" "}
                              {action === "accept" &&
                                "(their contact information would be shared with you as well)"}
                              ?
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              clsBtnRef.current?.click();
                            }}
                            className="border-2 bg-white border-basePrimary text-basePrimary w-full"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={async (e) => {
                              e.stopPropagation();
                              clsBtnRef.current?.click();
                              await onSubmit(
                                request.receiverUserEmail,
                                request.senderUserEmail,
                                request.id
                              );
                            }}
                            className="bg-basePrimary w-full"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                      <DialogClose asChild>
                        <button className="hidden" ref={clsBtnRef}>
                          close
                        </button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

interface RewardData {
  imgSrc: string;
  text: string;
  points?: number;
  heading?: string;
  id: number;
}

export default function ThirdSection({
  attendee,
  event,
  sponsors,
  loading,
  userContactRequests,
  contactRequestIsLoading,
  getContactRequests,
}: {
  attendee: TAttendee;
  event: Event;
  sponsors: TExPartner;
  loading: boolean;
  userContactRequests: ContactRequest[];
  contactRequestIsLoading: boolean;
  getContactRequests: () => Promise<void>;
}) {
  const router = useRouter();
  const { eventRegistrationRef, id } = attendee;
  const { user, setUser } = useUserStore();
  const { attendeeEventTransactions, isLoading, getAttendeeEventTransactions } =
    useGetAttendeeEventTransactions({
      userId: user ? user.id : 0,
      eventRegistrationRef,
    });

  const {
    data: engagementsSettings,
    isLoading: engagementsSettingsIsLoading,
    getData: getEngagementsSettings,
  } = useGetData<EngagementsSettings>(
    `engagements/${event.eventAlias}/settings222`
  );

  const totalMaxPoints = engagementsSettings?.pointsAllocation
    ? Object.values(engagementsSettings?.pointsAllocation).reduce(
        (acc, { maxPoints }) => acc + (maxPoints ?? 0),
        0
      )
    : 0;

  const totalAttendeePoints =
    (attendee.attendeeProfilePoints ?? 0) + (attendee.checkInPoints ?? 0);

  const pointsPercentage = (totalAttendeePoints / totalMaxPoints) * 100;

  const data1: RewardData[] = [
    { id: 1, points: 1000, imgSrc: "/images/unknown 1.png", text: "Questions" },
    {
      id: 2,
      points: 2000,
      imgSrc: "/images/stamp (1) 1.png",
      text: "Stamp IT",
    },
    {
      id: 3,
      points: 3000,
      imgSrc: "/images/vote 1.png",
      text: "Polls & Arrays",
    },
    {
      id: 4,
      points: 4000,
      imgSrc: "/images/cast 1.png",
      text: "Social Engagements",
    },
    {
      id: 5,
      points: 3000,
      imgSrc: "/images/network 1.png",
      text: "Networking",
    },
    {
      id: 6,
      points: 6000,
      imgSrc: "/images/profile 1.png",
      text: "Update profile",
    },
  ];

  const data2: RewardData[] = [
    {
      id: 1,
      imgSrc: "/images/unknown 1.png",
      text: "Earn points by asking questions. You'll receive more points when your questions are upvoted.",
      heading: "Ask, Vote or Answer Questions.",
    },
    {
      id: 2,
      imgSrc: "/images/stamp (1) 1.png",
      text: "Visit and interact with exhibitors and allow them to scan your badge. You earn more points when you visit more exhibitors.",
      heading: "Stamp IT",
    },
    {
      id: 3,
      imgSrc: "/images/vote 1.png",
      text: "Participate in polls and surveys to get extra points.",
      heading: "Polls and Surveys",
    },
    {
      id: 4,

      imgSrc: "/images/cast 1.png",
      text: "Earn more points by uploading pictures, liking, or commenting on the event news feed.",
      heading: "Social Engagement",
    },
    {
      id: 5,
      imgSrc: "/images/network 1.png",
      text: "Add contacts from the app, exchange messages, or schedule meetings with event attendees and earn extra points.",
      heading: "Networking",
    },
    {
      id: 6,
      imgSrc: "/images/profile 1.png",
      text: "Completing your profile and adding a bio will earn you extra points. Please make sure to fill in all the required details accurately.",
      heading: "Update profile",
    },
  ];

  const mapp = data1.map((elem) => (
    <RewardCard
      key={elem.id}
      text={elem.text}
      points={elem.points}
      imgSrc={elem.imgSrc}
    />
  ));

  const mapped = data2.map((elem) => (
    <PointsCard
      key={elem.id}
      text={elem.text}
      imgSrc={elem.imgSrc}
      heading={elem.heading}
    />
  ));

  const DisplayDate = ({ date }: { date: string }) => {
    const { day, month, year } = formatDate(date);

    return <span>{day + " " + month + " " + year}</span>;
  };

  useEffect(() => {
    getAttendeeEventTransactions();
  }, [attendee]);

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    calculateAndSetMaxHeight(divRef);
  }, [sponsors]);

  const isEventOwner = user && String(event?.createdBy) === String(user.id);
  const attendeeIsUser = user.userEmail === attendee.email;

  return (
    <div className="overflow-auto no-scrollbar" ref={divRef}>
      {attendeeIsUser && userContactRequests.length > 0 && (
        <UserContacts
          engagementsSettings={engagementsSettings}
          engagementsSettingsIsLoading={engagementsSettingsIsLoading}
          user={user}
          eventAlias={event.eventAlias}
        />
      )}
      {(isEventOwner || attendeeIsUser) && (
        <div className="overflow-auto no-scrollbar pb-48">
          <div className="mb-6 mt-2 space-y-4">
            <h4 className="text-xl text-greyBlack font-medium border-b-[1px] border-gray-200 pb-2 px-2">
              Payment
            </h4>
            {!attendeeEventTransactions || isLoading ? (
              <div className="flex flex-col w-full items-center justify-center h-48 gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height={16}
                  width={20}
                  viewBox="0 0 640 512"
                >
                  <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                </svg>

                <p className="text-xs px-2 font-medium text-gray-700 text-center">
                  Nothing to show, this attendee was added by an admin.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col w-full gap-2 px-2">
                  <div className="mb-2">
                    <h2 className="text-tiny text-gray-600">Amount</h2>
                    <h3 className="text-lg text-gray-900 font-semibold">
                      ₦
                      {new Intl.NumberFormat().format(
                        attendeeEventTransactions.amountPaid /
                          attendeeEventTransactions.attendees
                      )}
                    </h3>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 font-medium">
                    <span>Registered by</span>
                    <span>{attendeeEventTransactions.userEmail}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 font-medium">
                    <span>Registration date</span>
                    <DisplayDate date={attendeeEventTransactions.created_at} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 font-medium items-center">
                    <span>Status</span>
                    <div
                      className={`max-w-full truncate py-1 px-2 border ${
                        attendeeEventTransactions.registrationCompleted
                          ? "bg-green-100 text-green-600 border-green-600"
                          : "bg-red-100 text-red-600 border-red-600"
                      } rounded-md w-fit text-tiny`}
                    >
                      {attendeeEventTransactions.registrationCompleted
                        ? "Completed"
                        : "Awaiting Payment"}
                    </div>
                  </div>
                  {attendeeEventTransactions.registrationCompleted ? (
                    <div className="flex justify-between text-xs text-gray-600 font-medium">
                      <span>Transaction date</span>
                      <span>
                        {attendeeEventTransactions.paymentDate ? (
                          <DisplayDate
                            date={attendeeEventTransactions.paymentDate}
                          />
                        ) : (
                          "N/A"
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-xs text-gray-600 font-medium">
                      <span>Will Expire In</span>
                      <span>
                        {Math.floor(
                          (new Date(attendeeEventTransactions.expiredAt) -
                            new Date()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-gray-600 font-medium">
                    <span>Reference</span>
                    <span>
                      {attendeeEventTransactions.eventRegistrationRef}
                    </span>
                  </div>
                </div>
                <Button
                  disabled
                  className="bg-basePrimary w-fit flex gap-4 mx-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M7.42854 12H13.1428M7.42854 14.2857H15.4285M7.42854 16.5714H10.8571M18.8571 17.7143V9.71429L13.1428 4H7.42854C6.82233 4 6.24095 4.24082 5.81229 4.66947C5.38364 5.09812 5.14282 5.67951 5.14282 6.28571V17.7143C5.14282 18.3205 5.38364 18.9019 5.81229 19.3305C6.24095 19.7592 6.82233 20 7.42854 20H16.5714C17.1776 20 17.759 19.7592 18.1876 19.3305C18.6163 18.9019 18.8571 18.3205 18.8571 17.7143Z"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.1428 4V7.42857C13.1428 8.03478 13.3836 8.61616 13.8123 9.04482C14.2409 9.47347 14.8223 9.71429 15.4285 9.71429H18.8571"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Invoice</span>
                </Button>
              </>
            )}
          </div>
          <section className="mb-2 pt-2 border-t-[1px] space-y-4 bg-[#F9FAFF]">
            <h4 className="font-semibold text-gray-800 bg-white p-2 m-2 rounded-xl">
              Reward Points
            </h4>
            <div className="flex flex-col p-4 justify-between px-4 bg-basePrimary h-[200px] mx-4 rounded-2xl">
              <div className="rounded-md flex text-white flex-col items-end gap-2">
                <span className="text-sm font-medium">
                  {totalAttendeePoints} pts
                </span>
                <button
                  onClick={() =>
                    router.push(
                      `/event/${event.eventAlias}/market-place/rewards`
                    )
                  }
                  disabled={engagementsSettingsIsLoading}
                  className="rounded-xl bg-white/30 py-1 px-2 text-sm"
                >
                  {!engagementsSettingsIsLoading
                    ? "Redeem Points"
                    : "Loading..."}
                </button>
              </div>
              <div className="space-y-1">
                <div className="w-full bg-white/30 rounded-2xl h-4">
                  <div
                    style={{ width: pointsPercentage + "%" }}
                    className="h-full bg-white/50 rounded-2xl transition-all"
                  />
                </div>
                <span className="text-xs text-white">
                  Your engagement level is{" "}
                  <b>
                    {pointsPercentage < 50
                      ? "low"
                      : pointsPercentage >= 50 && pointsPercentage < 65
                      ? "average"
                      : "high"}
                  </b>{" "}
                  compared to other attendees
                </span>
              </div>
            </div>
            {/* <div className=" rounded-lg bg-white grid grid-cols-3 gap-2 p-2 flex-wrap">
            {mapp}
          </div> */}
          </section>
          {/* <section className="pt-2 border-t-[1px] space-y-4">
        <h3 className="text-lg font-semibold text-greyBlack px-2 border-t-[1px]">
          How to earn points
        </h3>
        <div className="space-y-2">{mapped}</div>
      </section> */}
        </div>
      )}
      {!isEventOwner && !attendeeIsUser && (
        <div className="space-y-4 bg-[#F9FAFF]">
          <h3 className="px-2 text-xl font-bold text-gray-800">Sponsors</h3>
          {loading && (
            <div className="w-full col-span-full h-[300px] flex items-center justify-center">
              <LoaderAlt size={30} className="animate-spin" />
            </div>
          )}
          {!loading && sponsors.length === 0 && (
            <div className="w-full col-span-full items-center flex flex-col justify-center h-[300px]">
              <div className="flex items-center justify-center flex-col gap-y-2">
                <Image
                  src="/images/epartner.png"
                  width={400}
                  height={400}
                  className="w-[100px] h-[100px]"
                  alt="partner"
                />
                <p className="text-[#717171] font-medium">
                  This page is empty. Sponsors will appear here
                </p>
              </div>
            </div>
          )}
          {!loading && sponsors.length > 0 && (
            <div className="overflow-auto no-scrollbar pb-48" ref={divRef}>
              <div className="grid items-center gap-4 px-2">
                {sponsors.map((sponsor) => (
                  <PartnerCard
                    key={sponsor.id}
                    event={event}
                    sponsor={sponsor}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
