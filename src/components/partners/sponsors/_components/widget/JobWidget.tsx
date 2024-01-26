import { Button } from "@/components";
import { Location } from "@styled-icons/fluentui-system-regular/Location";
import { Bag } from "@styled-icons/ionicons-solid/Bag";
import { User } from "@styled-icons/boxicons-regular/User";
import { BoxSeam } from "styled-icons/bootstrap";

export function JobWidget() {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-y-2">
      <h2 className="font-semibold text-base sm:text-lg">Graphics Designer</h2>

      <p className="text-[#717171]">JEM PARTNERS OUTSOURCING LTD</p>
      <p>₦50,000 - ₦70,000 a month</p>

      <p className="text-xs px-2 py-2 rounded-md text-[#20A0D8] bg-[#20A0D8] bg-opacity-10 mt-3">
        Remote
      </p>

      <p className="w-3/4 flex flex-wrap text-[#717171] items-start justify-start leading-5 text-sm">
        {` Duration:0-3 month(s) Description/Comment: As the Graphics designer for
        Jem Parerns Outsourcing LTDD , you will be in charge of creating fliers
        for marketing and sales.`}
      </p>

      <div className="flex text-[#717171] items-center text-mobile mt-1 gap-x-3">
        <div className="flex items-center gap-x-2">
          <Location size={16} className="text-[#717171]" />
          <p>Ikeja, Nigeria</p>
        </div>
        <div className="flex items-center gap-x-2">
          <Bag size={16} className="text-[#717171]" />
          <p>Full Time</p>
        </div>
        <div className="flex items-center gap-x-2">
          <User size={16} className="text-[#717171]" />
          <p>2 Years Experience</p>
        </div>
        <div className="flex items-center gap-x-2">
          <BoxSeam size={16} className="text-[#717171]" />
          <p>Degree Required</p>
        </div>
      </div>

      <Button className="hover:text-gray-50 mt-3 transform border transition-all duration-300 ease-in-out w-fit border-zikoro hover:bg-zikoro text-zikoro gap-x-2 h-11 sm:h-12 font-medium">
        Apply Now
      </Button>
    </div>
  );
}
