"use client";

import { useForm } from "react-hook-form";
import { SideBarLayout } from "..";
import { Form, FormControl, FormField, FormItem, Input } from "..";
import {HeaderTab } from "./_components";
import { Search } from "@styled-icons/evil/Search";
import { Gift } from "@styled-icons/bootstrap/Gift";
import { usePartnersTab } from "@/context";
import { Briefcase } from "@styled-icons/ionicons-outline/Briefcase";
import { RecordCircle } from "@styled-icons/bootstrap/RecordCircle";
import { PartnersEnum } from "@/types";
import { Stamp } from "@styled-icons/fa-solid/Stamp";
import { LocationOn } from "@styled-icons/material-outlined/LocationOn";
import { Sponsors } from "./sponsors/Sponsors";
import { Exhibitors } from "./sponsors/Exhibitors";
import { useFetchPartners } from "@/hooks";


export function Partners({ eventId }: { eventId: string }) {
  const form = useForm();
  const { active } = usePartnersTab();
  const {data, loading} = useFetchPartners(eventId)

  return (
    <SideBarLayout className="px-0 sm:px-0">
      <HeaderTab eventId={eventId}/>

      <div className="w-full flex items-center justify-between p-4">
        <div className=" w-[90%] flex items-center">
          <button className="flex  items-center  relative hover:text-zikoro  w-fit px-3  text-[#D6D6D6]  gap-x-1">
            <IndustryIcon />
            <p className="">Company Name </p>
          </button>
          <button className="flex relative items-center hover:text-zikoro w-fit px-3 border-x text-[#D6D6D6]  gap-x-1">
            <LocationOn size={16} />
            <p>Location </p>
          </button>
          <button className="flex relative items-center hover:text-zikoro w-fit px-3 border-r  text-[#D6D6D6]  gap-x-1">
            <Briefcase size={16} />
            <p>Industry</p>
          </button>

          <button className="flex relative items-center hover:text-zikoro w-fit px-3 border-r text-[#D6D6D6]  gap-x-1">
            <RecordCircle size={16} />
            <p>Exhibition Hall </p>
          </button>
          <button className="flex relative items-center hover:text-zikoro w-fit px-3 border-r text-[#D6D6D6]  gap-x-1">
            <Gift size={16} />
            <p>Promo </p>
          </button>
          <button className="flex relative items-center hover:text-zikoro w-fit px-3 text-[#D6D6D6]  gap-x-1">
            <Stamp size={16} />
            <p>StampIT </p>
          </button>
        </div>
        <div className="flex items-center">
          <Form {...form}>
            <form className="w-fit">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative w-80 h-12">
                        <Search size={22} className="absolute top-3 left-2" />
                        <Input
                          type="search"
                          placeholder="search sponsor"
                          {...field}
                          className=" placeholder:text-sm h-12 pr-4 pl-10 w-80  focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
         
        </div>
      </div>

      {active === PartnersEnum.SPONSORS_TAB && <Sponsors data={data} />}
      {active === PartnersEnum.EXHIBITORS_TAB &&  <Exhibitors data={data} />}
    
    </SideBarLayout>
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
