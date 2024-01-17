"use client";
import { Button } from "@/components";
import { Lock } from "@styled-icons/fa-solid/Lock";

export function Payment({
  total,
  discount,
  count,
  priceCategory,
  eventDate,
  eventPrice,
  eventTitle,
  eventId,
  attendeesDetails,
}: {
  total?: number;
  discount: number;
  count: number;
  attendeesDetails: any[]
  eventPrice?: number;
  eventId?: number;
  eventDate?: string;
  priceCategory?: string;
  eventTitle?: string;
}) {

    async function submit() {
        console.log({
            eventDate,
            priceCategory,
            event: eventTitle,
            eventId,
            attendeesDetails,
            eventPrice,
        })
    }
  return (
    <div className="w-full h-full bg-[#FAFAFA] fixed inset-0">
      <div className="w-[95%] box-animation sm:w-[439px] rounded-sm shadow gap-y-4 bg-white flex flex-col py-6 px-3 sm:px-4 items-start justify-start">
        <h3 className="text-base sm:text-xl font-medium mb-6">Order Summary</h3>

        <div className="w-full rounded-md border p-3 flex flex-col items-start justify-start gap-y-2">
          <h3>Orders</h3>

          <div className="flex items-center justify-between w-full">
            <p>{`${count}x SubTotal`}</p>
            {total && <p>{`₦${(total + discount)?.toLocaleString()}`}</p>}
          </div>
          <div className="flex items-center justify-between w-full">
            <p>{`${count}x Discount`}</p>
            <p>{`-₦${discount?.toLocaleString()}`}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <p>Total</p>
            <p>{`₦${total?.toLocaleString()}`}</p>
          </div>
        </div>
        <Button
        onClick={submit}
        className="w-full gap-x-2 bg-zikoro text-gray-50 font-medium">
          <Lock size={22} />
          <span>{`Pay ₦${total?.toLocaleString()}`}</span>
        </Button>
      </div>
    </div>
  );
}
