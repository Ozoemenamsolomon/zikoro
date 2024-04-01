"use client";

import { AboutWidget } from "@/components/composables";
import Image from "next/image";
import { Users } from "@styled-icons/heroicons-outline/Users";
import { Check2 } from "@styled-icons/bootstrap/Check2";
import { CheckmarkDone } from "styled-icons/ionicons-outline";
import { NavigateNext } from "@styled-icons/material-rounded/NavigateNext";
import Link from "next/link";
import { useGetCertificates } from "@/hooks";
import { TCertificate } from "@/types";
import { LoaderAlt } from "styled-icons/boxicons-regular";
export function UserCertificates() {
  const { certificates, isLoading } = useGetCertificates();
  return (
    <div className="w-full xl:col-span-5 h-full bg-white shadow rounded-lg pb-6">
      <h2 className="font-semibold text-base sm:text-lg p-4">Certificates</h2>
      <div className="w-full grid grid-cols-1 px-4 md:grid-cols-2 items-center gap-4  mt-3 ">
        {isLoading && 
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={24} className="animate-spin"/>
        </div>
        }
        {!isLoading &&  Array.isArray(certificates) && certificates?.length === 0 && 
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
        <p>- No Certificate -</p>
      </div>
        }
        {!isLoading && Array.isArray(certificates) &&
          certificates
            ?.slice(0, 2)
            ?.map((certificate) => (
              <Widget key={certificate?.id} certificate={certificate} />
            ))}
        <div className="w-full col-span-full flex items-end mt-10 justify-end">
          <Link href="/" className="flex items-center gap-x-2 text-basePrimary">
            <p className="text-mobile sm:text-sm">See All</p>
            <NavigateNext size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Widget({ certificate }: { certificate: TCertificate }) {
  return (
    <div className="w-full">
      {certificate?.cerificateUrl ? (
        <Image
          width={500}
          height={500}
          alt="certificate"
          src={certificate?.cerificateUrl}
          className="w-full h-[250px] rounded-t-lg"
        />
      ) : (
        <div className="w-full h-[250px] rounded-t-lg animate-pulse">
          <div className="w-full h-full bg-gray-200"></div>
        </div>
      )}
      <div className="w-full flex items-start gap-x-3 p-3 sm:p-4 shadow border rounded-b-lg">
        <div className="flex gap-y-1 flex-col items-start justify-start">
          <p className="font-semibold text-base sm:text-lg">
            Resin Jwellery Workshop
          </p>
          <AboutWidget
            Icon={Users}
            text="Event Attendees except moderator and partners"
          />
          <p className="text-sm">!st January 2024. Lagos, Nigeria</p>

          <AboutWidget Icon={Check2} text="Issued" />
        </div>

        <div className="rounded-lg flex flex-col items-center p-2 border">
          <CheckmarkDone size={22} />
          <p className="text-sm">100%</p>
        </div>
      </div>
    </div>
  );
}
