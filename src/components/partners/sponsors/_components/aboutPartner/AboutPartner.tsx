"use client";

import { Button } from "@/components";
import { Whatsapp } from "@styled-icons/remix-fill/Whatsapp";
import { World } from "@styled-icons/boxicons-regular/World";
import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";
import { Email } from "@styled-icons/evaicons-solid/Email";
import { BoothStaffWidget, Edit, JobWidget, SponsoredSessionWidget } from "..";
import Image from "next/image";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { Location } from "@styled-icons/fluentui-system-regular/Location";
import { PhoneCall } from "@styled-icons/boxicons-solid/PhoneCall";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmptyCard } from "@/components/composables";
import { AddJob } from "@/components/partners/_components";
import { TPartner } from "@/types";
import { phoneCall, sendMail, whatsapp } from "@/utils";
export function AboutPartner({
  partner,
  refetch,
  partnerId,
}: {
  partnerId: string;
  refetch: () => Promise<any>;
  partner: TPartner | null;
}) {
  const router = useRouter();
  const [isAddJob, setAddJob] = useState(false);

  function onOpen() {
    setAddJob((prev) => !prev);
  }

  // send mail
  function visitWebsite() {
    window.open(partner?.website, "_blank");
  }

  return (
    <>
      <div className="w-full lg:col-span-5  border-r">
        <section className="flex flex-col border-b items-start gap-y-0 justify-start pb-4 w-full">
          <div className="w-full flex items-center gap-x-2  p-[0.2rem] border-b">
            <Button onClick={() => router.back()}>
              <ArrowBack className="px-1 h-fit w-fit" size={24} />
            </Button>

            <div className="flex items-center px-3 gap-x-6">
              {partner?.stampIt && (
                <button className="bg-[#20A0D8] bg-opacity-10 text-xs text-[#20A0D8] px-2 py-2 rounded-md">
                  StampIT
                </button>
              )}
              <button className="bg-[#F44444] bg-opacity-10 text-xs text-[#F44444] px-2 py-2 rounded-md">
                Promo
              </button>

              {partner?.jobs && partner?.jobs?.length > 0 && (
                <button className="bg-[#20A0D8] bg-opacity-10 text-xs text-[#20A0D8] px-2 py-2 rounded-md">
                  Hiring
                </button>
              )}
            </div>
          </div>

          {partner?.media && (
            <div className="w-full h-64 sm:h-[20.5rem] lg:h-[20.5rem] overflow-hidden">
              <video
                height={500}
                width={1000}
                autoPlay
                muted
                className="w-full h-full  object-cover"
              >
                <source src={partner?.media} type="video/mp4" />
              </video>
            </div>
          )}

          <div className="w-full px-3 mt-4 flex items-center justify-between ">
            <Image
              src={partner?.companyLogo ?? "/images/zikoro.png"}
              alt="sponsor-logo"
              className="w-[150px] max-h-[4rem] h-fit"
              width={200}
              height={90}
            />

            
          </div>
        </section>

        <section className="w-full flex flex-col  pb-2 border-b">
          <div className="w-full px-3 py-3 border-b flex items-center justify-between">
            <p className="font-semibold text-base sm:text-xl">
              Company Description
            </p>
            <Edit partner={partner} refetch={refetch} />
          </div>
          <div className="items-start px-3 py-4 justify-start flex w-full flex-col gap-y-2">
            <p className="mb-4 font-semibold text-base sm:text-xl">
              {partner?.companyName ?? ""}
            </p>
            <div className="w-full flex flex-col items-start justify-start leading-5 text-mobile sm:text-sm text-[#717171]">
              {partner?.description ?? ""}
            </div>
            <div className="flex text-[#717171] text-sm items-center mt-1 gap-x-3">
              <div className="flex items-center gap-x-2">
                <Location size={16} className="text-[#717171]" />
                <p>{`${partner?.city}, ${partner?.country}`}</p>
              </div>
              {partner?.industry && (
                <div className="flex items-center gap-x-2">
                  <IndustryIcon />
                  <p>{partner?.industry}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-x-2">
              {partner?.phoneNumber !== null && (
                <Button
                  onClick={() => phoneCall(partner?.phoneNumber)}
                  className="px-0 h-10 w-10 rounded-full bg-[#F3F3F3] "
                >
                  <PhoneCall size={22} className="text-black" />
                </Button>
              )}
              {partner?.whatsApp !== null && (
                <Button
                  onClick={() => whatsapp(partner?.whatsApp)}
                  className="px-0 h-10 w-10 rounded-full bg-[#F3F3F3] "
                >
                  <Whatsapp size={22} className="text-black" />
                </Button>
              )}
              {partner?.email !== null && (
                <Button
                  onClick={() => sendMail(partner?.email)}
                  className="px-0 h-10 w-10 rounded-full bg-[#F3F3F3] "
                >
                  <Email size={22} className="text-black" />
                </Button>
              )}
              {partner?.website !== null && (
                <Button
                  onClick={visitWebsite}
                  className="px-0 h-10 w-10 rounded-full bg-[#F3F3F3] "
                >
                  <World size={22} className="text-black" />
                </Button>
              )}
            </div>
            <div></div>
          </div>
        </section>

        <section className="w-full flex flex-col border-b">
          <div className="w-full px-3 py-3 border-b ">
            <p className="font-semibold text-base sm:text-xl">
              Sponsored Sessions
            </p>
          </div>
          <div className="items-start pt-4 justify-start flex w-full flex-col px-3">
            {(!partner?.sponsoredSession ||
              (Array.isArray(partner?.sponsoredSession) &&
                partner?.sponsoredSession?.length === 0)) && (
              <div className="w-full flex items-center h-[50px] justify-center ">
                <p className="font-semibold text-mobile sm:text-sm">
                  No Sponsored Session
                </p>
              </div>
            )}
            {Array.isArray(partner?.sponsoredSession) &&
              partner?.sponsoredSession.map((sponsored, idx) => (
                <SponsoredSessionWidget
                  sponsored={sponsored}
                  className={
                    idx === [1, 2, 3].length - 1 ? "border-b-0" : "border-b"
                  }
                  key={idx}
                />
              ))}
          </div>
        </section>

        <section className="w-full flex flex-col  pb-2 border-b">
          <div className="w-full px-3 py-3 border-b flex items-center justify-between">
            <p className="font-semibold text-base sm:text-xl">Booth Staff</p>
            <Edit partner={partner} refetch={refetch} />
          </div>
          <div className="w-full px-3 py-4 grid grid-cols-3 items-center gap-4">
            {Array.isArray(partner?.boothStaff) &&
              partner?.boothStaff.map((v) => (
                <BoothStaffWidget
                  key={v?.email}
                  profession={v?.jobTitle}
                  company={v?.organization}
                  name={`${v?.firstName} ${v?.lastName}`}
                  email={v?.email}
                  image={v?.profilePicture}
                />
              ))}
          </div>
        </section>

        <section className="w-full flex flex-col  pb-2 border-b">
          <div className="w-full px-3 py-3 border-b flex items-center justify-between">
            <p className="font-semibold text-base sm:text-xl">Jobs</p>

            <Button onClick={onOpen} className="px-1 h-fit w-fitf">
              <PlusCircle size={24} />
            </Button>
          </div>
          <div className="w-full px-3 py-4 grid grid-cols-1 items-center gap-6">
            {partner?.jobs === null || (Array.isArray(partner?.jobs) && partner?.jobs?.length === 0) && (
              <div className="w-full flex col-span-full items-center justify-center h-[50px]">
                <p className="font-semibold text-mobile sm:text-sm">No available Job</p>
              </div>
            )}
            {Array.isArray(partner?.jobs) &&
              partner?.jobs.map((job, index) => (
                <JobWidget
                  key={index}
                  job={job}
                  className={
                    index === partner?.jobs?.length - 1
                      ? "border-b-0"
                      : "border-b"
                  }
                />
              ))}
          </div>
        </section>
      </div>

      {isAddJob && (
        <AddJob
          partner={partner}
          refetch={refetch}
          close={onOpen}
          partnerId={partnerId}
        />
      )}
    </>
  );
}

// to be removed when changes are merged
function IndustryIcon() {
  return (
    <svg width="17" height="18" viewBox="0 0 17 18" fill="none">
      <g id="material-symbols-light:home-work-outline-rounded">
        <path
          id="Vector"
          d="M11.6578 6.77863L12.6843 6.75825L12.6639 5.73178L11.6374 5.75216L11.6578 6.77863ZM11.7107 9.44477L12.7372 9.42439L12.7168 8.39792L11.6904 8.4183L11.7107 9.44477ZM11.7637 12.1109L12.7901 12.0905L12.7698 11.0641L11.7433 11.0844L11.7637 12.1109ZM13.91 14.2221L11.3198 14.2735C11.2252 14.2754 11.1455 14.2449 11.0806 14.1822C11.0154 14.1195 10.9818 14.041 10.98 13.9468C10.9781 13.8526 11.0085 13.7729 11.0712 13.7076C11.134 13.6428 11.2124 13.6095 11.3066 13.6076L13.8961 13.5562C14.0156 13.5538 14.1131 13.5134 14.1884 13.435C14.2638 13.3566 14.3003 13.2577 14.2979 13.1381L14.1289 4.62582C14.1265 4.50629 14.0861 4.40885 14.0077 4.3335C13.9293 4.25815 13.8304 4.22167 13.7108 4.22404L8.12194 4.33499C8.00197 4.33737 7.90453 4.37776 7.82962 4.45615C7.75472 4.53454 7.71824 4.63351 7.72016 4.75305L7.74098 5.80151L7.06493 5.3355L7.05348 4.75895C7.04768 4.46656 7.14778 4.21319 7.35379 3.99884C7.5598 3.78449 7.80877 3.67441 8.10071 3.66862L13.6976 3.5575C13.9936 3.55163 14.2489 3.65214 14.4637 3.85902C14.679 4.06546 14.7896 4.31665 14.7954 4.61259L14.9644 13.1242C14.9703 13.4202 14.8698 13.6756 14.6629 13.8904C14.4565 14.1056 14.2059 14.2162 13.91 14.2221ZM2.73153 14.444C2.43559 14.4499 2.18021 14.3493 1.9654 14.1425C1.75014 13.936 1.63958 13.6848 1.63371 13.3889L1.55362 9.35502C1.55023 9.18394 1.58628 9.01808 1.66177 8.85744C1.73727 8.69725 1.84582 8.56729 1.98743 8.46757L4.86899 6.33462C5.05655 6.19843 5.26364 6.12808 5.49026 6.12358C5.71688 6.11908 5.9266 6.18115 6.11941 6.3098L9.08336 8.3267C9.22881 8.42072 9.34244 8.54626 9.42424 8.70334C9.50605 8.86086 9.54865 9.02515 9.55205 9.19623L9.63213 13.2301C9.63801 13.526 9.5375 13.7814 9.33061 13.9962C9.12418 14.2115 8.87299 14.3221 8.57705 14.3279L7.03868 14.3585C6.88627 14.3615 6.75727 14.3125 6.65169 14.2115C6.54655 14.1104 6.49246 13.9835 6.48943 13.8306L6.44058 11.3698L4.74891 11.4033L4.79776 13.8642C4.8008 14.017 4.75179 14.146 4.65075 14.2512C4.54926 14.3563 4.42231 14.4104 4.26989 14.4134L2.73153 14.444ZM2.22008 9.33779L2.30024 13.3757C2.30262 13.4952 2.343 13.5926 2.4214 13.668C2.4998 13.7433 2.59877 13.7798 2.7183 13.7774L4.12869 13.7494L4.07983 11.2886C4.0768 11.1357 4.1258 11.0067 4.22685 10.9016C4.32789 10.7965 4.45462 10.7424 4.60704 10.7394L6.55599 10.7007C6.7084 10.6976 6.83718 10.7466 6.94231 10.8477C7.04745 10.9487 7.10154 11.0757 7.10457 11.2285L7.15342 13.6894L8.56381 13.6614C8.68335 13.659 8.78079 13.6186 8.85613 13.5402C8.93148 13.4618 8.96797 13.3629 8.9656 13.2433L8.88543 9.20546C8.88408 9.13703 8.86791 9.07312 8.83695 9.01372C8.80555 8.95478 8.75966 8.90457 8.69927 8.86309L5.73589 6.87485C5.66644 6.82511 5.58906 6.80109 5.50374 6.80278C5.41843 6.80447 5.34206 6.83155 5.27464 6.88401L2.39251 8.9883C2.33381 9.03214 2.28995 9.08413 2.26091 9.14427C2.23233 9.20485 2.21872 9.26936 2.22008 9.33779Z"
          fill="#717171"
        />
      </g>
    </svg>
  );
}
