import { Button } from "@/components";
import { Location } from "@styled-icons/fluentui-system-regular/Location";
import { Bag } from "@styled-icons/ionicons-solid/Bag";
import { User } from "@styled-icons/boxicons-regular/User";
import { BoxSeam } from "styled-icons/bootstrap";
import { PartnerJobType } from "@/types";
import { useMemo } from "react";
import { COUNTRIES_CURRENCY } from "@/utils";
import { FlexibilityType } from "..";
import {cn} from "@/lib"

export function JobWidget({ job, className }: { job: PartnerJobType, className:string }) {
  const currency = useMemo(() => {
    if (job.currencyCode) {
      const symbol =
        COUNTRIES_CURRENCY.find(
          (v) => String(v.code) === String(job.currencyCode)
        )?.symbol || "₦";
      return symbol;
    }
  }, [job.currencyCode]);


  function apply() {
    window.open(job.applicationLink, "_blank")
  }
  return (
    <div className={cn("w-full flex flex-col pb-4 items-start justify-start gap-y-2", className)}>
      <h2 className="font-semibold text-base sm:text-lg">
        {job.jobTitle ?? ""}
      </h2>

     {/* <p className="text-[#717171] uppercase">{job.companyName}</p> */}
      <p>{`${currency || "₦"}${Number(job.minSalary)?.toLocaleString()} - ${
        currency || "₦"
      }${Number(job.maxSalary)?.toLocaleString()} ${job.salaryDuration}`}</p>

      <FlexibilityType flexibility={job.flexibility} />

      <p className="w-3/4 flex flex-wrap text-[#717171] items-start justify-start leading-5 text-sm">
        {`${job.description ?? ""}`}
      </p>

      <div className="flex text-[#717171] items-center text-mobile mt-1 gap-x-3">
        <div className="flex items-center gap-x-2">
          <Location size={16} className="text-[#717171]" />
          <p>{`${job.city}, ${job.country}`}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <Bag size={16} className="text-[#717171]" />
          <p>{job.employmentType}</p>
        </div>
        <div className="flex capitalize items-center gap-x-2">
          <User size={16} className="text-[#717171]" />
          <p>{`${job.experienceLevel} Experience`}</p>
        </div>
        <div className="flex  items-center gap-x-2">
          <BoxSeam size={16} className="text-[#717171]" />
          <p>{job.qualification}</p>
        </div>
      </div>

      <Button
      onClick={apply}
      className="hover:text-gray-50 mt-3 transform border transition-all duration-300 ease-in-out w-fit border-zikoro hover:bg-zikoro text-zikoro gap-x-2 h-11 sm:h-12 font-medium">
        Apply Now
      </Button>
    </div>
  );
}
