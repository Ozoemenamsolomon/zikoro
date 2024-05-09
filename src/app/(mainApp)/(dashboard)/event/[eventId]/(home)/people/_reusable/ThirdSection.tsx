// @ts-nocheck
"use client";
import RewardCard from "@/components/RewardCard";
import PointsCard from "@/components/PointsCard";
import { Button } from "@/components/ui/button";
import { TAttendee } from "@/types/attendee";
import { useGetAttendeeEventTransactions } from "@/hooks/services/billing";
import { formatDate, isWithinTimeRange } from "@/utils/date";
import { useEffect, useMemo } from "react";
import { getCookie, useFetchPartners } from "@/hooks";
import { Event, TExPartner, TUser } from "@/types";
import { PartnerCard } from "@/components/partners/sponsors/_components";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { TExPartner } from "@/types";
import Image from "next/image";

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
}: {
  attendee: TAttendee;
  event: Event;
  sponsors: TExPartner;
  loading: boolean;
}) {
  const { eventRegistrationRef, id } = attendee;
  const user = getCookie<TUser>("user");
  const { attendeeEventTransactions, isLoading, getAttendeeEventTransactions } =
    useGetAttendeeEventTransactions({
      userId: user ? user.id : 0,
      eventRegistrationRef,
    });

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

  if (String(event?.createdBy) === String(user.id)) {
    return (
      <>
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
                  <span>{attendeeEventTransactions.eventRegistrationRef}</span>
                </div>
              </div>
              <Button disabled className="bg-basePrimary w-fit flex gap-4 mx-2">
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
        <section className="mb-2 pt-2 border-t-[1px] space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="font-semibold text-greyBlack">Reward Points</h4>
            <button className="px-3 py-2 rounded-md flex gap-3 bg-[#3F845F] text-white items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 25"
                fill="none"
              >
                <g clip-path="url(#clip0_11614_9220)">
                  <path
                    d="M7.0979 10.876L1.85669 20.7506L6.61617 20.3109L8.91975 24.4994L14.161 14.6247L7.0979 10.876Z"
                    fill="#E95454"
                  />
                  <path
                    d="M7.69834 21.6241C7.84541 21.3082 7.69159 20.9308 7.38394 20.7672L7.0823 20.6066C6.78066 20.4348 6.66585 20.0529 6.83018 19.7437C6.99676 19.4293 7.38844 19.3093 7.70284 19.4759L8.55524 19.9283C8.81861 20.0679 9.14877 19.9666 9.28458 19.7017L9.30559 19.6612C9.46167 19.4113 9.36937 19.0812 9.10975 18.9439L6.56006 17.591C6.24941 17.4259 6.09709 17.05 6.24191 16.7333C6.40173 16.3964 6.80542 16.2636 7.13032 16.4362L9.49543 17.6915C9.7588 17.8311 10.089 17.7298 10.2285 17.4664L10.242 17.4319L10.2458 17.4244C10.3966 17.1483 10.2908 16.8016 10.0124 16.6538L8.6858 15.95C8.37516 15.7849 8.22283 15.4089 8.3699 15.0885C8.52823 14.7554 8.93342 14.6188 9.25832 14.7914L10.7238 15.5695C10.9976 15.7151 11.3248 15.5935 11.4666 15.3174C11.4689 15.3137 11.4689 15.3137 11.4704 15.3099C11.4726 15.3062 11.4726 15.3062 11.4741 15.3024C11.6234 15.03 11.5409 14.6909 11.2663 14.546L9.68527 13.7072C9.37838 13.5443 9.22605 13.1684 9.37087 12.8518C9.5307 12.5148 9.93439 12.382 10.2593 12.5546L14.1596 14.6248L8.91841 24.4995L7.47398 21.874C7.56703 21.811 7.64806 21.7329 7.69834 21.6241Z"
                    fill="#ED6362"
                  />
                  <path
                    d="M16.9022 10.876L22.1434 20.7506L17.3839 20.3109L15.0803 24.4994L9.83911 14.6247L16.9022 10.876Z"
                    fill="#ED6362"
                  />
                  <path
                    d="M16.3019 21.6239C16.1548 21.308 16.3086 20.9305 16.6163 20.7669L16.9179 20.6064C17.2196 20.4345 17.3344 20.0526 17.17 19.7435C17.0035 19.4291 16.6118 19.309 16.2974 19.4756L15.445 19.9281C15.1816 20.0676 14.8514 19.9663 14.7156 19.7014L14.6946 19.6609C14.5385 19.4111 14.6308 19.0809 14.8905 18.9436L17.4409 17.59C17.7516 17.4249 17.9039 17.049 17.7591 16.7323C17.5992 16.3954 17.1955 16.2626 16.8706 16.4352L14.5055 17.6905C14.2422 17.8301 13.912 17.7288 13.7724 17.4654L13.7589 17.4309L13.7552 17.4234C13.6044 17.1473 13.7102 16.8006 13.9885 16.6528L15.3152 15.9489C15.6258 15.7839 15.7781 15.4079 15.6311 15.0875C15.4727 14.7544 15.0675 14.6178 14.7426 14.7904L13.2757 15.57C13.0018 15.7156 12.6747 15.594 12.5329 15.3179C12.5306 15.3141 12.5306 15.3141 12.5291 15.3104C12.5269 15.3066 12.5269 15.3066 12.5254 15.3029C12.376 15.0305 12.4586 14.6914 12.7332 14.5465L14.3142 13.7076C14.6211 13.5448 14.7734 13.1689 14.6286 12.8522C14.4688 12.5153 14.0651 12.3825 13.7402 12.5551L9.83984 14.6253L15.0811 24.4999L16.5255 21.8745C16.4332 21.8107 16.3521 21.7327 16.3019 21.6239Z"
                    fill="#E95454"
                  />
                  <path
                    d="M12 18.0147C16.8366 18.0147 20.7574 14.0939 20.7574 9.25735C20.7574 4.4208 16.8366 0.5 12 0.5C7.16348 0.5 3.24268 4.4208 3.24268 9.25735C3.24268 14.0939 7.16348 18.0147 12 18.0147Z"
                    fill="#FFCC5B"
                  />
                  <path
                    d="M13.1877 8.25255H7.63811C7.20666 8.25255 6.8525 7.89839 6.8525 7.46693L6.8585 7.41291V7.4009C6.8525 6.94544 7.22392 6.57327 7.68013 6.57327H11.5264C12.0359 6.57327 12.4861 6.19584 12.5162 5.6856C12.5402 5.1521 12.1147 4.70189 11.5805 4.70189H7.50605C7.05659 4.70189 6.72043 4.32446 6.72644 3.87425C6.72644 3.86825 6.72644 3.86825 6.72644 3.86224C6.72644 3.85624 6.72644 3.85624 6.72644 3.85024C6.72043 3.40078 7.05584 3.0226 7.50605 3.0226H11.7696C12.273 3.0226 12.7232 2.64517 12.7533 2.14094C12.7773 1.60143 12.3518 1.15723 11.8176 1.15723H8.69536C5.51162 2.46959 3.26807 5.60006 3.26807 9.25727C3.26807 12.9145 5.51162 16.0442 8.69611 17.3551H12.6602C13.1637 17.3551 13.6139 16.9776 13.6439 16.4734C13.6679 15.9339 13.2425 15.4904 12.7082 15.4904L8.19863 15.4897C7.66663 15.4897 7.23818 15.0447 7.26669 14.506C7.29295 14.0017 7.74617 13.6228 8.25115 13.6228H9.99947C10.5022 13.6086 10.9081 13.1966 10.9081 12.6901C10.9081 12.1746 10.4887 11.7544 9.97246 11.7544H7.32222C6.89076 11.7544 6.5366 11.401 6.5426 10.9688V10.9028C6.51259 10.4773 6.85475 10.1172 7.2802 10.1172H13.1337C13.6432 10.1172 14.0934 9.73975 14.1234 9.23551C14.1474 8.69676 13.7212 8.25255 13.1877 8.25255Z"
                    fill="#FDBC4B"
                  />
                  <path
                    d="M12 15.508C8.55284 15.508 5.74878 12.7031 5.74878 9.25678C5.74878 5.81041 8.55284 3.00635 12 3.00635C15.4471 3.00635 18.2511 5.81116 18.2511 9.25753C18.2511 12.7039 15.4471 15.508 12 15.508Z"
                    fill="#FFDB70"
                  />
                  <path
                    opacity="0.2"
                    d="M18.2512 9.25759C18.2512 5.93203 15.6385 3.212 12.3587 3.02441H11.7764C11.3922 3.02441 11.0493 3.31255 11.0261 3.69673C11.0081 4.10792 11.3322 4.44708 11.7397 4.44708L15.1793 4.44783C15.5852 4.44783 15.9116 4.78699 15.8898 5.19818C15.8696 5.58311 15.5244 5.872 15.1387 5.872H13.8054C13.4219 5.88325 13.112 6.1969 13.112 6.58333C13.112 6.97652 13.4324 7.29692 13.8256 7.29692H15.8471C16.1765 7.29692 16.4459 7.56704 16.4414 7.8957V7.94522C16.4639 8.27012 16.2035 8.544 15.8786 8.544H11.4147C11.0261 8.544 10.6832 8.83214 10.6599 9.21632C10.6419 9.62751 10.966 9.96667 11.3735 9.96667H15.6055C15.9349 9.96667 16.2042 10.2368 16.2042 10.5654L16.1997 10.6067V10.6157C16.2042 10.9631 15.9206 11.2468 15.5732 11.2468H12.6393C12.2506 11.2468 11.9077 11.5349 11.8845 11.9236C11.8665 12.3303 12.1906 12.6739 12.5981 12.6739H15.7053C16.0482 12.6739 16.304 12.9621 16.2995 13.305C16.2995 13.3095 16.2995 13.3095 16.2995 13.314C16.2995 13.3185 16.2995 13.3185 16.2995 13.323C16.304 13.6659 16.0482 13.954 15.7053 13.954H12.454C12.0698 13.954 11.7269 14.2422 11.7036 14.6264C11.6856 15.0383 12.0098 15.3767 12.4172 15.3767H13.2749C16.1135 14.7854 18.2512 12.2665 18.2512 9.25759Z"
                    fill="white"
                  />
                  <path
                    d="M16.364 7.87306H13.3235L12.3834 4.9812C12.2625 4.60978 11.7365 4.60978 11.6157 4.9812L10.6763 7.87306H7.63588C7.24494 7.87306 7.08212 8.37354 7.39876 8.60315L9.85842 10.3905L8.91898 13.2823C8.79817 13.6538 9.22362 13.9629 9.54027 13.7333L11.9999 11.946L14.4596 13.7333C14.7762 13.9629 15.2017 13.6538 15.0809 13.2823L14.1414 10.3905L16.6011 8.60315C16.917 8.37354 16.7549 7.87306 16.364 7.87306Z"
                    fill="#EC9922"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_11614_9220">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <span className="text-xs font-medium">12300 pts</span>
            </button>
          </div>
          <div className=" rounded-lg bg-white grid grid-cols-3 gap-2 p-2 flex-wrap">
            {mapp}
          </div>
        </section>
        {/* <section className="pt-2 border-t-[1px] space-y-4">
        <h3 className="text-lg font-semibold text-greyBlack px-2 border-t-[1px]">
          How to earn points
        </h3>
        <div className="space-y-2">{mapped}</div>
      </section> */}
      </>
    );
  }

  return (
    <div className="w-full h-full grid mt-6 items-center gap-4 px-2">
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
      {!loading &&
        sponsors.length > 0 &&
        sponsors.map((sponsor) => (
          <PartnerCard key={sponsor.id} eventId={eventId} sponsor={sponsor} />
        ))}
    </div>
  );
}
