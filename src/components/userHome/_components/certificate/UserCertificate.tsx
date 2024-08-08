"use client";

import { NavigateNext } from "@styled-icons/material-rounded/NavigateNext";
import { useGetUserCertificates } from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { AllDatas, CertificateWidget } from "..";
import useDisclose from "@/hooks/common/useDisclose";
export function UserCertificates() {
  const { attendeeCertificates, isLoading } = useGetUserCertificates();
  const { isOpen, onOpen, onClose } = useDisclose();
  return (
    <>
    <div className="w-full xl:col-span-5 h-full bg-white shadow rounded-lg pb-6">
      <h2 className="font-semibold text-base sm:text-lg p-4">Certificates</h2>
      <div className="w-full grid grid-cols-1 px-4 md:grid-cols-2 items-center gap-4  mt-3 ">
        {isLoading && 
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={24} className="animate-spin"/>
        </div>
        }
        {!isLoading &&  Array.isArray(attendeeCertificates) && attendeeCertificates?.length === 0 && 
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
        <p className="font-semibold">No Certificate</p>
      </div>
        }
        {!isLoading && Array.isArray(attendeeCertificates) &&
          attendeeCertificates
            ?.slice(0, 2)
            ?.map((attendeeCertificate) => (
              <CertificateWidget key={attendeeCertificate?.id} certificate={attendeeCertificate} />
            ))}
      {Array.isArray(attendeeCertificates) && attendeeCertificates?.length > 3 &&  <div className="w-full col-span-full flex items-end mt-10 justify-end">
          <button
           onClick={onOpen}
          className="flex items-center gap-x-2 text-basePrimary">
            <p className="text-mobile sm:text-sm">See All</p>
            <NavigateNext size={20} />
          </button>
        </div>}
      </div>
    </div>
       {isOpen && <AllDatas data={attendeeCertificates} onClose={onClose} title={"All Certificates"} />}
  </>
       );
}

