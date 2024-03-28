import { DoubleColumnIcon } from "@/constants";
import { StarFill } from "styled-icons/bootstrap";
import { Verified } from "styled-icons/material";

export function FeedBackCard() {
  return (
    <div className="w-[95%] items-start justify-start sm:w-[415px] flex flex-col gap-y-3 py-12 px-6 rounded-lg shadow bg-white">
      <DoubleColumnIcon />
      <p className="leading-6 items-start justify-start w-full flex flex-col">
        Lorem ipsum dolor sit amet consectetur. Nunc sit sed nisi sed sit et
        arcu quis senectus ac proin.
      </p>
      <div className="flex items-center gap-x-3">
        <StarFill size={20} className="text-yellow-500" />
        <StarFill size={20} className="text-yellow-500" />
        <StarFill size={20} className="text-yellow-500" />
        <StarFill size={20} className="text-yellow-500" />
        <StarFill size={20} className="text-yellow-500" />
      </div>

      <div className="items-start justify-start w-full flex flex-col">
        <p className="font-semibold">Abdur Rasheed Saheed</p>
        <div className="text-green-600 flex items-center gap-x-2 text-xs font-medium">
          <Verified size={16} />
          <p>verified attende</p>
        </div>
      </div>
    </div>
  );
}
