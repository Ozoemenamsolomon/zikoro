"use client"
 
import Image from "next/image";
import { AlertCircle } from "@styled-icons/feather/AlertCircle";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import { Button } from "@/components";
export function OfferCard() {
  return (
    <div className="w-full h-fit pb-3 flex flex-col border rounded-md  gap-y-2 items-start">
      <div className="relative w-full h-40 sm:h-56 rounded-t-md overflow-hidden">
        <Image
          src="/images/product.png"
          alt="product"
          width={600}
          height={600}
          className="w-full rounded-t-md h-40 sm:h-56"
        />
        <span className="absolute text-white text-xs bg-zikoro px-2 py-1 rounded-bl-lg top-0 right-0">
          2%
        </span>
      </div>
      <div className="w-full px-3 flex items-start justify-between">
        <div className="flex flex-col items-start justify-start">
          <p className="font-medium">40% OFF Sales Price</p>
          <p className="text-xs text-gray-600">Sneakers</p>
        </div>
        <AlertCircle className="text-gray-600" size={22} />
      </div>
      <div className="flex px-3 items-center gap-x-3">
        <p className="font-semibold"> ₦40,000</p>
        <p className="font-semibold text-gray-400"> ₦50,000</p>
      </div>
      <p className="px-3 text-gray-600">Offer Valid Until Nov. 1 2023</p>
      <div className="px-3 w-full mt-1 flex items-center justify-between">
        <p className="text-zikoro text-sm font-semibold">Get Offer</p>
        <p className="font-semibold text-zinc-700 text-sm">
          Discount code: 534rewfw
        </p>{" "}
      </div>
    </div>
  );
}

function OfferCardModal({close}:{close:()  => void}) {
  return (
    <div
    role="button"
    onClick={close}
    className="w-full h-full fixed z-[100]  inset-0 bg-black/50"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      role="button"
      className="w-[95%] sm:w-[500px] box-animation h-fit flex mb-10 flex-col gap-y-6 rounded-lg bg-white  m-auto absolute inset-x-0 py-6 px-3 sm:px-4"
    >
      <div className="w-full flex items-end justify-end">
       
        <Button onClick={close} className="px-1 h-fit w-fit">
          <CloseOutline size={22} />
        </Button>
      </div>

      <div className="w-full h-fit pb-3 flex flex-col  gap-y-2 items-start">
      <div className="relative w-full h-40 sm:h-56 rounded-t-md overflow-hidden">
        <Image
          src="/images/product.png"
          alt="product"
          width={600}
          height={600}
          className="w-full rounded-t-md h-40 sm:h-56"
        />
        <span className="absolute text-white text-xs bg-zikoro px-2 py-1 rounded-bl-lg top-0 right-0">
          2%
        </span>
      </div>
      <div className="w-full px-3 flex items-start justify-between">
        <div className="flex flex-col items-start justify-start">
          <p className="font-medium">40% OFF Sales Price</p>
          <p className="text-xs text-gray-600">Sneakers</p>
        </div>
      
      </div>
      <div className="flex px-3 items-center gap-x-3">
        <p className="font-semibold"> ₦40,000</p>
        <p className="font-semibold text-gray-400"> ₦50,000</p>
      </div>
      <p className="px-3 text-gray-600">Offer Valid Until Nov. 1 2023</p>
      <div className="px-3 w-full mt-1 flex items-center justify-between">
        <p className="text-zikoro text-sm font-semibold">Get Offer</p>
        <p className="font-semibold text-zinc-700 text-sm">
          Discount code: 534rewfw
        </p>{" "}
      </div>
    </div>
      
      </div></div>
  )
}